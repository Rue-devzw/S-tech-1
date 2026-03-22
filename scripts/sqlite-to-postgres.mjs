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
const shouldTruncate = process.argv.includes("--truncate");

if (!databaseUrl) {
  console.error("Missing DATABASE_URL. Set it before importing into Postgres.");
  process.exit(1);
}

const sqlite = new sqliteModule.DatabaseSync(sqlitePath);
const pool = new Pool({
  connectionString: databaseUrl,
});

const tableDefinitions = [
  {
    name: "listings",
    columns: [
      "id",
      "slug",
      "name",
      "category",
      "price",
      "short_description",
      "description",
      "client",
      "industry",
      "delivery_timeline",
      "support_window",
      "featured",
      "technologies",
      "features",
      "outcomes",
      "image_url",
      "preview_url",
      "rating",
      "sales_count",
      "created_at",
      "updated_at",
    ],
    mapRow(row) {
      return [
        row.id,
        row.slug,
        row.name,
        row.category,
        Number(row.price),
        row.short_description,
        row.description,
        row.client,
        row.industry,
        row.delivery_timeline,
        row.support_window,
        Number(row.featured) === 1,
        row.technologies,
        row.features,
        row.outcomes,
        row.image_url,
        row.preview_url,
        Number(row.rating),
        Number(row.sales_count),
        row.created_at,
        row.updated_at,
      ];
    },
  },
  {
    name: "inquiries",
    columns: [
      "id",
      "listing_id",
      "listing_name",
      "user_name",
      "user_email",
      "message",
      "status",
      "date",
      "created_at",
      "updated_at",
    ],
    mapRow(row) {
      return [
        row.id,
        row.listing_id,
        row.listing_name,
        row.user_name,
        row.user_email,
        row.message,
        row.status,
        row.date,
        row.created_at,
        row.updated_at,
      ];
    },
  },
  {
    name: "audit_events",
    columns: [
      "id",
      "actor",
      "action",
      "entity_type",
      "entity_id",
      "summary",
      "metadata",
      "created_at",
    ],
    mapRow(row) {
      return [
        row.id,
        row.actor,
        row.action,
        row.entity_type,
        row.entity_id,
        row.summary,
        row.metadata,
        row.created_at,
      ];
    },
  },
  {
    name: "app_settings",
    columns: ["key", "value", "updated_at"],
    conflictColumns: ["key"],
    mapRow(row) {
      return [row.key, row.value, row.updated_at];
    },
  },
  {
    name: "admin_users",
    columns: [
      "id",
      "username",
      "display_name",
      "email",
      "role",
      "status",
      "password_hash",
      "last_login_at",
      "created_at",
      "updated_at",
    ],
    mapRow(row) {
      return [
        row.id,
        row.username,
        row.display_name,
        row.email,
        row.role,
        row.status,
        row.password_hash,
        row.last_login_at,
        row.created_at,
        row.updated_at,
      ];
    },
  },
  {
    name: "admin_sessions",
    columns: ["id", "user_id", "expires_at", "created_at", "last_seen_at"],
    mapRow(row) {
      return [
        row.id,
        row.user_id,
        row.expires_at,
        row.created_at,
        row.last_seen_at,
      ];
    },
  },
  {
    name: "admin_password_reset_tokens",
    columns: [
      "id",
      "user_id",
      "token_hash",
      "expires_at",
      "created_at",
      "consumed_at",
      "requested_by",
      "metadata",
    ],
    mapRow(row) {
      return [
        row.id,
        row.user_id,
        row.token_hash,
        row.expires_at,
        row.created_at,
        row.consumed_at,
        row.requested_by,
        row.metadata,
      ];
    },
  },
  {
    name: "admin_mfa_credentials",
    columns: [
      "user_id",
      "secret",
      "recovery_codes",
      "pending",
      "created_at",
      "updated_at",
      "enabled_at",
    ],
    conflictColumns: ["user_id"],
    mapRow(row) {
      return [
        row.user_id,
        row.secret,
        row.recovery_codes,
        Number(row.pending) === 1,
        row.created_at,
        row.updated_at,
        row.enabled_at,
      ];
    },
  },
  {
    name: "admin_mfa_challenges",
    columns: ["id", "user_id", "expires_at", "created_at", "completed_at"],
    mapRow(row) {
      return [
        row.id,
        row.user_id,
        row.expires_at,
        row.created_at,
        row.completed_at,
      ];
    },
  },
  {
    name: "notification_jobs",
    columns: [
      "id",
      "kind",
      "channel",
      "recipient",
      "subject",
      "body",
      "status",
      "provider",
      "attempts",
      "last_error",
      "next_attempt_at",
      "provider_message_id",
      "delivery_state",
      "last_event_type",
      "last_webhook_at",
      "entity_type",
      "entity_id",
      "metadata",
      "created_at",
      "processed_at",
      "updated_at",
    ],
    mapRow(row) {
      return [
        row.id,
        row.kind,
        row.channel,
        row.recipient,
        row.subject,
        row.body,
        row.status,
        row.provider,
        Number(row.attempts),
        row.last_error,
        row.next_attempt_at,
        row.provider_message_id,
        row.delivery_state,
        row.last_event_type,
        row.last_webhook_at,
        row.entity_type,
        row.entity_id,
        row.metadata,
        row.created_at,
        row.processed_at,
        row.updated_at,
      ];
    },
  },
  {
    name: "job_locks",
    columns: ["name", "owner", "expires_at", "updated_at"],
    conflictColumns: ["name"],
    mapRow(row) {
      return [row.name, row.owner, row.expires_at, row.updated_at];
    },
  },
  {
    name: "notification_webhook_events",
    columns: [
      "id",
      "provider",
      "event_id",
      "event_type",
      "notification_job_id",
      "provider_message_id",
      "payload",
      "received_at",
    ],
    mapRow(row) {
      return [
        row.id,
        row.provider,
        row.event_id,
        row.event_type,
        row.notification_job_id,
        row.provider_message_id,
        row.payload,
        row.received_at,
      ];
    },
  },
  {
    name: "request_events",
    columns: [
      "id",
      "route",
      "fingerprint",
      "subject",
      "event_type",
      "metadata",
      "created_at",
    ],
    mapRow(row) {
      return [
        row.id,
        row.route,
        row.fingerprint,
        row.subject,
        row.event_type,
        row.metadata,
        row.created_at,
      ];
    },
  },
  {
    name: "analytics_events",
    columns: [
      "id",
      "route",
      "fingerprint",
      "subject",
      "event_type",
      "metadata",
      "created_at",
    ],
    mapRow(row) {
      return [
        row.id,
        row.route,
        row.fingerprint,
        row.subject,
        row.event_type,
        row.metadata,
        row.created_at,
      ];
    },
  },
];

const jsonColumns = new Set([
  "technologies",
  "features",
  "outcomes",
  "metadata",
  "payload",
  "value",
  "recovery_codes",
]);

function buildInsertQuery(table) {
  const placeholders = table.columns.map((_, index) => `$${index + 1}`).join(", ");
  const quotedColumns = table.columns.join(", ");
  const updateColumns = table.columns.filter(
    (column) => !(table.conflictColumns ?? ["id"]).includes(column)
  );
  const conflictColumns = (table.conflictColumns ?? ["id"]).join(", ");
  const updates = updateColumns
    .map((column) => `${column} = EXCLUDED.${column}`)
    .join(", ");

  return `
    INSERT INTO ${table.name} (${quotedColumns})
    VALUES (${placeholders})
    ON CONFLICT (${conflictColumns})
    DO UPDATE SET ${updates}
  `;
}

async function maybeTruncate(client) {
  if (!shouldTruncate) {
    return;
  }

  const tables = [...tableDefinitions].reverse().map((table) => table.name);
  for (const table of tables) {
    await client.query(`TRUNCATE TABLE ${table}`);
  }
}

function sqliteTableExists(tableName) {
  return Boolean(
    sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1"
      )
      .get(tableName)
  );
}

async function importTable(client, table) {
  if (!sqliteTableExists(table.name)) {
    return 0;
  }

  const rows = sqlite.prepare(`SELECT * FROM ${table.name}`).all();
  const query = buildInsertQuery(table);

  for (const row of rows) {
    const values = table.mapRow(row).map((value, index) => {
      const column = table.columns[index];

      if (value == null) {
        return null;
      }

      if (jsonColumns.has(column)) {
        return typeof value === "string" ? value : JSON.stringify(value);
      }

      return value;
    });

    await client.query(query, values);
  }

  return rows.length;
}

async function countRows(client, tableName) {
  const sqliteCount = Number(
    sqlite.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get().count ?? 0
  );
  const postgresCount = Number(
    (await client.query(`SELECT COUNT(*)::int as count FROM ${tableName}`)).rows[0]
      .count ?? 0
  );

  return {
    tableName,
    sqliteCount,
    postgresCount,
  };
}

async function main() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await maybeTruncate(client);

    for (const table of tableDefinitions) {
      const count = await importTable(client, table);
      console.info(`Imported ${count} row(s) into ${table.name}.`);
    }

    await client.query("COMMIT");

    console.info("Verifying row counts...");
    for (const table of tableDefinitions) {
      const summary = await countRows(client, table.name);
      console.info(
        `${summary.tableName}: sqlite=${summary.sqliteCount}, postgres=${summary.postgresCount}`
      );
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("SQLite to Postgres import failed.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
    sqlite.close?.();
  }
}

main().catch((error) => {
  console.error("SQLite to Postgres import failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
