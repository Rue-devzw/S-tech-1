import "server-only";

import {
  getNotificationFromEmail,
  getNotificationFromName,
  getNotificationReplyTo,
  getResendApiBaseUrl,
  getResendApiKey,
} from "@/lib/env";
import { type NotificationJob } from "@/lib/notification-job";
import { logNotificationEvent } from "@/lib/server/notification-observability";

const RETRYABLE_STATUS_CODES = new Set([408, 409, 425, 429]);
const MAX_NOTIFICATION_ATTEMPTS = 5;

export class NotificationDeliveryError extends Error {
  readonly retryable: boolean;
  readonly statusCode: number | null;

  constructor(
    message: string,
    options?: {
      retryable?: boolean;
      statusCode?: number | null;
    }
  ) {
    super(message);
    this.name = "NotificationDeliveryError";
    this.retryable = options?.retryable ?? false;
    this.statusCode = options?.statusCode ?? null;
  }
}

export function getNotificationRetryDelayMs(attempt: number) {
  const retryScheduleMs = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000];
  return retryScheduleMs[Math.min(attempt - 1, retryScheduleMs.length - 1)];
}

export function shouldRetryNotificationFailure(
  error: unknown,
  attempt: number
) {
  if (attempt >= MAX_NOTIFICATION_ATTEMPTS) {
    return false;
  }

  return error instanceof NotificationDeliveryError ? error.retryable : true;
}

export function getMaxNotificationAttempts() {
  return MAX_NOTIFICATION_ATTEMPTS;
}

function sanitizeTagValue(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 256) || "unknown";
}

function formatFromAddress() {
  return `${getNotificationFromName()} <${getNotificationFromEmail()}>`;
}

async function parseErrorMessage(response: Response) {
  const raw = await response.text();

  if (!raw) {
    return `Provider returned HTTP ${response.status}.`;
  }

  try {
    const parsed = JSON.parse(raw) as {
      message?: string;
      error?: string;
      name?: string;
    };

    return (
      parsed.message ||
      parsed.error ||
      parsed.name ||
      `Provider returned HTTP ${response.status}.`
    );
  } catch {
    return raw.slice(0, 300);
  }
}

async function sendWithResend(job: NotificationJob) {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    logNotificationEvent("error", "notification.delivery_blocked", {
      jobId: job.id,
      provider: job.provider,
      kind: job.kind,
      recipient: job.recipient,
      reason: "Missing RESEND_API_KEY for Resend delivery.",
    });
    throw new NotificationDeliveryError(
      "Missing RESEND_API_KEY for Resend delivery.",
      { retryable: false }
    );
  }

  const payload: Record<string, unknown> = {
    from: formatFromAddress(),
    to: [job.recipient],
    subject: job.subject,
    text: job.body,
    tags: [
      {
        name: "kind",
        value: sanitizeTagValue(job.kind),
      },
      {
        name: "entity_type",
        value: sanitizeTagValue(job.entityType),
      },
      {
        name: "entity_id",
        value: sanitizeTagValue(job.entityId),
      },
    ],
  };

  const replyTo = getNotificationReplyTo();
  if (replyTo) {
    payload.reply_to = replyTo;
  }

  let response: Response;
  try {
    logNotificationEvent("info", "notification.delivery_attempted", {
      jobId: job.id,
      provider: job.provider,
      kind: job.kind,
      recipient: job.recipient,
      entityType: job.entityType,
      entityId: job.entityId,
      attempt: job.attempts + 1,
    });
    response = await fetch(getResendApiBaseUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": job.id,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (caughtError) {
    logNotificationEvent("error", "notification.delivery_network_failed", {
      jobId: job.id,
      provider: job.provider,
      kind: job.kind,
      recipient: job.recipient,
      attempt: job.attempts + 1,
      error:
        caughtError instanceof Error
          ? caughtError.message
          : "Network error while sending notification.",
    });
    throw new NotificationDeliveryError(
      caughtError instanceof Error
        ? caughtError.message
        : "Network error while sending notification.",
      { retryable: true }
    );
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    logNotificationEvent("warn", "notification.delivery_rejected", {
      jobId: job.id,
      provider: job.provider,
      kind: job.kind,
      recipient: job.recipient,
      attempt: job.attempts + 1,
      statusCode: response.status,
      retryable:
        RETRYABLE_STATUS_CODES.has(response.status) || response.status >= 500,
      error: message,
    });
    throw new NotificationDeliveryError(message, {
      retryable:
        RETRYABLE_STATUS_CODES.has(response.status) || response.status >= 500,
      statusCode: response.status,
    });
  }

  const data = (await response.json().catch(() => null)) as {
    id?: string;
  } | null;

  logNotificationEvent("info", "notification.delivery_succeeded", {
    jobId: job.id,
    provider: job.provider,
    kind: job.kind,
    recipient: job.recipient,
    entityType: job.entityType,
    entityId: job.entityId,
    attempt: job.attempts + 1,
    providerMessageId: data?.id ?? null,
  });

  return {
    providerMessageId: data?.id ?? null,
  };
}

export async function deliverNotification(job: NotificationJob) {
  if (job.provider === "console") {
    logNotificationEvent("info", "notification.delivery_console", {
      jobId: job.id,
      provider: job.provider,
      kind: job.kind,
      recipient: job.recipient,
      entityType: job.entityType,
      entityId: job.entityId,
      subject: job.subject,
    });

    console.info(
      `[notification:${job.kind}] -> ${job.recipient}\nSubject: ${job.subject}\n${job.body}`
    );

    return {
      providerMessageId: null,
    };
  }

  if (job.provider === "disabled") {
    logNotificationEvent("warn", "notification.delivery_disabled", {
      jobId: job.id,
      provider: job.provider,
      kind: job.kind,
      recipient: job.recipient,
    });
    throw new NotificationDeliveryError("Notification delivery is disabled.", {
      retryable: false,
    });
  }

  return sendWithResend(job);
}
