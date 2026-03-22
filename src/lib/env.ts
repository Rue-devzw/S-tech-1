import { z } from "zod";
import { type NotificationDeliveryMode } from "@/lib/notification-job";

const FALLBACK_SITE_URL = "http://localhost:9002";
const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;
const optionalNonEmptyString = z.preprocess(
  emptyStringToUndefined,
  z.string().min(1).optional()
);
const optionalEmailString = z.preprocess(
  emptyStringToUndefined,
  z.string().email().optional()
);
const optionalUrlString = z.preprocess(
  emptyStringToUndefined,
  z.string().url().optional()
);
const optionalIntegerString = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().positive().optional()
);

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DEPLOYMENT_ENV: z.enum(["local", "staging", "production"]).default("local"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default(FALLBACK_SITE_URL),
  GOOGLE_API_KEY: optionalNonEmptyString,
  ADMIN_USERNAME: z.string().min(1).default("admin"),
  ADMIN_PASSWORD: z.string().min(1).default("changeme"),
  ADMIN_DISPLAY_NAME: z.string().min(1).default("Primary Owner"),
  ADMIN_SESSION_SECRET: z
    .string()
    .min(16)
    .default("replace-me-with-a-long-random-string"),
  SQLITE_DB_PATH: z.string().min(1).default(".data/s-tech.sqlite"),
  DATABASE_URL: optionalNonEmptyString,
  RESEND_API_KEY: optionalNonEmptyString,
  RESEND_API_BASE_URL: z
    .string()
    .url()
    .default("https://api.resend.com/emails"),
  RESEND_WEBHOOK_SECRET: optionalNonEmptyString,
  INTERNAL_CRON_SECRET: optionalNonEmptyString,
  NOTIFICATION_RUNNER_BATCH_SIZE: optionalIntegerString,
  NOTIFICATION_ALERT_WEBHOOK_URL: optionalUrlString,
  SENTRY_DSN: optionalNonEmptyString,
  NOTIFICATION_HEALTH_MAX_DUE: optionalIntegerString,
  NOTIFICATION_HEALTH_MAX_DEAD_LETTERS: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().min(0).optional()
  ),
  NOTIFICATION_HEALTH_MAX_STALE_MINUTES: optionalIntegerString,
  NOTIFICATION_FROM_EMAIL: z.string().email().default("noreply@s-tech.local"),
  NOTIFICATION_FROM_NAME: z.string().min(1).default("S-Tech Studios"),
  NOTIFICATION_REPLY_TO: optionalEmailString,
});

export const env = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DEPLOYMENT_ENV:
    process.env.DEPLOYMENT_ENV ??
    (process.env.NODE_ENV === "production" ? "production" : "local"),
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "changeme",
  ADMIN_DISPLAY_NAME: process.env.ADMIN_DISPLAY_NAME ?? "Primary Owner",
  ADMIN_SESSION_SECRET:
    process.env.ADMIN_SESSION_SECRET ?? "replace-me-with-a-long-random-string",
  SQLITE_DB_PATH: process.env.SQLITE_DB_PATH ?? ".data/s-tech.sqlite",
  DATABASE_URL: process.env.DATABASE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_API_BASE_URL:
    process.env.RESEND_API_BASE_URL ?? "https://api.resend.com/emails",
  RESEND_WEBHOOK_SECRET: process.env.RESEND_WEBHOOK_SECRET,
  INTERNAL_CRON_SECRET: process.env.INTERNAL_CRON_SECRET,
  NOTIFICATION_RUNNER_BATCH_SIZE: process.env.NOTIFICATION_RUNNER_BATCH_SIZE,
  NOTIFICATION_ALERT_WEBHOOK_URL: process.env.NOTIFICATION_ALERT_WEBHOOK_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NOTIFICATION_HEALTH_MAX_DUE: process.env.NOTIFICATION_HEALTH_MAX_DUE,
  NOTIFICATION_HEALTH_MAX_DEAD_LETTERS:
    process.env.NOTIFICATION_HEALTH_MAX_DEAD_LETTERS,
  NOTIFICATION_HEALTH_MAX_STALE_MINUTES:
    process.env.NOTIFICATION_HEALTH_MAX_STALE_MINUTES,
  NOTIFICATION_FROM_EMAIL:
    process.env.NOTIFICATION_FROM_EMAIL ?? "noreply@s-tech.local",
  NOTIFICATION_FROM_NAME:
    process.env.NOTIFICATION_FROM_NAME ?? "S-Tech Studios",
  NOTIFICATION_REPLY_TO: process.env.NOTIFICATION_REPLY_TO,
});

export function getSiteUrl() {
  return env.NEXT_PUBLIC_SITE_URL;
}

export function getDeploymentEnvironment() {
  return env.DEPLOYMENT_ENV;
}

export function shouldUseSecureCookies() {
  return getSiteUrl().startsWith("https://");
}

export function assertGoogleAiConfig() {
  if (!env.GOOGLE_API_KEY) {
    throw new Error(
      "Missing GOOGLE_API_KEY. Add it to your environment before using the AI assistant."
    );
  }
}

export function getAdminUsername() {
  return env.ADMIN_USERNAME;
}

export function getAdminPassword() {
  return env.ADMIN_PASSWORD;
}

export function getAdminDisplayName() {
  return env.ADMIN_DISPLAY_NAME;
}

export function getAdminSessionSecret() {
  return env.ADMIN_SESSION_SECRET;
}

export function getSqliteDbPath() {
  return env.SQLITE_DB_PATH;
}

export function getDatabaseUrl() {
  return env.DATABASE_URL;
}

export function getResendApiKey() {
  return env.RESEND_API_KEY;
}

export function getResendApiBaseUrl() {
  return env.RESEND_API_BASE_URL;
}

export function getResendWebhookSecret() {
  return env.RESEND_WEBHOOK_SECRET;
}

export function getNotificationFromEmail() {
  return env.NOTIFICATION_FROM_EMAIL;
}

export function getNotificationFromName() {
  return env.NOTIFICATION_FROM_NAME;
}

export function getNotificationReplyTo() {
  return env.NOTIFICATION_REPLY_TO;
}

export function getInternalCronSecret() {
  return env.INTERNAL_CRON_SECRET;
}

export function getNotificationRunnerBatchSize() {
  return env.NOTIFICATION_RUNNER_BATCH_SIZE ?? 20;
}

export function getNotificationAlertWebhookUrl() {
  return env.NOTIFICATION_ALERT_WEBHOOK_URL;
}

export function getSentryDsn() {
  return env.SENTRY_DSN;
}

export function getNodeEnv() {
  return env.NODE_ENV;
}

export function getNotificationHealthThresholds() {
  const defaults =
    env.NODE_ENV === "production"
      ? {
          maxDue: 5,
          maxDeadLetters: 0,
          maxStaleMinutes: 15,
        }
      : env.NODE_ENV === "test"
        ? {
            maxDue: 50,
            maxDeadLetters: 10,
            maxStaleMinutes: 120,
          }
        : {
            maxDue: 25,
            maxDeadLetters: 5,
            maxStaleMinutes: 120,
          };

  return {
    maxDue: env.NOTIFICATION_HEALTH_MAX_DUE ?? defaults.maxDue,
    maxDeadLetters:
      env.NOTIFICATION_HEALTH_MAX_DEAD_LETTERS ?? defaults.maxDeadLetters,
    maxStaleMinutes:
      env.NOTIFICATION_HEALTH_MAX_STALE_MINUTES ?? defaults.maxStaleMinutes,
  };
}

export function getNotificationDeliveryConfigError(
  mode: NotificationDeliveryMode
) {
  if (mode !== "resend") {
    return null;
  }

  const missing: string[] = [];

  if (!getResendApiKey()) {
    missing.push("RESEND_API_KEY");
  }

  if (!getNotificationFromEmail()) {
    missing.push("NOTIFICATION_FROM_EMAIL");
  }

  return missing.length > 0
    ? `Resend delivery requires ${missing.join(" and ")} in the server environment.`
    : null;
}

export function getNotificationWebhookConfigError(
  mode: NotificationDeliveryMode
) {
  if (mode !== "resend") {
    return null;
  }

  return getResendWebhookSecret()
    ? null
    : "Resend webhook reconciliation requires RESEND_WEBHOOK_SECRET in the server environment.";
}
