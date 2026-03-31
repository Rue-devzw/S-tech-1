import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CONTACT_TOPIC_VALUES,
  getContactTopic,
  getListingIdForContactTopic,
} from "@/lib/contact-topics";
import {
  getPersistenceConfigurationErrorMessage,
  isWorkersReadOnlyPreviewMode,
} from "@/lib/server/runtime";
import { enforceRequestRateLimit } from "@/lib/server/request-guard";
import {
  createInquiry,
  getListingById,
  hasRecentDuplicateInquiry,
  recordAnalyticsEvent,
  recordRequestEvent,
  recordSecurityAudit,
} from "@/lib/server/data-store";

const createContactSchema = z.object({
  listingId: z.string().min(1).optional(),
  topic: z.enum(CONTACT_TOPIC_VALUES).optional(),
  userName: z.string().min(2).max(80),
  userEmail: z.string().email(),
  company: z.string().max(120).optional(),
  timeline: z.string().max(120).optional(),
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
    route: "/api/contact",
    actor: "public:contact",
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

  const parsed = createContactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide valid contact details." },
      { status: 400 }
    );
  }

  if (!parsed.data.listingId && !parsed.data.topic) {
    return NextResponse.json(
      { error: "Please choose a topic for your inquiry." },
      { status: 400 }
    );
  }

  const resolvedListingId =
    parsed.data.listingId ??
    getListingIdForContactTopic(parsed.data.topic ?? "general");
  const listing = await getListingById(resolvedListingId);

  if (!listing) {
    return NextResponse.json(
      { error: "Unable to route this inquiry right now." },
      { status: 404 }
    );
  }

  const topicLabel = parsed.data.topic
    ? getContactTopic(parsed.data.topic).label
    : null;
  const composedMessage = [
    topicLabel ? `Topic: ${topicLabel}` : null,
    parsed.data.company?.trim()
      ? `Company: ${parsed.data.company.trim()}`
      : null,
    parsed.data.timeline?.trim()
      ? `Timeline: ${parsed.data.timeline.trim()}`
      : null,
    "",
    parsed.data.message.trim(),
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  if (parsed.data.website) {
    await Promise.all([
      recordRequestEvent({
        route: "/api/contact",
        fingerprint: rateLimit.fingerprint,
        eventType: "spam_blocked",
        metadata: {
          listingId: listing.id,
          reason: "honeypot",
          userEmail: parsed.data.userEmail,
        },
      }),
      recordSecurityAudit({
        actor: `public:${rateLimit.fingerprint}`,
        action: "security.spam_blocked",
        entityId: listing.id,
        summary: "Blocked contact submission via honeypot field",
        metadata: {
          route: "/api/contact",
          userEmail: parsed.data.userEmail,
        },
      }),
    ]);

    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const duplicate = await hasRecentDuplicateInquiry({
    listingId: listing.id,
    userEmail: parsed.data.userEmail,
    message: composedMessage,
    windowMs: 30 * 60 * 1000,
  });

  if (duplicate) {
    await Promise.all([
      recordRequestEvent({
        route: "/api/contact",
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
        summary: "Blocked duplicate contact submission",
        metadata: {
          route: "/api/contact",
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
    message: composedMessage,
  });

  await recordAnalyticsEvent({
    route: "/api/contact",
    fingerprint: rateLimit.fingerprint,
    eventType: "inquiry_created",
    subject: listing.id,
    metadata: {
      inquiryId: inquiry.id,
      listingId: listing.id,
      listingName: listing.name,
      topic: parsed.data.topic ?? "listing_context",
    },
  }).catch(() => undefined);

  return NextResponse.json({ inquiry }, { status: 201 });
}
