import path from "node:path";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: path.join(process.cwd(), ".env") });
loadDotenv({ path: path.join(process.cwd(), ".env.local"), override: true });

const validTargets = new Set(["local", "staging", "production"]);

function getArgValue(flag) {
  const direct = process.argv.find((argument) => argument.startsWith(`${flag}=`));
  if (direct) {
    return direct.slice(flag.length + 1);
  }

  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const target = getArgValue("--target") ?? "local";

if (!validTargets.has(target)) {
  console.error(
    `Invalid --target value "${target}". Use one of: ${Array.from(validTargets).join(", ")}.`
  );
  process.exit(1);
}

function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function check(condition, severity, name, detail) {
  return {
    severity,
    name,
    ok: Boolean(condition),
    detail,
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const deploymentEnv = process.env.DEPLOYMENT_ENV ?? "";
const adminPassword = process.env.ADMIN_PASSWORD ?? "";
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";
const databaseUrl = process.env.DATABASE_URL ?? "";
const cronSecret = process.env.INTERNAL_CRON_SECRET ?? "";
const resendApiKey = process.env.RESEND_API_KEY ?? "";
const resendWebhookSecret = process.env.RESEND_WEBHOOK_SECRET ?? "";
const sentryDsn = process.env.SENTRY_DSN ?? "";
const alertWebhookUrl = process.env.NOTIFICATION_ALERT_WEBHOOK_URL ?? "";

const checks = [
  check(
    target === "local"
      ? !isNonEmpty(deploymentEnv) || deploymentEnv === "local"
      : deploymentEnv === target,
    target === "local" ? "warning" : "error",
    "DEPLOYMENT_ENV",
    "Deployment environment matches the target tier."
  ),
  check(
    isNonEmpty(siteUrl),
    "error",
    "NEXT_PUBLIC_SITE_URL",
    "Public site URL is configured."
  ),
  check(
    target === "local" || !/localhost|127\.0\.0\.1/.test(siteUrl),
    target === "local" ? "warning" : "error",
    "NEXT_PUBLIC_SITE_URL reachability",
    "Non-local targets should not use localhost URLs."
  ),
  check(
    target === "local" || siteUrl.startsWith("https://"),
    target === "local" ? "warning" : "error",
    "NEXT_PUBLIC_SITE_URL TLS",
    "Non-local targets should use HTTPS."
  ),
  check(
    adminSessionSecret.length >= 16,
    "error",
    "ADMIN_SESSION_SECRET",
    "Admin session secret is at least 16 characters."
  ),
  check(
    target === "local" || adminPassword !== "changeme",
    target === "local" ? "warning" : "error",
    "ADMIN_PASSWORD",
    "Default seeded admin password has been replaced."
  ),
  check(
    target === "local" || isNonEmpty(databaseUrl),
    target === "local" ? "warning" : "error",
    "DATABASE_URL",
    "Managed Postgres is configured for non-local targets."
  ),
  check(
    !isNonEmpty(databaseUrl) || databaseUrl.startsWith("postgres"),
    "error",
    "DATABASE_URL format",
    "Database URL looks like a Postgres connection string."
  ),
  check(
    target === "local" || isNonEmpty(cronSecret),
    target === "local" ? "warning" : "error",
    "INTERNAL_CRON_SECRET",
    "Cron secret is configured for scheduled notification dispatch."
  ),
  check(
    target === "local" || isNonEmpty(resendApiKey),
    "warning",
    "RESEND_API_KEY",
    "Resend API key is present if email delivery is enabled."
  ),
  check(
    target === "local" || isNonEmpty(resendWebhookSecret),
    "warning",
    "RESEND_WEBHOOK_SECRET",
    "Resend webhook secret is present for delivery reconciliation."
  ),
  check(
    target === "local" || isNonEmpty(sentryDsn),
    "warning",
    "SENTRY_DSN",
    "Sentry DSN is configured for production error capture."
  ),
  check(
    target === "local" || isNonEmpty(alertWebhookUrl),
    "warning",
    "NOTIFICATION_ALERT_WEBHOOK_URL",
    "Notification alert webhook is configured for blocked worker alerts."
  ),
];

const errors = checks.filter((checkResult) => !checkResult.ok && checkResult.severity === "error");
const warnings = checks.filter(
  (checkResult) => !checkResult.ok && checkResult.severity === "warning"
);

console.log(
  JSON.stringify(
    {
      target,
      ok: errors.length === 0,
      errorCount: errors.length,
      warningCount: warnings.length,
      checks,
    },
    null,
    2
  )
);

if (errors.length > 0) {
  process.exit(1);
}
