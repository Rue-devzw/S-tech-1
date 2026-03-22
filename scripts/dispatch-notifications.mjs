import "dotenv/config";

const baseUrl =
  process.argv[2] ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:9002";
const limitArg = process.argv[3];
const cronSecret = process.env.INTERNAL_CRON_SECRET;

if (!cronSecret) {
  console.error("Missing INTERNAL_CRON_SECRET.");
  process.exit(1);
}

const payload = {};
if (limitArg) {
  const parsedLimit = Number(limitArg);
  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    console.error("Limit must be a positive integer.");
    process.exit(1);
  }

  payload.limit = parsedLimit;
}

const response = await fetch(
  `${baseUrl.replace(/\/$/, "")}/api/internal/cron/notifications`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

const data = await response.json().catch(() => null);

if (!response.ok) {
  console.error(JSON.stringify(data ?? { error: "Request failed." }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      acquired: data?.acquired ?? false,
      status: data?.status ?? null,
      reasons: data?.reasons ?? [],
      processedCount: data?.processedCount ?? 0,
      dueBefore: data?.dueBefore ?? 0,
      dueAfter: data?.dueAfter ?? 0,
      summary: data?.summary ?? null,
    },
    null,
    2
  )
);
