import "dotenv/config";

const baseUrl =
  process.argv[2] ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:9002";
const cronSecret = process.env.INTERNAL_CRON_SECRET;
const allowDegraded = process.env.NOTIFICATION_HEALTH_ALLOW_DEGRADED === "1";
const expectedEnvironment = process.env.NOTIFICATION_HEALTH_EXPECTED_ENV || null;

if (!cronSecret) {
  console.error("Missing INTERNAL_CRON_SECRET.");
  process.exit(1);
}

const response = await fetch(
  `${baseUrl.replace(/\/$/, "")}/api/internal/cron/notifications`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  }
);

const data = await response.json().catch(() => null);
const status = data?.status ?? "unknown";
const reasons = Array.isArray(data?.reasons) ? data.reasons : [];
const actualEnvironment =
  typeof data?.environment === "string" ? data.environment : null;

console.log(
  JSON.stringify(
    {
      expectedEnvironment,
      environment: actualEnvironment,
      url: `${baseUrl.replace(/\/$/, "")}/api/internal/cron/notifications`,
      httpStatus: response.status,
      status,
      reasons,
      thresholds: data?.thresholds ?? null,
      health: data?.health ?? null,
    },
    null,
    2
  )
);

if (!response.ok) {
  process.exit(1);
}

if (expectedEnvironment && actualEnvironment !== expectedEnvironment) {
  process.exit(1);
}

if (status === "blocked") {
  process.exit(1);
}

if (status === "degraded" && !allowDegraded) {
  process.exit(1);
}
