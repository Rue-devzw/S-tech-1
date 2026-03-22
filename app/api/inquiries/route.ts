import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPersistenceConfigurationErrorMessage, isWorkersReadOnlyPreviewMode } from "@/lib/server/runtime";
import { enforceRequestRateLimit } from "@/lib/server/request-guard";
import {
  createInquiry,
  getListingById,
  hasRecentDuplicateInquiry,
  recordAnalyticsEvent,
  recordRequestEvent,
  recordSecurityAudit,
} from "@/lib/server/data-store";

const createInquirySchema = z.object({
  listingId: z.string().min(1),
  userName: z.string().min(2).max(80),
  userEmail: z.string().email(),
  message: z.string().min(10).max(2000),
  website: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  if (isWorkersReadOnlyPreviewMode()) {
    return NextResponse.json(
      {
        error: getPersistenceConfigurationErrorMessage(),
      },
      { status: 503 }
    );
  }

  const payload = await request.json().catch(() => null);
  const rateLimit = await enforceRequestRateLimit({
    request,
    route: "/api/inquiries",
    actor: "public:inquiry",
    buckets: [
      {
        limit: 5,
        windowMs: 60 * 60 * 1000,
        scope: "fingerprint",
      },
    ],
  });

  if (rateLimit.response) {
    return rateLimit.response;
  }

  const parsed = createInquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide valid inquiry details." },
      { status: 400 }
    );
  }

  const listing = await getListingById(parsed.data.listingId);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  if (parsed.data.website) {
    await Promise.all([
      recordRequestEvent({
        route: "/api/inquiries",
        fingerprint: rateLimit.fingerprint,
        eventType: "spam_blocked",
        metadata: {
          listingId: parsed.data.listingId,
          reason: "honeypot",
          userEmail: parsed.data.userEmail,
        },
      }),
      recordSecurityAudit({
        actor: `public:${rateLimit.fingerprint}`,
        action: "security.spam_blocked",
        entityId: parsed.data.listingId,
        summary: "Blocked inquiry submission via honeypot field",
        metadata: {
          route: "/api/inquiries",
          userEmail: parsed.data.userEmail,
        },
      }),
    ]);

    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const duplicate = await hasRecentDuplicateInquiry({
    listingId: listing.id,
    userEmail: parsed.data.userEmail,
    message: parsed.data.message,
    windowMs: 30 * 60 * 1000,
  });

  if (duplicate) {
    await Promise.all([
      recordRequestEvent({
        route: "/api/inquiries",
        fingerprint: rateLimit.fingerprint,
        eventType: "spam_blocked",
        metadata: {
          listingId: listing.id,
          reason: "duplicate",
          userEmail: parsed.data.userEmail,
        },
      }),
      recordSecurityAudit({
        actor: `public:${rateLimit.fingerprint}`,
        action: "security.spam_blocked",
        entityId: listing.id,
        summary: "Blocked duplicate inquiry submission",
        metadata: {
          route: "/api/inquiries",
          userEmail: parsed.data.userEmail,
        },
      }),
    ]);

    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const inquiry = await createInquiry({
    listingId: listing.id,
    listingName: listing.name,
    userName: parsed.data.userName,
    userEmail: parsed.data.userEmail,
    message: parsed.data.message,
  });

  await recordAnalyticsEvent({
    route: "/api/inquiries",
    fingerprint: rateLimit.fingerprint,
    eventType: "inquiry_created",
    subject: listing.id,
    metadata: {
      inquiryId: inquiry.id,
      listingId: listing.id,
      listingName: listing.name,
      category: listing.category,
      price: listing.price,
    },
  }).catch(() => undefined);

  return NextResponse.json({ inquiry }, { status: 201 });
}
