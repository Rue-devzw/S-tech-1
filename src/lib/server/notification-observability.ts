import "server-only";

import { randomUUID } from "node:crypto";
import {
  getDeploymentEnvironment,
  getNodeEnv,
  getNotificationAlertWebhookUrl,
  getNotificationHealthThresholds,
  getSentryDsn,
} from "@/lib/env";
import {
  type NotificationHealthAssessment,
  type NotificationQueueHealth,
} from "@/lib/notification-job";

type LogLevel = "info" | "warn" | "error";

function parseSentryEnvelopeUrl(dsn: string) {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.split("/").filter(Boolean).at(-1);
    if (!projectId) {
      return null;
    }

    return `${url.protocol}//${url.host}/api/${projectId}/envelope/`;
  } catch {
    return null;
  }
}

function getLogger(level: LogLevel) {
  switch (level) {
    case "warn":
      return console.warn;
    case "error":
      return console.error;
    default:
      return console.info;
  }
}

export function logNotificationEvent(
  level: LogLevel,
  event: string,
  payload: Record<string, unknown>
) {
  getLogger(level)(
    JSON.stringify({
      source: "notification_worker",
      environment: getDeploymentEnvironment(),
      nodeEnv: getNodeEnv(),
      level,
      event,
      timestamp: new Date().toISOString(),
      ...payload,
    })
  );
}

export function assessNotificationHealth(
  health: NotificationQueueHealth
): NotificationHealthAssessment {
  const thresholds = getNotificationHealthThresholds();
  const reasons: string[] = [];

  if (health.providerConfigError && health.dueNow > 0) {
    reasons.push(health.providerConfigError);
  }

  if (health.deadLetters > thresholds.maxDeadLetters) {
    reasons.push(
      `Dead-letter backlog ${health.deadLetters} exceeds threshold ${thresholds.maxDeadLetters}.`
    );
  }

  if (health.dueNow > thresholds.maxDue) {
    reasons.push(
      `Due backlog ${health.dueNow} exceeds threshold ${thresholds.maxDue}.`
    );
  }

  const lastDispatchActivityAt =
    health.lastDispatchCompletedAt ?? health.lastDispatchAttemptAt;

  if (
    health.dueNow > 0 &&
    lastDispatchActivityAt &&
    Date.now() - new Date(lastDispatchActivityAt).getTime() >
      thresholds.maxStaleMinutes * 60 * 1000
  ) {
    reasons.push(
      `No dispatch activity has completed within ${thresholds.maxStaleMinutes} minute(s).`
    );
  }

  if (health.lockActive && health.dueNow > 0) {
    reasons.push("Notification dispatch lock is currently active.");
  }

  if (health.providerConfigError && health.dueNow > 0) {
    return {
      status: "blocked",
      reasons,
      thresholds,
    };
  }

  return {
    status: reasons.length > 0 ? "degraded" : "ok",
    reasons,
    thresholds,
  };
}

async function captureSentryAlert(input: {
  message: string;
  level: LogLevel;
  extra?: Record<string, unknown>;
}) {
  const dsn = getSentryDsn();
  if (!dsn) {
    return false;
  }

  const envelopeUrl = parseSentryEnvelopeUrl(dsn);
  if (!envelopeUrl) {
    return false;
  }

  try {
    const eventId = randomUUID().replace(/-/g, "");
    const sentAt = new Date().toISOString();
    const envelope = [
      JSON.stringify({
        event_id: eventId,
        sent_at: sentAt,
        dsn,
      }),
      JSON.stringify({ type: "event" }),
      JSON.stringify({
        event_id: eventId,
        message: input.message,
        level:
          input.level === "warn"
            ? "warning"
            : input.level === "error"
              ? "error"
              : "info",
        timestamp: sentAt,
        platform: "javascript",
        environment: getDeploymentEnvironment(),
        extra: input.extra,
      }),
    ].join("\n");

    const response = await fetch(envelopeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
      },
      body: envelope,
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function deliverWebhookAlert(input: {
  event: string;
  message: string;
  level: LogLevel;
  payload: Record<string, unknown>;
}) {
  const webhookUrl = getNotificationAlertWebhookUrl();
  if (!webhookUrl) {
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "notification_worker",
        environment: getDeploymentEnvironment(),
        nodeEnv: getNodeEnv(),
        event: input.event,
        level: input.level,
        message: input.message,
        timestamp: new Date().toISOString(),
        payload: input.payload,
      }),
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function sendNotificationAlert(input: {
  event: string;
  message: string;
  level?: LogLevel;
  payload?: Record<string, unknown>;
}) {
  const level = input.level ?? "warn";
  const payload = input.payload ?? {};

  logNotificationEvent(level, input.event, {
    message: input.message,
    alert: true,
    ...payload,
  });

  const [sentryCaptured, webhookDelivered] = await Promise.all([
    captureSentryAlert({
      message: input.message,
      level,
      extra: payload,
    }),
    deliverWebhookAlert({
      event: input.event,
      message: input.message,
      level,
      payload,
    }),
  ]);

  return {
    sentryCaptured,
    webhookDelivered,
  };
}
