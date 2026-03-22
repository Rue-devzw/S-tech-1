import path from "node:path";
import { createRequire } from "node:module";
import { config as loadDotenv } from "dotenv";
import pg from "pg";

loadDotenv({ path: path.join(process.cwd(), ".env") });
loadDotenv({ path: path.join(process.cwd(), ".env.local"), override: true });

const require = createRequire(import.meta.url);
const { Pool } = pg;
const sqliteModule = require("node:sqlite");

const databaseUrl = process.env.DATABASE_URL;
const sqlitePath = path.join(
  process.cwd(),
  process.env.SQLITE_DB_PATH ?? ".data/s-tech.sqlite"
);

if (!databaseUrl) {
  console.error("Missing DATABASE_URL. Set it before verifying Postgres imports.");
  process.exit(1);
}

const sqlite = new sqliteModule.DatabaseSync(sqlitePath);
const pool = new Pool({
  connectionString: databaseUrl,
});

const tables = [
  "listings",
  "inquiries",
  "audit_events",
  "app_settings",
  "admin_users",
  "admin_sessions",
  "admin_password_reset_tokens",
  "admin_mfa_credentials",
  "admin_mfa_challenges",
  "notification_jobs",
  "job_locks",
  "notification_webhook_events",
  "request_events",
  "analytics_events",
];

function sqliteTableExists(tableName) {
  return Boolean(
    sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1"
      )
      .get(tableName)
  );
}

async function main() {
  const client = await pool.connect();

  try {
    let hasMismatch = false;

    for (const table of tables) {
      const sqliteCount = sqliteTableExists(table)
        ? Number(
            sqlite.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count ?? 0
          )
        : 0;
      const postgresCount = Number(
        (await client.query(`SELECT COUNT(*)::int as count FROM ${table}`)).rows[0]
          .count ?? 0
      );

      console.info(`${table}: sqlite=${sqliteCount}, postgres=${postgresCount}`);
      if (sqliteCount !== postgresCount) {
        hasMismatch = true;
      }
    }

    if (hasMismatch) {
      console.error("Row count mismatches detected.");
      process.exitCode = 1;
    } else {
      console.info("Postgres row counts match SQLite.");
    }
  } finally {
    client.release();
    await pool.end();
    sqlite.close?.();
  }
}

main().catch((error) => {
  console.error("Postgres verification failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
