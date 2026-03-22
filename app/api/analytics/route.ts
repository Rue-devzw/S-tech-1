import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { type AnalyticsEventType } from "@/lib/analytics";
import { recordAnalyticsEvent } from "@/lib/server/data-store";
import { getRequestFingerprint } from "@/lib/server/request-guard";

const analyticsEventTypes = [
  "home_view",
  "store_view",
  "listing_view",
  "inquiry_created",
] as const satisfies AnalyticsEventType[];

const analyticsPayloadSchema = z.object({
  eventType: z.enum(analyticsEventTypes),
  route: z.string().min(1).max(200),
  subject: z.string().max(120).optional().nullable(),
  metadata: z
    .record(z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = analyticsPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid analytics payload." }, { status: 400 });
  }

  try {
    await recordAnalyticsEvent({
      route: parsed.data.route,
      fingerprint: getRequestFingerprint(request),
      eventType: parsed.data.eventType,
      subject: parsed.data.subject ?? null,
      metadata: parsed.data.metadata,
    });
  } catch (caughtError) {
    console.error("Unable to record analytics event.", caughtError);
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
