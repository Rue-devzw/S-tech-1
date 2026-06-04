const baseUrl = process.env.HEALTHCHECK_URL || process.env.APP_URL || "http://127.0.0.1:3000";
const timeoutMs = Number(process.env.HEALTHCHECK_TIMEOUT_MS || "5000");

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutMs);

try {
  const response = await fetch(new URL("/api/health", baseUrl), { signal: controller.signal });
  if (!response.ok) {
    console.error(`Healthcheck failed with HTTP ${response.status}`);
    process.exit(1);
  }
  const payload = await response.json();
  if (payload.status !== "ok") {
    console.error(`Healthcheck failed: ${JSON.stringify(payload)}`);
    process.exit(1);
  }
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Healthcheck failed");
  process.exit(1);
} finally {
  clearTimeout(timeout);
}
