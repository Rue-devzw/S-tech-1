import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { config as loadDotenv } from "dotenv";
import pg from "pg";

loadDotenv({ path: path.join(process.cwd(), ".env") });
loadDotenv({ path: path.join(process.cwd(), ".env.local"), override: true });

const { Pool } = pg;
const migrationsDir = path.join(process.cwd(), "db", "postgres", "migrations");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL. Set it before running Postgres migrations.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getPendingMigrations(client) {
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const applied = await client.query(
    "SELECT filename FROM schema_migrations ORDER BY filename ASC"
  );
  const appliedSet = new Set(applied.rows.map((row) => row.filename));

  return files.filter((file) => !appliedSet.has(file));
}

async function applyMigration(client, filename) {
  const migrationPath = path.join(migrationsDir, filename);
  const sql = await readFile(migrationPath, "utf8");

  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query(
      "INSERT INTO schema_migrations (filename, applied_at) VALUES ($1, NOW())",
      [filename]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function main() {
  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);
    const pending = await getPendingMigrations(client);

    if (pending.length === 0) {
      console.info("Postgres schema is up to date.");
      return;
    }

    for (const filename of pending) {
      console.info(`Applying ${filename}...`);
      await applyMigration(client, filename);
    }

    console.info(`Applied ${pending.length} migration(s).`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Postgres migration failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
