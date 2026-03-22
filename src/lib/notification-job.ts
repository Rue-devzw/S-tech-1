export type NotificationJobStatus = "queued" | "sent" | "failed";
export type NotificationDeliveryMode = "console" | "resend" | "disabled";
export type NotificationDeliveryState =
  | "queued"
  | "sent"
  | "delivered"
  | "delivery_delayed"
  | "bounced"
  | "complained"
  | "opened"
  | "clicked"
  | "failed"
  | "scheduled"
  | "suppressed";

export interface NotificationJob {
  id: string;
  kind: string;
  channel: "email";
  recipient: string;
  subject: string;
  body: string;
  status: NotificationJobStatus;
  provider: NotificationDeliveryMode;
  attempts: number;
  lastError: string | null;
  nextAttemptAt: string | null;
  providerMessageId: string | null;
  deliveryState: NotificationDeliveryState;
  lastEventType: string | null;
  lastWebhookAt: string | null;
  entityType: "inquiry" | "listing" | "settings";
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  processedAt: string | null;
  updatedAt: string;
}

export interface NotificationSummary {
  queued: number;
  sent: number;
  failed: number;
}

export interface NotificationQueueHealth {
  deliveryMode: NotificationDeliveryMode;
  providerReady: boolean;
  providerConfigError: string | null;
  webhookConfigError: string | null;
  dueNow: number;
  scheduledRetries: number;
  deadLetters: number;
  oldestDueCreatedAt: string | null;
  oldestFailureAt: string | null;
  lockActive: boolean;
  lastDispatchCompletedAt: string | null;
  lastDispatchAttemptAt: string | null;
  lastDispatchProcessedCount: number | null;
  lastWebhookReceivedAt: string | null;
}

export interface NotificationHealthThresholds {
  maxDue: number;
  maxDeadLetters: number;
  maxStaleMinutes: number;
}

export interface NotificationHealthAssessment {
  status: "ok" | "degraded" | "blocked";
  reasons: string[];
  thresholds: NotificationHealthThresholds;
}

export interface NotificationWebhookEvent {
  id: string;
  provider: "resend";
  eventId: string;
  eventType: string;
  notificationJobId: string | null;
  providerMessageId: string | null;
  payload: Record<string, unknown>;
  receivedAt: string;
}
