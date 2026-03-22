import "server-only";

import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  countRecentRequestEvents,
  recordRequestEvent,
  recordSecurityAudit,
} from "@/lib/server/data-store";

const REQUEST_ATTEMPT_EVENT = "attempt";

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function getRequestFingerprint(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  return hashValue(`${ip}:${userAgent}`);
}

export function getRequestSubjectKey(value: string) {
  return hashValue(value.trim().toLowerCase());
}

export async function enforceRequestRateLimit(input: {
  request: NextRequest;
  route: string;
  actor: string;
  buckets: Array<{
    limit: number;
    windowMs: number;
    scope: "fingerprint" | "subject";
    subject?: string;
  }>;
  metadata?: Record<string, unknown>;
}) {
  const fingerprint = getRequestFingerprint(input.request);

  for (const bucket of input.buckets) {
    const count = await countRecentRequestEvents({
      route: input.route,
      windowMs: bucket.windowMs,
      eventType: REQUEST_ATTEMPT_EVENT,
      fingerprint: bucket.scope === "fingerprint" ? fingerprint : undefined,
      subject: bucket.scope === "subject" ? bucket.subject : undefined,
    });

    if (count >= bucket.limit) {
      const metadata = {
        ...input.metadata,
        fingerprint,
        limit: bucket.limit,
        scope: bucket.scope,
        subject: bucket.subject ?? null,
        windowMs: bucket.windowMs,
      };

      await Promise.all([
        recordRequestEvent({
          route: input.route,
          fingerprint,
          eventType: "rate_limited",
          subject: bucket.subject,
          metadata,
        }),
        recordSecurityAudit({
          actor: input.actor,
          action: "security.rate_limited",
          entityId: input.route,
          summary: `Rate limited request to ${input.route}`,
          metadata,
        }),
      ]);

      return {
        fingerprint,
        response: NextResponse.json(
          {
            error:
              "Too many requests. Please wait a moment before trying again.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": Math.ceil(bucket.windowMs / 1000).toString(),
            },
          }
        ),
      };
    }
  }

  await recordRequestEvent({
    route: input.route,
    fingerprint,
    eventType: REQUEST_ATTEMPT_EVENT,
    subject: input.buckets.find((bucket) => bucket.scope === "subject")?.subject,
    metadata: input.metadata,
  });

  return {
    fingerprint,
    response: null,
  };
}
