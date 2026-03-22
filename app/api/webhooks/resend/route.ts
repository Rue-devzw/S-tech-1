import { NextRequest, NextResponse } from "next/server";
import { ingestResendWebhookEvent } from "@/lib/server/data-store";
import { logNotificationEvent } from "@/lib/server/notification-observability";
import {
  ResendWebhookError,
  verifyResendWebhook,
} from "@/lib/server/resend-webhooks";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  try {
    const payload = verifyResendWebhook(rawBody, {
      svixId: request.headers.get("svix-id"),
      svixTimestamp: request.headers.get("svix-timestamp"),
      svixSignature: request.headers.get("svix-signature"),
    });

    const result = await ingestResendWebhookEvent({
      eventId: request.headers.get("svix-id") ?? `resend-${Date.now()}`,
      eventType: payload.type,
      payload,
      providerMessageId:
        payload.data?.email_id && typeof payload.data.email_id === "string"
          ? payload.data.email_id
          : null,
    });

    logNotificationEvent("info", "notification.webhook_processed", {
      provider: "resend",
      eventType: payload.type,
      duplicate: result.duplicate,
      matchedJobId: result.job?.id ?? null,
      providerMessageId:
        payload.data?.email_id && typeof payload.data.email_id === "string"
          ? payload.data.email_id
          : null,
    });

    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      matchedJobId: result.job?.id ?? null,
      eventType: payload.type,
    });
  } catch (caughtError) {
    if (caughtError instanceof ResendWebhookError) {
      logNotificationEvent("warn", "notification.webhook_rejected", {
        provider: "resend",
        statusCode: caughtError.statusCode,
        error: caughtError.message,
      });
      return NextResponse.json(
        { error: caughtError.message },
        { status: caughtError.statusCode }
      );
    }

    logNotificationEvent("error", "notification.webhook_failed", {
      provider: "resend",
      error:
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to ingest webhook.",
    });
    return NextResponse.json(
      { error: "Unable to ingest webhook." },
      { status: 500 }
    );
  }
}
