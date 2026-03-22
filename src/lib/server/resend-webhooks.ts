import "server-only";

import { Webhook, WebhookVerificationError } from "svix";
import { getResendWebhookSecret } from "@/lib/env";

export interface ResendWebhookPayload {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[];
    from?: string;
    subject?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export class ResendWebhookError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "ResendWebhookError";
    this.statusCode = statusCode;
  }
}

export function verifyResendWebhook(
  payload: string,
  headers: {
    svixId?: string | null;
    svixTimestamp?: string | null;
    svixSignature?: string | null;
  }
) {
  const secret = getResendWebhookSecret();
  if (!secret) {
    throw new ResendWebhookError(
      "RESEND_WEBHOOK_SECRET is not configured.",
      503
    );
  }

  if (!headers.svixId || !headers.svixTimestamp || !headers.svixSignature) {
    throw new ResendWebhookError("Missing webhook signature headers.");
  }

  const webhook = new Webhook(secret);

  try {
    return webhook.verify(payload, {
      "svix-id": headers.svixId,
      "svix-timestamp": headers.svixTimestamp,
      "svix-signature": headers.svixSignature,
    }) as ResendWebhookPayload;
  } catch (caughtError) {
    if (caughtError instanceof WebhookVerificationError) {
      throw new ResendWebhookError("Invalid webhook signature.", 401);
    }

    throw new ResendWebhookError(
      caughtError instanceof Error
        ? caughtError.message
        : "Unable to verify webhook signature.",
      400
    );
  }
}
