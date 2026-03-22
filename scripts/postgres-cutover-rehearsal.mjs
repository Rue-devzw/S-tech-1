import path from "node:path";
import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { config as loadDotenv } from "dotenv";
import pg from "pg";

loadDotenv({ path: path.join(process.cwd(), ".env") });
loadDotenv({ path: path.join(process.cwd(), ".env.local"), override: true });

const { Pool } = pg;

function getArgValue(flag) {
  const direct = process.argv.find((argument) => argument.startsWith(`${flag}=`));
  if (direct) {
    return direct.slice(flag.length + 1);
  }

  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function runCommand(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}.`));
    });

    child.on("error", reject);
  });
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        return;
      }
    } catch {
      // Keep waiting for the server to come up.
    }

    await delay(1_000);
  }

  throw new Error(`Timed out waiting for ${url}.`);
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    delay(10_000).then(() => {
      if (child.exitCode === null) {
        child.kill("SIGKILL");
      }
    }),
  ]);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function ensureRehearsalAdmin(databaseUrl, input) {
  const pool = new Pool({
    connectionString: databaseUrl,
  });
  const client = await pool.connect();
  const now = new Date().toISOString();
  const passwordHash = hashPassword(input.password);

  try {
    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT id FROM admin_users WHERE username = $1 LIMIT 1",
      [input.username]
    );

    const userId =
      existing.rows[0]?.id ??
      randomUUID();

    if (existing.rowCount && existing.rows[0]?.id) {
      await client.query(
        `
          UPDATE admin_users
          SET display_name = $1,
              email = $2,
              role = 'owner',
              status = 'active',
              password_hash = $3,
              updated_at = $4
          WHERE id = $5
        `,
        [input.displayName, input.email, passwordHash, now, userId]
      );
    } else {
      await client.query(
        `
          INSERT INTO admin_users (
            id, username, display_name, email, role, status, password_hash,
            last_login_at, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, 'owner', 'active', $5, NULL, $6, $6)
        `,
        [userId, input.username, input.displayName, input.email, passwordHash, now]
      );
    }

    await client.query("DELETE FROM admin_mfa_credentials WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM admin_mfa_challenges WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM admin_password_reset_tokens WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM admin_sessions WHERE user_id = $1", [userId]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function resetRehearsalOperationalState(databaseUrl) {
  const pool = new Pool({
    connectionString: databaseUrl,
  });
  const client = await pool.connect();
  const now = new Date().toISOString();
  const notificationSettings = {
    emailOnNewInquiry: true,
    emailOnNewSale: true,
    weeklyReport: false,
    systemAlerts: true,
    adminNotificationEmail: "info@s-tech.co.zw",
    autoDispatchInquiryEmails: false,
    deliveryMode: "console",
  };

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM notification_webhook_events");
    await client.query("DELETE FROM notification_jobs");
    await client.query("DELETE FROM job_locks");
    await client.query("DELETE FROM request_events");
    await client.query("DELETE FROM analytics_events");
    await client.query(
      `
        INSERT INTO app_settings (key, value, updated_at)
        VALUES ('notifications', $1::jsonb, $2)
        ON CONFLICT (key)
        DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
      `,
      [JSON.stringify(notificationSettings), now]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

const databaseUrl = process.env.DATABASE_URL;
const port = Number.parseInt(getArgValue("--port") ?? "9010", 10);
const shouldTruncate = process.argv.includes("--truncate");
const skipE2E = process.argv.includes("--skip-e2e");
const baseUrl = `http://127.0.0.1:${port}`;
const rehearsalAdminUsername = process.env.PLAYWRIGHT_ADMIN_USERNAME ?? "admin";
const rehearsalAdminPassword =
  process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "Playwright!234";
const rehearsalCronSecret =
  process.env.PLAYWRIGHT_CRON_SECRET ?? "playwright-cron-secret";

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL. Set it before running the Postgres cutover rehearsal."
  );
  process.exit(1);
}

if (!Number.isInteger(port) || port <= 0) {
  console.error("Invalid --port value. Use a positive integer.");
  process.exit(1);
}

const rehearsalEnv = {
  ...process.env,
  DEPLOYMENT_ENV: "local",
  NEXT_PUBLIC_SITE_URL: baseUrl,
  E2E_TEST_MODE: "1",
  ADMIN_USERNAME: rehearsalAdminUsername,
  ADMIN_PASSWORD: rehearsalAdminPassword,
  ADMIN_SESSION_SECRET:
    process.env.ADMIN_SESSION_SECRET ?? "cutover-rehearsal-secret-12345",
  INTERNAL_CRON_SECRET: rehearsalCronSecret,
  NOTIFICATION_HEALTH_MAX_DUE: "50",
  NOTIFICATION_HEALTH_MAX_DEAD_LETTERS: "10",
  NOTIFICATION_HEALTH_MAX_STALE_MINUTES: "120",
  PLAYWRIGHT_ADMIN_USERNAME: rehearsalAdminUsername,
  PLAYWRIGHT_ADMIN_PASSWORD: rehearsalAdminPassword,
  PLAYWRIGHT_CRON_SECRET: rehearsalCronSecret,
  PORT: String(port),
};

console.info("Running local deployment preflight for cutover rehearsal...");
await runCommand("npm", ["run", "ops:preflight", "--", "--target=local"], rehearsalEnv);

console.info("Applying Postgres migrations...");
await runCommand("npm", ["run", "db:postgres:migrate"], rehearsalEnv);

console.info("Importing SQLite data into Postgres...");
await runCommand(
  "npm",
  shouldTruncate
    ? ["run", "db:postgres:import", "--", "--truncate"]
    : ["run", "db:postgres:import"],
  rehearsalEnv
);

console.info("Verifying SQLite and Postgres row counts...");
await runCommand("npm", ["run", "db:postgres:verify"], rehearsalEnv);

console.info("Preparing a deterministic rehearsal admin account...");
await ensureRehearsalAdmin(databaseUrl, {
  username: rehearsalAdminUsername,
  password: rehearsalAdminPassword,
  displayName: "Playwright Rehearsal Admin",
  email: "playwright-admin@s-tech.local",
});

console.info("Resetting imported operational state for a clean rehearsal run...");
await resetRehearsalOperationalState(databaseUrl);

console.info("Building the production app for rehearsal...");
await runCommand("npm", ["run", "build"], rehearsalEnv);

console.info(`Starting production server on ${baseUrl}...`);
const server = spawn("npm", ["run", "start", "--", "-p", String(port)], {
  cwd: process.cwd(),
  env: rehearsalEnv,
  stdio: "inherit",
});

try {
  await waitForServer(`${baseUrl}/api/listings`, 120_000);

  if (!skipE2E) {
    console.info("Running Playwright smoke tests against the Postgres-backed server...");
    await runCommand(
      "npm",
      ["run", "test:e2e"],
      {
        ...rehearsalEnv,
        PLAYWRIGHT_SKIP_WEBSERVER: "1",
        PLAYWRIGHT_BASE_URL: baseUrl,
      }
    );
  }

  console.info("Checking deployment smoke endpoints...");
  await runCommand("npm", ["run", "deployment:smoke", baseUrl], rehearsalEnv);

  console.info("Checking notification worker health...");
  await runCommand(
    "npm",
    ["run", "notifications:health", baseUrl],
    {
      ...rehearsalEnv,
      NOTIFICATION_HEALTH_EXPECTED_ENV: "local",
    }
  );

  console.info("Postgres cutover rehearsal completed successfully.");
} finally {
  await stopServer(server);
}
