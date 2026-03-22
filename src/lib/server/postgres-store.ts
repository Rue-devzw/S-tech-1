import "server-only";

import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import {
  type AdminMfaStatus,
  type AdminPasswordResetRequest,
  type AdminSession,
  type AdminSessionRecord,
  type AdminStatus,
  type AdminUser,
} from "@/lib/admin-user";
import {
  type AnalyticsEvent,
  type AnalyticsOverview,
} from "@/lib/analytics";
import { type AuditEvent } from "@/lib/audit";
import {
  getAdminDisplayName,
  getAdminPassword,
  getAdminUsername,
  getDatabaseUrl,
  getNotificationDeliveryConfigError,
  getNotificationWebhookConfigError,
  getSiteUrl,
} from "@/lib/env";
import {
  consumeRecoveryCode,
  createMfaChallengeRecord,
  createPasswordResetRecord,
  createTotpProvisioningUri,
  formatTotpSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashOpaqueToken,
  hashPassword,
  hashRecoveryCode,
  isStrongPassword,
  verifyPassword,
  verifyRecoveryCode,
  verifyTotpCode,
} from "@/lib/server/admin-identity";
import {
  type NotificationDeliveryState,
  type NotificationDeliveryMode,
  type NotificationJob,
  type NotificationQueueHealth,
  type NotificationSummary,
  type NotificationWebhookEvent,
} from "@/lib/notification-job";
import {
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettings,
} from "@/lib/platform-settings";
import { buildAnalyticsOverview } from "@/lib/server/analytics-rollups";
import {
  deliverNotification,
  getNotificationRetryDelayMs,
  shouldRetryNotificationFailure,
} from "@/lib/server/notification-delivery";
import {
  type Inquiry,
  INQUIRIES,
  type Listing,
  LISTINGS,
} from "@/lib/mock-data";
import { POSTGRES_MIGRATIONS } from "@/lib/server/postgres-migrations";

type QueryRow = Record<string, unknown>;

type QueryResult<Row extends QueryRow = QueryRow> = {
  rowCount: number | null;
  rows: Row[];
};

type Queryable = {
  query: <Row extends QueryRow = QueryRow>(
    sql: string,
    params?: unknown[]
  ) => Promise<QueryResult<Row>>;
};

type PostgresClient = Queryable & {
  release: () => void;
};

type PostgresPool = Queryable & {
  connect: () => Promise<PostgresClient>;
};

const require = createRequire(import.meta.url);

declare global {
  var __sTechPostgresPool: PostgresPool | undefined;
  var __sTechPostgresReady: boolean | undefined;
  var __sTechPostgresReadyPromise: Promise<void> | undefined;
}

function getPool() {
  if (!globalThis.__sTechPostgresPool) {
    const databaseUrl = getDatabaseUrl();

    if (!databaseUrl) {
      throw new Error(
        "Missing DATABASE_URL. Set it before using the Postgres data store."
      );
    }

    const postgresModule = require("@neondatabase/serverless") as {
      Pool: new (config: { connectionString: string }) => PostgresPool;
    };

    globalThis.__sTechPostgresPool = new postgresModule.Pool({
      connectionString: databaseUrl,
    });
  }

  return globalThis.__sTechPostgresPool;
}

async function withClient<T>(
  callback: (client: PostgresClient) => Promise<T>,
  retries = 1
): Promise<T> {
  let client;
  try {
    client = await getPool().connect();
    return await callback(client);
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes("Connection closed")) {
      globalThis.__sTechPostgresPool = undefined;
      return withClient(callback, retries - 1);
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function ensurePostgresReady() {
  if (globalThis.__sTechPostgresReady) {
    return;
  }

  if (!globalThis.__sTechPostgresReadyPromise) {
    globalThis.__sTechPostgresReadyPromise = initializePostgres()
      .then(() => {
        globalThis.__sTechPostgresReady = true;
      })
      .catch((error) => {
        globalThis.__sTechPostgresReadyPromise = undefined;
        throw error;
      });
  }

  await globalThis.__sTechPostgresReadyPromise;
}

async function initializePostgres() {
  await withClient(async (client) => {
    await ensureMigrationsTable(client);
    await applyPendingMigrations(client);
    await seedListings(client);
    await seedInquiries(client);
    await seedSettings(client);
    await seedAdminUsers(client);
  });
}

async function ensureMigrationsTable(queryable: Queryable) {
  await queryable.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function applyPendingMigrations(client: PostgresClient) {
  const appliedRows = await client.query<{ filename: string }>(
    "SELECT filename FROM schema_migrations ORDER BY filename ASC"
  );
  const applied = new Set(appliedRows.rows.map((row) => row.filename));

  for (const migration of POSTGRES_MIGRATIONS) {
    const { filename, sql } = migration;

    if (applied.has(filename)) {
      continue;
    }

    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query(
        `
          INSERT INTO schema_migrations (filename, applied_at)
          VALUES ($1, NOW())
          ON CONFLICT (filename) DO NOTHING
        `,
        [filename]
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
}

async function seedListings(queryable: Queryable) {
  const row = await queryOne<{ count: number }>(
    queryable,
    "SELECT COUNT(*)::int AS count FROM listings"
  );
  const count = Number(row?.count ?? 0);

  if (count > 0) {
    return;
  }

  const listings = LISTINGS;
  const baseTime = Date.now();

  for (const [index, listing] of listings.entries()) {
    const timestamp = new Date(baseTime + index).toISOString();

    await queryable.query(
      `
        INSERT INTO listings (
          id, slug, name, category, price, short_description, description, client,
          industry, delivery_timeline, support_window, featured, technologies,
          features, outcomes, image_url, preview_url, rating, sales_count,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb,
          $14::jsonb, $15::jsonb, $16, $17, $18, $19, $20, $21
        )
      `,
      [
        listing.id,
        listing.slug,
        listing.name,
        listing.category,
        listing.price,
        listing.shortDescription,
        listing.description,
        listing.client,
        listing.industry,
        listing.deliveryTimeline,
        listing.supportWindow,
        listing.featured,
        JSON.stringify(listing.technologies),
        JSON.stringify(listing.features),
        JSON.stringify(listing.outcomes),
        listing.imageUrl,
        listing.previewUrl || null,
        listing.rating,
        listing.salesCount,
        timestamp,
        timestamp,
      ]
    );
  }
}

async function seedInquiries(queryable: Queryable) {
  const row = await queryOne<{ count: number }>(
    queryable,
    "SELECT COUNT(*)::int AS count FROM inquiries"
  );
  const count = Number(row?.count ?? 0);

  if (count > 0) {
    return;
  }

  const inquiries = INQUIRIES;
  const baseTime = Date.now();

  for (const [index, inquiry] of inquiries.entries()) {
    const timestamp = new Date(baseTime + index).toISOString();

    await queryable.query(
      `
        INSERT INTO inquiries (
          id, listing_id, listing_name, user_name, user_email, message,
          status, date, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        inquiry.id,
        inquiry.listingId,
        inquiry.listingName,
        inquiry.userName,
        inquiry.userEmail,
        inquiry.message,
        inquiry.status,
        inquiry.date,
        timestamp,
        timestamp,
      ]
    );
  }
}

async function seedSettings(queryable: Queryable) {
  const row = await queryOne<{ count: number }>(
    queryable,
    "SELECT COUNT(*)::int AS count FROM app_settings"
  );
  const count = Number(row?.count ?? 0);

  if (count > 0) {
    return;
  }

  const now = new Date().toISOString();

  await queryable.query(
    `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ($1, $2::jsonb, $3), ($4, $5::jsonb, $6), ($7, $8::jsonb, $9)
    `,
    [
      "general",
      JSON.stringify(DEFAULT_PLATFORM_SETTINGS.general),
      now,
      "notifications",
      JSON.stringify(DEFAULT_PLATFORM_SETTINGS.notifications),
      now,
      "security",
      JSON.stringify(DEFAULT_PLATFORM_SETTINGS.security),
      now,
    ]
  );
}

async function seedAdminUsers(queryable: Queryable) {
  const row = await queryOne<{ count: number }>(
    queryable,
    "SELECT COUNT(*)::int AS count FROM admin_users"
  );
  const count = Number(row?.count ?? 0);

  if (count > 0) {
    return;
  }

  const now = new Date().toISOString();

  await queryable.query(
    `
      INSERT INTO admin_users (
        id, username, display_name, email, role, status, password_hash,
        last_login_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
    [
      randomUUID(),
      getAdminUsername(),
      getAdminDisplayName(),
      `${getAdminUsername()}@s-tech.local`,
      "owner",
      "active",
      hashPassword(getAdminPassword()),
      null,
      now,
      now,
    ]
  );
}

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value !== "string") {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function toTimestamp(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function toOptionalTimestamp(value: unknown) {
  return value == null ? null : toTimestamp(value);
}

function mapListingRow(row: QueryRow): Listing {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    category: String(row.category),
    price: Number(row.price),
    shortDescription: String(row.short_description),
    description: String(row.description),
    client: String(row.client),
    industry: String(row.industry),
    deliveryTimeline: String(row.delivery_timeline),
    supportWindow: String(row.support_window),
    featured: Boolean(row.featured),
    technologies: parseJsonArray(row.technologies),
    features: parseJsonArray(row.features),
    outcomes: parseJsonArray(row.outcomes),
    imageUrl: String(row.image_url),
    previewUrl: row.preview_url ? String(row.preview_url) : "",
    rating: Number(row.rating),
    salesCount: Number(row.sales_count),
  };
}

function mapInquiryRow(row: QueryRow): Inquiry {
  return {
    id: String(row.id),
    listingId: String(row.listing_id),
    listingName: String(row.listing_name),
    userName: String(row.user_name),
    userEmail: String(row.user_email),
    message: String(row.message),
    status: String(row.status) as Inquiry["status"],
    date: String(row.date),
  };
}

function mapAuditRow(row: QueryRow): AuditEvent {
  return {
    id: String(row.id),
    actor: String(row.actor),
    action: String(row.action),
    entityType: String(row.entity_type) as AuditEvent["entityType"],
    entityId: String(row.entity_id),
    summary: String(row.summary),
    metadata: parseJsonObject(row.metadata),
    createdAt: toTimestamp(row.created_at),
  };
}

function mapAnalyticsEventRow(row: QueryRow): AnalyticsEvent {
  return {
    id: String(row.id),
    route: String(row.route),
    fingerprint: String(row.fingerprint),
    subject: row.subject ? String(row.subject) : null,
    eventType: String(row.event_type) as AnalyticsEvent["eventType"],
    metadata: parseJsonObject(row.metadata),
    createdAt: toTimestamp(row.created_at),
  };
}

function mapNotificationJobRow(row: QueryRow): NotificationJob {
  return {
    id: String(row.id),
    kind: String(row.kind),
    channel: "email",
    recipient: String(row.recipient),
    subject: String(row.subject),
    body: String(row.body),
    status: String(row.status) as NotificationJob["status"],
    provider: String(row.provider) as NotificationDeliveryMode,
    attempts: Number(row.attempts),
    lastError: row.last_error ? String(row.last_error) : null,
    nextAttemptAt: toOptionalTimestamp(row.next_attempt_at),
    providerMessageId: row.provider_message_id
      ? String(row.provider_message_id)
      : null,
    deliveryState: row.delivery_state
      ? (String(row.delivery_state) as NotificationDeliveryState)
      : "queued",
    lastEventType: row.last_event_type ? String(row.last_event_type) : null,
    lastWebhookAt: toOptionalTimestamp(row.last_webhook_at),
    entityType: String(row.entity_type) as NotificationJob["entityType"],
    entityId: String(row.entity_id),
    metadata: parseJsonObject(row.metadata),
    createdAt: toTimestamp(row.created_at),
    processedAt: toOptionalTimestamp(row.processed_at),
    updatedAt: toTimestamp(row.updated_at),
  };
}

function mapNotificationWebhookEventRow(row: QueryRow): NotificationWebhookEvent {
  return {
    id: String(row.id),
    provider: "resend",
    eventId: String(row.event_id),
    eventType: String(row.event_type),
    notificationJobId: row.notification_job_id
      ? String(row.notification_job_id)
      : null,
    providerMessageId: row.provider_message_id
      ? String(row.provider_message_id)
      : null,
    payload: parseJsonObject(row.payload),
    receivedAt: toTimestamp(row.received_at),
  };
}

function mapResendEventToDeliveryState(
  eventType: string
): NotificationDeliveryState {
  switch (eventType) {
    case "email.sent":
      return "sent";
    case "email.delivered":
      return "delivered";
    case "email.delivery_delayed":
      return "delivery_delayed";
    case "email.bounced":
      return "bounced";
    case "email.complained":
      return "complained";
    case "email.opened":
      return "opened";
    case "email.clicked":
      return "clicked";
    case "email.failed":
      return "failed";
    case "email.scheduled":
      return "scheduled";
    case "email.suppressed":
      return "suppressed";
    default:
      return "sent";
  }
}

function isFailureDeliveryState(state: NotificationDeliveryState) {
  return (
    state === "bounced" ||
    state === "complained" ||
    state === "failed" ||
    state === "suppressed"
  );
}

function mapAdminUserRow(row: QueryRow): AdminUser {
  return {
    id: String(row.id),
    username: String(row.username),
    displayName: String(row.display_name),
    email: String(row.email),
    role: String(row.role) as AdminUser["role"],
    status: String(row.status) as AdminStatus,
    mfaEnabled: Boolean(row.mfa_enabled),
    lastLoginAt: toOptionalTimestamp(row.last_login_at),
    createdAt: toTimestamp(row.created_at),
  };
}

function mapAdminSessionRecordRow(row: QueryRow): AdminSessionRecord {
  return {
    id: String(row.session_id),
    expiresAt: toTimestamp(row.expires_at),
    createdAt: toTimestamp(row.created_at),
    lastSeenAt: toTimestamp(row.last_seen_at),
    user: mapAdminUserRow({
      ...row,
      created_at: row.user_created_at,
    }),
  };
}

function mapPasswordResetRequestRow(row: QueryRow): AdminPasswordResetRequest {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    expiresAt: toTimestamp(row.expires_at),
    createdAt: toTimestamp(row.created_at),
    consumedAt: toOptionalTimestamp(row.consumed_at),
    requestedBy: String(row.requested_by),
  };
}

function getMfaEnabledSelect(prefix = "u") {
  const userIdReference = prefix ? `${prefix}.id` : "id";
  return `
    EXISTS (
      SELECT 1
      FROM admin_mfa_credentials m
      WHERE m.user_id = ${userIdReference}
        AND m.pending = FALSE
        AND m.enabled_at IS NOT NULL
    ) AS mfa_enabled
  `;
}

function getDefaultMfaStatus(): AdminMfaStatus {
  return {
    enabled: false,
    pending: false,
    enabledAt: null,
    recoveryCodesRemaining: 0,
  };
}

async function queryRows<Row extends QueryRow = QueryRow>(
  sql: string,
  params: unknown[] = [],
  retries = 1
): Promise<Row[]> {
  await ensurePostgresReady();
  try {
    const result = await getPool().query<Row>(sql, params);
    return result.rows;
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes("Connection closed")) {
      globalThis.__sTechPostgresPool = undefined;
      return queryRows(sql, params, retries - 1);
    }
    throw error;
  }
}

async function queryOne<Row extends QueryRow = QueryRow>(
  queryable: Queryable,
  sql: string,
  params: unknown[] = []
) {
  const result = await queryable.query<Row>(sql, params);
  return result.rows[0];
}

async function queryValue<Row extends QueryRow = QueryRow>(
  sql: string,
  params: unknown[] = []
) {
  const rows = await queryRows<Row>(sql, params);
  return rows[0];
}

async function recordAuditEvent(
  queryable: Queryable,
  event: Omit<AuditEvent, "id" | "createdAt">
) {
  const now = new Date().toISOString();

  await queryable.query(
    `
      INSERT INTO audit_events (
        id, actor, action, entity_type, entity_id, summary, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
    `,
    [
      randomUUID(),
      event.actor,
      event.action,
      event.entityType,
      event.entityId,
      event.summary,
      JSON.stringify(event.metadata),
      now,
    ]
  );
}

async function pruneRequestEvents(queryable: Queryable) {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  await queryable.query("DELETE FROM request_events WHERE created_at < $1", [
    cutoff,
  ]);
}

async function pruneAnalyticsEvents(queryable: Queryable) {
  const cutoff = new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toISOString();

  await queryable.query("DELETE FROM analytics_events WHERE created_at < $1", [
    cutoff,
  ]);
}

function normalizeInquiryMessage(message: string) {
  return message.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function getListings() {
  const rows = await queryRows(
    `
      SELECT * FROM listings
      ORDER BY featured DESC, sales_count DESC, created_at ASC
    `
  );

  return rows.map(mapListingRow);
}

export async function getListingById(id: string) {
  const row = await queryValue("SELECT * FROM listings WHERE id = $1", [id]);
  return row ? mapListingRow(row) : null;
}

export async function upsertListing(listing: Listing, actor = "admin") {
  const existing = await queryValue<{ created_at: unknown }>(
    "SELECT created_at FROM listings WHERE id = $1",
    [listing.id]
  );
  const now = new Date().toISOString();
  const createdAt = existing?.created_at ? toTimestamp(existing.created_at) : now;

  await getPool().query(
    `
      INSERT INTO listings (
        id, slug, name, category, price, short_description, description, client,
        industry, delivery_timeline, support_window, featured, technologies,
        features, outcomes, image_url, preview_url, rating, sales_count,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb,
        $14::jsonb, $15::jsonb, $16, $17, $18, $19, $20, $21
      )
      ON CONFLICT (id)
      DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        client = EXCLUDED.client,
        industry = EXCLUDED.industry,
        delivery_timeline = EXCLUDED.delivery_timeline,
        support_window = EXCLUDED.support_window,
        featured = EXCLUDED.featured,
        technologies = EXCLUDED.technologies,
        features = EXCLUDED.features,
        outcomes = EXCLUDED.outcomes,
        image_url = EXCLUDED.image_url,
        preview_url = EXCLUDED.preview_url,
        rating = EXCLUDED.rating,
        sales_count = EXCLUDED.sales_count,
        created_at = EXCLUDED.created_at,
        updated_at = EXCLUDED.updated_at
    `,
    [
      listing.id,
      listing.slug,
      listing.name,
      listing.category,
      listing.price,
      listing.shortDescription,
      listing.description,
      listing.client,
      listing.industry,
      listing.deliveryTimeline,
      listing.supportWindow,
      listing.featured,
      JSON.stringify(listing.technologies),
      JSON.stringify(listing.features),
      JSON.stringify(listing.outcomes),
      listing.imageUrl,
      listing.previewUrl || null,
      listing.rating,
      listing.salesCount,
      createdAt,
      now,
    ]
  );

  await recordAuditEvent(getPool(), {
    actor,
    action: existing ? "listing.updated" : "listing.created",
    entityType: "listing",
    entityId: listing.id,
    summary: `${existing ? "Updated" : "Created"} listing "${listing.name}"`,
    metadata: {
      category: listing.category,
      price: listing.price,
      featured: listing.featured,
    },
  });

  return listing;
}

export async function deleteListing(id: string, actor = "admin") {
  const existing = await queryValue("SELECT * FROM listings WHERE id = $1", [id]);

  if (!existing) {
    return false;
  }

  await getPool().query("DELETE FROM listings WHERE id = $1", [id]);

  await recordAuditEvent(getPool(), {
    actor,
    action: "listing.deleted",
    entityType: "listing",
    entityId: id,
    summary: `Deleted listing "${String(existing.name)}"`,
    metadata: {
      category: String(existing.category),
    },
  });

  return true;
}

export async function getInquiries() {
  const rows = await queryRows(
    `
      SELECT * FROM inquiries
      ORDER BY created_at DESC
    `
  );

  return rows.map(mapInquiryRow);
}

export async function createInquiry(
  input: Omit<Inquiry, "id" | "status" | "date">,
  actor = "public"
) {
  const inquiry: Inquiry = {
    id: randomUUID(),
    listingId: input.listingId,
    listingName: input.listingName,
    userName: input.userName.trim(),
    userEmail: input.userEmail.trim().toLowerCase(),
    message: input.message.trim(),
    status: "pending",
    date: new Date().toISOString().slice(0, 10),
  };
  const now = new Date().toISOString();

  await getPool().query(
    `
      INSERT INTO inquiries (
        id, listing_id, listing_name, user_name, user_email, message,
        status, date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
    [
      inquiry.id,
      inquiry.listingId,
      inquiry.listingName,
      inquiry.userName,
      inquiry.userEmail,
      inquiry.message,
      inquiry.status,
      inquiry.date,
      now,
      now,
    ]
  );

  await recordAuditEvent(getPool(), {
    actor,
    action: "inquiry.created",
    entityType: "inquiry",
    entityId: inquiry.id,
    summary: `Created inquiry for "${inquiry.listingName}"`,
    metadata: {
      userEmail: inquiry.userEmail,
      status: inquiry.status,
    },
  });

  const settings = await getPlatformSettings();

  if (settings.notifications.emailOnNewInquiry) {
    const recipient =
      settings.notifications.adminNotificationEmail ||
      settings.general.contactEmail;

    await createNotificationJob({
      kind: "inquiry.created",
      recipient,
      subject: `New inquiry: ${inquiry.listingName}`,
      body: [
        `Listing: ${inquiry.listingName}`,
        `Customer: ${inquiry.userName} <${inquiry.userEmail}>`,
        `Date: ${inquiry.date}`,
        "",
        inquiry.message,
      ].join("\n"),
      provider: settings.notifications.deliveryMode,
      entityType: "inquiry",
      entityId: inquiry.id,
      metadata: {
        listingId: inquiry.listingId,
        userEmail: inquiry.userEmail,
      },
    });

    if (
      settings.notifications.autoDispatchInquiryEmails &&
      settings.notifications.deliveryMode !== "disabled"
    ) {
      await runNotificationDispatchCycle({
        limit: 10,
        actor: "system:auto",
      });
    }
  }

  return inquiry;
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry["status"],
  actor = "admin"
) {
  const existing = await queryValue("SELECT * FROM inquiries WHERE id = $1", [id]);

  if (!existing) {
    return null;
  }

  const updatedAt = new Date().toISOString();

  await getPool().query(
    "UPDATE inquiries SET status = $1, updated_at = $2 WHERE id = $3",
    [status, updatedAt, id]
  );

  const updated = await queryValue("SELECT * FROM inquiries WHERE id = $1", [id]);

  await recordAuditEvent(getPool(), {
    actor,
    action: "inquiry.status_updated",
    entityType: "inquiry",
    entityId: id,
    summary: `Marked inquiry "${id}" as ${status}`,
    metadata: {
      previousStatus: String(existing.status),
      nextStatus: status,
      listingName: String(existing.listing_name),
    },
  });

  return updated ? mapInquiryRow(updated) : null;
}

export async function getAuditEvents(limit = 20) {
  const rows = await queryRows(
    `
      SELECT * FROM audit_events
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );

  return rows.map(mapAuditRow);
}

export async function recordRequestEvent(input: {
  route: string;
  fingerprint: string;
  eventType: string;
  subject?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const now = new Date().toISOString();

  await pruneRequestEvents(getPool());
  await getPool().query(
    `
      INSERT INTO request_events (
        id, route, fingerprint, subject, event_type, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
    `,
    [
      randomUUID(),
      input.route,
      input.fingerprint,
      input.subject ?? null,
      input.eventType,
      JSON.stringify(input.metadata ?? {}),
      now,
    ]
  );
}

export async function countRecentRequestEvents(input: {
  route: string;
  windowMs: number;
  eventType: string;
  fingerprint?: string;
  subject?: string;
}) {
  const since = new Date(Date.now() - input.windowMs).toISOString();
  const params: unknown[] = [input.route, input.eventType, since];
  const conditions = [
    "route = $1",
    "event_type = $2",
    "created_at >= $3",
  ];

  if (input.fingerprint) {
    params.push(input.fingerprint);
    conditions.push(`fingerprint = $${params.length}`);
  }

  if (input.subject) {
    params.push(input.subject);
    conditions.push(`subject = $${params.length}`);
  }

  const row = await queryValue<{ count: number }>(
    `
      SELECT COUNT(*)::int AS count
      FROM request_events
      WHERE ${conditions.join(" AND ")}
    `,
    params
  );

  return Number(row?.count ?? 0);
}

export async function recordAnalyticsEvent(input: {
  route: string;
  fingerprint: string;
  eventType: AnalyticsEvent["eventType"];
  subject?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const now = new Date().toISOString();

  await pruneAnalyticsEvents(getPool());
  await getPool().query(
    `
      INSERT INTO analytics_events (
        id, route, fingerprint, subject, event_type, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
    `,
    [
      randomUUID(),
      input.route,
      input.fingerprint,
      input.subject ?? null,
      input.eventType,
      JSON.stringify(input.metadata ?? {}),
      now,
    ]
  );
}

export async function getAnalyticsOverview(windowDays = 30): Promise<AnalyticsOverview> {
  const analyticsSince = new Date(
    Date.now() - 180 * 24 * 60 * 60 * 1000
  ).toISOString();
  const [events, inquiries, listings] = await Promise.all([
    queryRows(
      `
        SELECT * FROM analytics_events
        WHERE created_at >= $1
        ORDER BY created_at ASC
      `,
      [analyticsSince]
    ),
    queryRows(
      `
        SELECT
          i.id AS inquiry_id,
          i.listing_id,
          i.listing_name,
          COALESCE(l.category, 'Uncategorized') AS category,
          COALESCE(l.price, 0) AS price,
          i.created_at
        FROM inquiries i
        LEFT JOIN listings l ON l.id = i.listing_id
        WHERE i.created_at >= $1
        ORDER BY i.created_at ASC
      `,
      [analyticsSince]
    ),
    getListings(),
  ]);

  return buildAnalyticsOverview({
    events: events.map(mapAnalyticsEventRow),
    inquiries: inquiries.map((row) => ({
      inquiryId: String(row.inquiry_id),
      listingId: String(row.listing_id),
      listingName: String(row.listing_name),
      category: String(row.category),
      price: Number(row.price),
      createdAt: toTimestamp(row.created_at),
    })),
    listings,
    windowDays,
  });
}

export async function recordSecurityAudit(input: {
  actor: string;
  action: string;
  entityId: string;
  summary: string;
  metadata?: Record<string, unknown>;
}) {
  await recordAuditEvent(getPool(), {
    actor: input.actor,
    action: input.action,
    entityType: "security",
    entityId: input.entityId,
    summary: input.summary,
    metadata: input.metadata ?? {},
  });
}

export async function hasRecentDuplicateInquiry(input: {
  listingId: string;
  userEmail: string;
  message: string;
  windowMs: number;
}) {
  const since = new Date(Date.now() - input.windowMs).toISOString();
  const rows = await queryRows(
    `
      SELECT message
      FROM inquiries
      WHERE listing_id = $1
        AND user_email = $2
        AND created_at >= $3
      ORDER BY created_at DESC
      LIMIT 10
    `,
    [input.listingId, input.userEmail.trim().toLowerCase(), since]
  );

  const normalizedIncoming = normalizeInquiryMessage(input.message);
  return rows.some(
    (row) => normalizeInquiryMessage(String(row.message)) === normalizedIncoming
  );
}

export async function getNotificationJobs(limit = 25) {
  const rows = await queryRows(
    `
      SELECT * FROM notification_jobs
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );

  return rows.map(mapNotificationJobRow);
}

export async function getNotificationSummary(): Promise<NotificationSummary> {
  const rows = await queryRows(
    `
      SELECT status, COUNT(*)::int AS count
      FROM notification_jobs
      GROUP BY status
    `
  );

  const summary: NotificationSummary = {
    queued: 0,
    sent: 0,
    failed: 0,
  };

  rows.forEach((row) => {
    const status = String(row.status) as keyof NotificationSummary;

    if (status in summary) {
      summary[status] = Number(row.count);
    }
  });

  return summary;
}

export async function getNotificationQueueHealth(): Promise<NotificationQueueHealth> {
  const settings = await getPlatformSettings();
  const deliveryMode = settings.notifications.deliveryMode;
  const providerConfigError = getNotificationDeliveryConfigError(deliveryMode);
  const webhookConfigError = getNotificationWebhookConfigError(deliveryMode);
  const now = new Date().toISOString();

  const [
    dueRow,
    retryRow,
    failedRow,
    oldestDueRow,
    oldestFailureRow,
    lockRow,
    lastDispatchCompletedRow,
    lastDispatchAttemptRow,
    lastWebhookRow,
  ] = await Promise.all([
    queryValue<{ count: number }>(
      `
        SELECT COUNT(*)::int AS count
        FROM notification_jobs
        WHERE status = 'queued'
          AND (next_attempt_at IS NULL OR next_attempt_at <= $1)
      `,
      [now]
    ),
    queryValue<{ count: number }>(
      `
        SELECT COUNT(*)::int AS count
        FROM notification_jobs
        WHERE status = 'queued'
          AND attempts > 0
          AND next_attempt_at > $1
      `,
      [now]
    ),
    queryValue<{ count: number }>(
      `
        SELECT COUNT(*)::int AS count
        FROM notification_jobs
        WHERE status = 'failed'
      `
    ),
    queryValue<{ created_at: unknown }>(
      `
        SELECT created_at
        FROM notification_jobs
        WHERE status = 'queued'
          AND (next_attempt_at IS NULL OR next_attempt_at <= $1)
        ORDER BY created_at ASC
        LIMIT 1
      `,
      [now]
    ),
    queryValue<{ updated_at: unknown }>(
      `
        SELECT updated_at
        FROM notification_jobs
        WHERE status = 'failed'
        ORDER BY updated_at ASC
        LIMIT 1
      `
    ),
    queryValue(
      `
        SELECT expires_at
        FROM job_locks
        WHERE name = $1
          AND expires_at > $2
      `,
      ["notification_dispatch", now]
    ),
    queryValue(
      `
        SELECT created_at, metadata
        FROM audit_events
        WHERE action = 'notification.dispatch_completed'
        ORDER BY created_at DESC
        LIMIT 1
      `
    ),
    queryValue(
      `
        SELECT created_at
        FROM audit_events
        WHERE action IN (
          'notification.dispatch_completed',
          'notification.dispatch_skipped',
          'notification.dispatch_blocked'
        )
        ORDER BY created_at DESC
        LIMIT 1
      `
    ),
    queryValue(
      `
        SELECT received_at
        FROM notification_webhook_events
        ORDER BY received_at DESC
        LIMIT 1
      `
    ),
  ]);
  const lastDispatchMetadata = parseJsonObject(lastDispatchCompletedRow?.metadata);
  const processedCount = lastDispatchMetadata.processedCount;

  return {
    deliveryMode,
    providerReady: providerConfigError === null,
    providerConfigError,
    webhookConfigError,
    dueNow: Number(dueRow?.count ?? 0),
    scheduledRetries: Number(retryRow?.count ?? 0),
    deadLetters: Number(failedRow?.count ?? 0),
    oldestDueCreatedAt: toOptionalTimestamp(oldestDueRow?.created_at),
    oldestFailureAt: toOptionalTimestamp(oldestFailureRow?.updated_at),
    lockActive: Boolean(lockRow),
    lastDispatchCompletedAt: toOptionalTimestamp(lastDispatchCompletedRow?.created_at),
    lastDispatchAttemptAt: toOptionalTimestamp(lastDispatchAttemptRow?.created_at),
    lastDispatchProcessedCount:
      typeof processedCount === "number" ? processedCount : null,
    lastWebhookReceivedAt: toOptionalTimestamp(lastWebhookRow?.received_at),
  };
}

export async function countDueNotificationJobs() {
  const now = new Date().toISOString();
  const row = await queryValue<{ count: number }>(
    `
      SELECT COUNT(*)::int AS count
      FROM notification_jobs
      WHERE status = 'queued'
        AND (next_attempt_at IS NULL OR next_attempt_at <= $1)
    `,
    [now]
  );

  return Number(row?.count ?? 0);
}

export async function createNotificationJob(input: {
  kind: string;
  recipient: string;
  subject: string;
  body: string;
  provider: NotificationDeliveryMode;
  entityType: NotificationJob["entityType"];
  entityId: string;
  metadata?: Record<string, unknown>;
}) {
  const now = new Date().toISOString();
  const job: NotificationJob = {
    id: randomUUID(),
    kind: input.kind,
    channel: "email",
    recipient: input.recipient.trim().toLowerCase(),
    subject: input.subject,
    body: input.body,
    status: "queued",
    provider: input.provider,
    attempts: 0,
    lastError: null,
    nextAttemptAt: now,
    providerMessageId: null,
    deliveryState: "queued",
    lastEventType: null,
    lastWebhookAt: null,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata ?? {},
    createdAt: now,
    processedAt: null,
    updatedAt: now,
  };

  await getPool().query(
    `
      INSERT INTO notification_jobs (
        id, kind, channel, recipient, subject, body, status, provider,
        attempts, last_error, next_attempt_at, provider_message_id,
        delivery_state, last_event_type, last_webhook_at, entity_type,
        entity_id, metadata, created_at, processed_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18::jsonb, $19, $20, $21
      )
    `,
    [
      job.id,
      job.kind,
      job.channel,
      job.recipient,
      job.subject,
      job.body,
      job.status,
      job.provider,
      job.attempts,
      null,
      job.nextAttemptAt,
      null,
      job.deliveryState,
      null,
      null,
      job.entityType,
      job.entityId,
      JSON.stringify(job.metadata),
      job.createdAt,
      null,
      job.updatedAt,
    ]
  );

  await recordAuditEvent(getPool(), {
    actor: "system",
    action: "notification.queued",
    entityType: "notification",
    entityId: job.id,
    summary: `Queued ${job.kind} notification to ${job.recipient}`,
    metadata: {
      provider: job.provider,
      entityType: job.entityType,
      entityId: job.entityId,
    },
  });

  return job;
}

export async function dispatchQueuedNotificationJobs(
  limit = 20,
  actor = "admin"
) {
  const now = new Date().toISOString();
  const rows = await queryRows(
    `
      SELECT * FROM notification_jobs
      WHERE status = 'queued'
        AND (next_attempt_at IS NULL OR next_attempt_at <= $1)
      ORDER BY created_at ASC
      LIMIT $2
    `,
    [now, limit]
  );

  const processedJobs: NotificationJob[] = [];

  for (const row of rows) {
    const job = mapNotificationJobRow(row);
    const attempts = job.attempts + 1;
    const updatedAt = new Date().toISOString();

    try {
      const delivery = await deliverNotification(job);

      await getPool().query(
        `
          UPDATE notification_jobs
          SET status = 'sent',
              attempts = $1,
              last_error = NULL,
              next_attempt_at = NULL,
              provider_message_id = $2,
              delivery_state = 'sent',
              last_event_type = COALESCE(last_event_type, 'email.sent'),
              processed_at = $3,
              updated_at = $4
          WHERE id = $5
        `,
        [attempts, delivery.providerMessageId, updatedAt, updatedAt, job.id]
      );

      await recordAuditEvent(getPool(), {
        actor,
        action: "notification.sent",
        entityType: "notification",
        entityId: job.id,
        summary: `Delivered ${job.kind} notification to ${job.recipient}`,
        metadata: {
          provider: job.provider,
          attempts,
          providerMessageId: delivery.providerMessageId,
        },
      });
    } catch (caughtError) {
      const lastError =
        caughtError instanceof Error
          ? caughtError.message
          : "Unknown notification delivery failure.";

      if (shouldRetryNotificationFailure(caughtError, attempts)) {
        const nextAttemptAt = new Date(
          Date.now() + getNotificationRetryDelayMs(attempts)
        ).toISOString();

        await getPool().query(
          `
            UPDATE notification_jobs
            SET status = 'queued',
                attempts = $1,
                last_error = $2,
                next_attempt_at = $3,
                delivery_state = 'queued',
                updated_at = $4
            WHERE id = $5
          `,
          [attempts, lastError, nextAttemptAt, updatedAt, job.id]
        );

        await recordAuditEvent(getPool(), {
          actor,
          action: "notification.retry_scheduled",
          entityType: "notification",
          entityId: job.id,
          summary: `Scheduled retry for ${job.kind} notification to ${job.recipient}`,
          metadata: {
            provider: job.provider,
            attempts,
            error: lastError,
            nextAttemptAt,
          },
        });
      } else {
        await getPool().query(
          `
            UPDATE notification_jobs
            SET status = 'failed',
                attempts = $1,
                last_error = $2,
                next_attempt_at = NULL,
                delivery_state = 'failed',
                processed_at = $3,
                updated_at = $4
            WHERE id = $5
          `,
          [attempts, lastError, updatedAt, updatedAt, job.id]
        );

        await recordAuditEvent(getPool(), {
          actor,
          action: "notification.failed",
          entityType: "notification",
          entityId: job.id,
          summary: `Failed ${job.kind} notification for ${job.recipient}`,
          metadata: {
            provider: job.provider,
            attempts,
            error: lastError,
          },
        });
      }
    }

    const updated = await queryValue(
      "SELECT * FROM notification_jobs WHERE id = $1",
      [job.id]
    );

    if (updated) {
      processedJobs.push(mapNotificationJobRow(updated));
    }
  }

  return processedJobs;
}

export async function requeueFailedNotificationJobs(
  limit = 20,
  actor = "admin"
) {
  const rows = await queryRows(
    `
      SELECT * FROM notification_jobs
      WHERE status = 'failed'
      ORDER BY updated_at ASC
      LIMIT $1
    `,
    [limit]
  );

  const requeuedJobs: NotificationJob[] = [];
  const now = new Date().toISOString();

  for (const row of rows) {
    const job = mapNotificationJobRow(row);

    await getPool().query(
      `
        UPDATE notification_jobs
        SET status = 'queued',
            attempts = 0,
            last_error = NULL,
            next_attempt_at = $1,
            provider_message_id = NULL,
            delivery_state = 'queued',
            last_event_type = NULL,
            last_webhook_at = NULL,
            processed_at = NULL,
            updated_at = $2
        WHERE id = $3
      `,
      [now, now, job.id]
    );

    await recordAuditEvent(getPool(), {
      actor,
      action: "notification.requeued",
      entityType: "notification",
      entityId: job.id,
      summary: `Requeued ${job.kind} notification to ${job.recipient}`,
      metadata: {
        provider: job.provider,
      },
    });

    const updated = await queryValue(
      "SELECT * FROM notification_jobs WHERE id = $1",
      [job.id]
    );

    if (updated) {
      requeuedJobs.push(mapNotificationJobRow(updated));
    }
  }

  return requeuedJobs;
}

export async function getNotificationWebhookEvents(limit = 25) {
  const rows = await queryRows(
    `
      SELECT * FROM notification_webhook_events
      ORDER BY received_at DESC
      LIMIT $1
    `,
    [limit]
  );

  return rows.map(mapNotificationWebhookEventRow);
}

export async function ingestResendWebhookEvent(input: {
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
  providerMessageId?: string | null;
}) {
  const receivedAt = new Date().toISOString();
  const providerMessageId = input.providerMessageId?.trim() || null;
  const inserted = await getPool().query<{ id: string }>(
    `
      INSERT INTO notification_webhook_events (
        id, provider, event_id, event_type, notification_job_id,
        provider_message_id, payload, received_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
      ON CONFLICT (event_id) DO NOTHING
      RETURNING id
    `,
    [
      randomUUID(),
      "resend",
      input.eventId,
      input.eventType,
      null,
      providerMessageId,
      JSON.stringify(input.payload),
      receivedAt,
    ]
  );

  if ((inserted.rowCount ?? 0) === 0) {
    const existing = await queryValue(
      "SELECT * FROM notification_webhook_events WHERE event_id = $1",
      [input.eventId]
    );

    return {
      duplicate: true,
      event: existing ? mapNotificationWebhookEventRow(existing) : null,
      job: null,
    };
  }

  const deliveryState = mapResendEventToDeliveryState(input.eventType);
  const lastError = isFailureDeliveryState(deliveryState)
    ? input.eventType
    : null;
  const jobRow = providerMessageId
    ? await queryValue(
        "SELECT * FROM notification_jobs WHERE provider_message_id = $1",
        [providerMessageId]
      )
    : undefined;

  let updatedJob: NotificationJob | null = null;
  let webhookEvent = await queryValue(
    "SELECT * FROM notification_webhook_events WHERE event_id = $1",
    [input.eventId]
  );

  if (jobRow) {
    const jobId = String(jobRow.id);
    const nextStatus = isFailureDeliveryState(deliveryState) ? "failed" : "sent";

    await getPool().query(
      `
        UPDATE notification_jobs
        SET status = $1,
            delivery_state = $2,
            last_event_type = $3,
            last_webhook_at = $4,
            last_error = $5,
            updated_at = $6
        WHERE id = $7
      `,
      [
        nextStatus,
        deliveryState,
        input.eventType,
        receivedAt,
        lastError,
        receivedAt,
        jobId,
      ]
    );

    await getPool().query(
      `
        UPDATE notification_webhook_events
        SET notification_job_id = $1
        WHERE event_id = $2
      `,
      [jobId, input.eventId]
    );

    await recordAuditEvent(getPool(), {
      actor: "system:webhook",
      action: "notification.webhook_received",
      entityType: "notification",
      entityId: jobId,
      summary: `Applied ${input.eventType} webhook to notification ${jobId}`,
      metadata: {
        provider: "resend",
        providerMessageId,
        deliveryState,
      },
    });

    const refreshedJob = await queryValue(
      "SELECT * FROM notification_jobs WHERE id = $1",
      [jobId]
    );
    updatedJob = refreshedJob ? mapNotificationJobRow(refreshedJob) : null;
    webhookEvent = await queryValue(
      "SELECT * FROM notification_webhook_events WHERE event_id = $1",
      [input.eventId]
    );
  } else {
    await recordAuditEvent(getPool(), {
      actor: "system:webhook",
      action: "notification.webhook_unmatched",
      entityType: "notification",
      entityId: input.eventId,
      summary: `Received unmatched ${input.eventType} webhook`,
      metadata: {
        provider: "resend",
        providerMessageId,
      },
    });
  }

  return {
    duplicate: false,
    event: webhookEvent ? mapNotificationWebhookEventRow(webhookEvent) : null,
    job: updatedJob,
  };
}

async function acquireJobLock(input: {
  name: string;
  owner: string;
  ttlMs: number;
}) {
  return withClient(async (client) => {
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + input.ttlMs).toISOString();

    await client.query("BEGIN");
    try {
      await client.query("DELETE FROM job_locks WHERE expires_at <= $1", [now]);
      const inserted = await client.query(
        `
          INSERT INTO job_locks (name, owner, expires_at, updated_at)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name) DO NOTHING
          RETURNING name
        `,
        [input.name, input.owner, expiresAt, now]
      );
      await client.query("COMMIT");
      return (inserted.rowCount ?? 0) > 0;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}

async function releaseJobLock(name: string, owner: string) {
  await getPool().query("DELETE FROM job_locks WHERE name = $1 AND owner = $2", [
    name,
    owner,
  ]);
}

export async function runNotificationDispatchCycle(input?: {
  limit?: number;
  actor?: string;
  owner?: string;
  lockTtlMs?: number;
}) {
  const limit = input?.limit ?? 20;
  const actor = input?.actor ?? "system:cron";
  const owner = input?.owner ?? randomUUID();
  const lockName = "notification_dispatch";
  const lockTtlMs = input?.lockTtlMs ?? 60_000;

  if (!(await acquireJobLock({ name: lockName, owner, ttlMs: lockTtlMs }))) {
    const health = await getNotificationQueueHealth();
    await recordAuditEvent(getPool(), {
      actor,
      action: "notification.dispatch_skipped",
      entityType: "notification",
      entityId: lockName,
      summary: "Skipped notification dispatch because another run is active",
      metadata: {
        owner,
      },
    });

    return {
      acquired: false,
      processed: [] as NotificationJob[],
      dueBefore: await countDueNotificationJobs(),
      dueAfter: await countDueNotificationJobs(),
      summary: await getNotificationSummary(),
      health,
    };
  }

  try {
    const dueBefore = await countDueNotificationJobs();
    const health = await getNotificationQueueHealth();

    if (health.providerConfigError && dueBefore > 0) {
      await recordAuditEvent(getPool(), {
        actor,
        action: "notification.dispatch_blocked",
        entityType: "notification",
        entityId: owner,
        summary: "Blocked notification dispatch because provider config is invalid",
        metadata: {
          dueBefore,
          deliveryMode: health.deliveryMode,
          providerConfigError: health.providerConfigError,
        },
      });

      return {
        acquired: true,
        blockedReason: health.providerConfigError,
        processed: [] as NotificationJob[],
        dueBefore,
        dueAfter: dueBefore,
        summary: await getNotificationSummary(),
        health,
      };
    }

    const processed = await dispatchQueuedNotificationJobs(limit, actor);
    const dueAfter = await countDueNotificationJobs();
    const summary = await getNotificationSummary();
    const nextHealth = await getNotificationQueueHealth();

    await recordAuditEvent(getPool(), {
      actor,
      action: "notification.dispatch_completed",
      entityType: "notification",
      entityId: owner,
      summary: `Processed ${processed.length} notification job(s)`,
      metadata: {
        dueBefore,
        dueAfter,
        processedCount: processed.length,
        limit,
      },
    });

    return {
      acquired: true,
      processed,
      dueBefore,
      dueAfter,
      summary,
      health: nextHealth,
    };
  } finally {
    await releaseJobLock(lockName, owner);
  }
}

export async function recordSessionAudit(
  action: "session.login" | "session.logout",
  actor = "admin"
) {
  await recordAuditEvent(getPool(), {
    actor,
    action,
    entityType: "session",
    entityId: actor,
    summary:
      action === "session.login" ? "Admin signed in" : "Admin signed out",
    metadata: {},
  });
}

export async function getPlatformSettings() {
  const rows = await queryRows(
    "SELECT key, value FROM app_settings ORDER BY key ASC"
  );
  const settings: PlatformSettings = {
    general: { ...DEFAULT_PLATFORM_SETTINGS.general },
    notifications: { ...DEFAULT_PLATFORM_SETTINGS.notifications },
    security: { ...DEFAULT_PLATFORM_SETTINGS.security },
  };

  rows.forEach((row) => {
    const key = String(row.key);
    const value = parseJsonObject(row.value);

    if (key === "general") {
      settings.general = {
        ...settings.general,
        ...value,
      };
      return;
    }

    if (key === "notifications") {
      settings.notifications = {
        ...settings.notifications,
        ...value,
      };
      return;
    }

    if (key === "security") {
      settings.security = {
        ...settings.security,
        ...value,
      };
    }
  });

  return settings;
}

export async function updatePlatformSettings<
  TSection extends keyof PlatformSettings,
>(section: TSection, value: PlatformSettings[TSection], actor = "admin") {
  const now = new Date().toISOString();

  await getPool().query(
    `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ($1, $2::jsonb, $3)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = EXCLUDED.updated_at
    `,
    [section, JSON.stringify(value), now]
  );

  await recordAuditEvent(getPool(), {
    actor,
    action: "settings.updated",
    entityType: "settings",
    entityId: section,
    summary: `Updated ${section} settings`,
    metadata: {
      section,
    },
  });

  return getPlatformSettings();
}

export async function listAdminUsers() {
  const rows = await queryRows(
    `
      SELECT
        id,
        username,
        display_name,
        email,
        role,
        status,
        ${getMfaEnabledSelect("")},
        last_login_at,
        created_at
      FROM admin_users
      ORDER BY
        CASE role
          WHEN 'owner' THEN 0
          WHEN 'manager' THEN 1
          ELSE 2
        END,
        created_at ASC
    `
  );

  return rows.map(mapAdminUserRow);
}

export async function createAdminUser(
  input: {
    username: string;
    displayName: string;
    email: string;
    role: AdminUser["role"];
    password: string;
  },
  actor = "admin"
) {
  const normalizedUsername = input.username.trim();
  const existing = await queryValue("SELECT id FROM admin_users WHERE username = $1", [
    normalizedUsername,
  ]);

  if (existing) {
    throw new Error("That username already exists.");
  }

  const settings = await getPlatformSettings();

  if (
    settings.security.requireStrongPasswords &&
    !isStrongPassword(input.password)
  ) {
    throw new Error(
      "Password must include uppercase, lowercase, number, and symbol characters."
    );
  }

  const now = new Date().toISOString();
  const user: AdminUser = {
    id: randomUUID(),
    username: normalizedUsername,
    displayName: input.displayName.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    status: "active",
    mfaEnabled: false,
    lastLoginAt: null,
    createdAt: now,
  };

  await getPool().query(
    `
      INSERT INTO admin_users (
        id, username, display_name, email, role, status, password_hash,
        last_login_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
    [
      user.id,
      user.username,
      user.displayName,
      user.email,
      user.role,
      user.status,
      hashPassword(input.password),
      null,
      now,
      now,
    ]
  );

  await recordAuditEvent(getPool(), {
    actor,
    action: "admin_user.created",
    entityType: "admin_user",
    entityId: user.id,
    summary: `Created ${user.role} user "${user.displayName}"`,
    metadata: {
      username: user.username,
      role: user.role,
    },
  });

  return user;
}

export async function updateAdminUser(
  id: string,
  input: {
    role?: AdminUser["role"];
    status?: AdminStatus;
  },
  actor = "admin"
) {
  const existing = await queryValue("SELECT * FROM admin_users WHERE id = $1", [id]);

  if (!existing) {
    return null;
  }

  const nextRole = input.role ?? (String(existing.role) as AdminUser["role"]);
  const nextStatus = input.status ?? (String(existing.status) as AdminStatus);
  const now = new Date().toISOString();

  await getPool().query(
    `
      UPDATE admin_users
      SET role = $1, status = $2, updated_at = $3
      WHERE id = $4
    `,
    [nextRole, nextStatus, now, id]
  );

  const updated = await queryValue(
    `
      SELECT
        id,
        username,
        display_name,
        email,
        role,
        status,
        ${getMfaEnabledSelect("")},
        last_login_at,
        created_at
      FROM admin_users
      WHERE id = $1
    `,
    [id]
  );

  await recordAuditEvent(getPool(), {
    actor,
    action: "admin_user.updated",
    entityType: "admin_user",
    entityId: id,
    summary: `Updated access for "${String(existing.display_name)}"`,
    metadata: {
      previousRole: String(existing.role),
      nextRole,
      previousStatus: String(existing.status),
      nextStatus,
    },
  });

  return updated ? mapAdminUserRow(updated) : null;
}

export async function verifyAdminCredentials(
  username: string,
  password: string
) {
  const row = await queryValue(
    `
      SELECT
        u.*,
        ${getMfaEnabledSelect()}
      FROM admin_users u
      WHERE u.username = $1
    `,
    [username.trim()]
  );

  if (!row || String(row.status) !== "active") {
    return null;
  }

  if (!verifyPassword(password, String(row.password_hash))) {
    return null;
  }

  return mapAdminUserRow(row);
}

export async function createAdminSession(userId: string, ttlMs: number) {
  const user = await queryValue(
    `
      SELECT
        u.id,
        u.username,
        u.display_name,
        u.email,
        u.role,
        u.status,
        ${getMfaEnabledSelect()},
        u.last_login_at,
        u.created_at
      FROM admin_users u
      WHERE u.id = $1
    `,
    [userId]
  );

  if (!user) {
    return null;
  }

  const sessionId = randomUUID();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  await getPool().query("DELETE FROM admin_sessions WHERE expires_at <= $1", [now]);
  await getPool().query(
    `
      INSERT INTO admin_sessions (
        id, user_id, expires_at, created_at, last_seen_at
      ) VALUES ($1, $2, $3, $4, $5)
    `,
    [sessionId, userId, expiresAt, now, now]
  );

  await getPool().query(
    "UPDATE admin_users SET last_login_at = $1, updated_at = $2 WHERE id = $3",
    [now, now, userId]
  );

  return {
    id: sessionId,
    expiresAt,
    user: {
      ...mapAdminUserRow(user),
      lastLoginAt: now,
    },
  } satisfies AdminSession;
}

export async function getAdminSessionById(sessionId: string) {
  const row = await queryValue(
    `
      SELECT
        s.id AS session_id,
        s.expires_at,
        s.created_at,
        s.last_seen_at,
        u.id,
        u.username,
        u.display_name,
        u.email,
        u.role,
        u.status,
        ${getMfaEnabledSelect()},
        u.last_login_at,
        u.created_at AS user_created_at
      FROM admin_sessions s
      INNER JOIN admin_users u ON u.id = s.user_id
      WHERE s.id = $1
    `,
    [sessionId]
  );

  if (!row) {
    return null;
  }

  const expiresAt = toTimestamp(row.expires_at);

  if (expiresAt <= new Date().toISOString()) {
    await getPool().query("DELETE FROM admin_sessions WHERE id = $1", [sessionId]);
    return null;
  }

  if (String(row.status) !== "active") {
    return null;
  }

  await getPool().query(
    "UPDATE admin_sessions SET last_seen_at = $1 WHERE id = $2",
    [new Date().toISOString(), sessionId]
  );

  return {
    id: String(row.session_id),
    expiresAt,
    createdAt: toTimestamp(row.created_at),
    lastSeenAt: toTimestamp(row.last_seen_at),
    user: mapAdminUserRow({
      ...row,
      created_at: row.user_created_at,
    }),
  } satisfies AdminSession;
}

export async function deleteAdminSession(sessionId: string) {
  await getPool().query("DELETE FROM admin_sessions WHERE id = $1", [sessionId]);
}

export async function listAdminSessions(input?: {
  userId?: string;
  currentSessionId?: string | null;
}) {
  const params: unknown[] = [new Date().toISOString()];
  let sql = `
    SELECT
      s.id AS session_id,
      s.expires_at,
      s.created_at,
      s.last_seen_at,
      u.id,
      u.username,
      u.display_name,
      u.email,
      u.role,
      u.status,
      ${getMfaEnabledSelect()},
      u.last_login_at,
      u.created_at AS user_created_at
    FROM admin_sessions s
    INNER JOIN admin_users u ON u.id = s.user_id
    WHERE s.expires_at > $1
  `;

  if (input?.userId) {
    params.push(input.userId);
    sql += ` AND s.user_id = $${params.length}`;
  }

  sql += " ORDER BY s.last_seen_at DESC, s.created_at DESC";

  const rows = await queryRows(sql, params);
  return rows.map((row) => ({
    ...mapAdminSessionRecordRow(row),
    isCurrent:
      input?.currentSessionId != null &&
      String(row.session_id) === input.currentSessionId,
  }));
}

export async function revokeAdminSession(
  sessionId: string,
  actor = "admin"
) {
  const existing = await queryValue(
    `
      SELECT
        s.id AS session_id,
        s.user_id,
        u.username
      FROM admin_sessions s
      INNER JOIN admin_users u ON u.id = s.user_id
      WHERE s.id = $1
    `,
    [sessionId]
  );

  if (!existing) {
    return false;
  }

  await getPool().query("DELETE FROM admin_sessions WHERE id = $1", [sessionId]);

  await recordAuditEvent(getPool(), {
    actor,
    action: "admin_session.revoked",
    entityType: "session",
    entityId: sessionId,
    summary: `Revoked admin session for ${String(existing.username)}`,
    metadata: {
      userId: String(existing.user_id),
      sessionId,
    },
  });

  return true;
}

export async function revokeAdminSessionsForUser(
  userId: string,
  actor = "admin",
  exceptSessionId?: string | null
) {
  const params: unknown[] = [userId];
  let sql = "DELETE FROM admin_sessions WHERE user_id = $1";

  if (exceptSessionId) {
    params.push(exceptSessionId);
    sql += ` AND id != $${params.length}`;
  }

  const result = await getPool().query(sql, params);
  const count = Number(result.rowCount ?? 0);

  if (count > 0) {
    await recordAuditEvent(getPool(), {
      actor,
      action: "admin_session.bulk_revoked",
      entityType: "session",
      entityId: userId,
      summary: `Revoked ${count} session(s) for admin user`,
      metadata: {
        userId,
        exceptSessionId: exceptSessionId ?? null,
        revokedCount: count,
      },
    });
  }

  return count;
}

export async function getAdminMfaStatus(userId: string) {
  const row = await queryValue(
    `
      SELECT
        pending,
        enabled_at,
        recovery_codes
      FROM admin_mfa_credentials
      WHERE user_id = $1
    `,
    [userId]
  );

  if (!row) {
    return getDefaultMfaStatus();
  }

  const recoveryCodes = parseJsonArray(row.recovery_codes);
  const pending = Boolean(row.pending);

  return {
    enabled: !pending && Boolean(row.enabled_at),
    pending,
    enabledAt: toOptionalTimestamp(row.enabled_at),
    recoveryCodesRemaining: recoveryCodes.length,
  } satisfies AdminMfaStatus;
}

export async function beginAdminMfaEnrollment(
  userId: string,
  actor = "admin"
) {
  const user = await queryValue(
    "SELECT id, username, email FROM admin_users WHERE id = $1",
    [userId]
  );

  if (!user) {
    throw new Error("Admin user not found.");
  }

  const now = new Date().toISOString();
  const secret = generateTotpSecret();
  const recoveryCodes = generateRecoveryCodes();

  await getPool().query(
    `
      INSERT INTO admin_mfa_credentials (
        user_id, secret, recovery_codes, pending, created_at, updated_at, enabled_at
      ) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        secret = EXCLUDED.secret,
        recovery_codes = EXCLUDED.recovery_codes,
        pending = EXCLUDED.pending,
        updated_at = EXCLUDED.updated_at,
        enabled_at = EXCLUDED.enabled_at
    `,
    [
      userId,
      secret,
      JSON.stringify(recoveryCodes.map((code) => hashRecoveryCode(code))),
      true,
      now,
      now,
      null,
    ]
  );

  await recordAuditEvent(getPool(), {
    actor,
    action: "admin_mfa.enrollment_started",
    entityType: "security",
    entityId: userId,
    summary: `Started MFA enrollment for ${String(user.username)}`,
    metadata: {
      userId,
    },
  });

  return {
    secret,
    formattedSecret: formatTotpSecret(secret),
    provisioningUri: createTotpProvisioningUri({
      accountName: String(user.email),
      issuer: "S-Tech Studios",
      secret,
    }),
    recoveryCodes,
  };
}

export async function confirmAdminMfaEnrollment(
  userId: string,
  code: string,
  actor = "admin"
) {
  const row = await queryValue(
    `
      SELECT secret, pending
      FROM admin_mfa_credentials
      WHERE user_id = $1
    `,
    [userId]
  );

  if (!row || !row.pending) {
    throw new Error("No pending MFA enrollment was found.");
  }

  if (!verifyTotpCode({ secret: String(row.secret), code })) {
    throw new Error("Invalid authentication code.");
  }

  const now = new Date().toISOString();
  await getPool().query(
    `
      UPDATE admin_mfa_credentials
      SET pending = FALSE,
          enabled_at = $1,
          updated_at = $2
      WHERE user_id = $3
    `,
    [now, now, userId]
  );

  await recordAuditEvent(getPool(), {
    actor,
    action: "admin_mfa.enabled",
    entityType: "security",
    entityId: userId,
    summary: "Enabled MFA for admin user",
    metadata: {
      userId,
    },
  });

  return getAdminMfaStatus(userId);
}

export async function disableAdminMfa(userId: string, actor = "admin") {
  const existing = await queryValue(
    "SELECT user_id FROM admin_mfa_credentials WHERE user_id = $1",
    [userId]
  );

  if (!existing) {
    return false;
  }

  await getPool().query("DELETE FROM admin_mfa_credentials WHERE user_id = $1", [
    userId,
  ]);
  await getPool().query("DELETE FROM admin_mfa_challenges WHERE user_id = $1", [
    userId,
  ]);

  await recordAuditEvent(getPool(), {
    actor,
    action: "admin_mfa.disabled",
    entityType: "security",
    entityId: userId,
    summary: "Disabled MFA for admin user",
    metadata: {
      userId,
    },
  });

  return true;
}

export async function createAdminMfaChallenge(userId: string) {
  const user = await queryValue(
    "SELECT id FROM admin_users WHERE id = $1 AND status = 'active'",
    [userId]
  );

  if (!user) {
    return null;
  }

  const credential = await queryValue(
    `
      SELECT user_id
      FROM admin_mfa_credentials
      WHERE user_id = $1
        AND pending = FALSE
        AND enabled_at IS NOT NULL
    `,
    [userId]
  );

  if (!credential) {
    return null;
  }

  const challenge = createMfaChallengeRecord({
    userId,
    expiresInMs: 10 * 60 * 1000,
  });

  await getPool().query(
    `
      DELETE FROM admin_mfa_challenges
      WHERE user_id = $1
         OR expires_at <= $2
    `,
    [userId, new Date().toISOString()]
  );

  await getPool().query(
    `
      INSERT INTO admin_mfa_challenges (
        id, user_id, expires_at, created_at, completed_at
      ) VALUES ($1, $2, $3, $4, $5)
    `,
    [challenge.id, challenge.userId, challenge.expiresAt, challenge.createdAt, null]
  );

  return challenge;
}

export async function verifyAdminMfaChallenge(
  challengeId: string,
  code: string
) {
  const row = await queryValue(
    `
      SELECT
        c.id AS challenge_id,
        c.user_id,
        c.expires_at,
        c.completed_at,
        m.secret,
        m.recovery_codes,
        u.id,
        u.username,
        u.display_name,
        u.email,
        u.role,
        u.status,
        ${getMfaEnabledSelect()},
        u.last_login_at,
        u.created_at
      FROM admin_mfa_challenges c
      INNER JOIN admin_mfa_credentials m ON m.user_id = c.user_id
      INNER JOIN admin_users u ON u.id = c.user_id
      WHERE c.id = $1
    `,
    [challengeId]
  );

  if (!row || row.completed_at) {
    return null;
  }

  if (toTimestamp(row.expires_at) <= new Date().toISOString()) {
    await getPool().query("DELETE FROM admin_mfa_challenges WHERE id = $1", [
      challengeId,
    ]);
    return null;
  }

  const recoveryCodes = parseJsonArray(row.recovery_codes);
  const totpValid = verifyTotpCode({
    secret: String(row.secret),
    code,
  });
  const recoveryValid =
    !totpValid &&
    verifyRecoveryCode({
      recoveryCode: code,
      hashedRecoveryCodes: recoveryCodes,
    });

  if (!totpValid && !recoveryValid) {
    return null;
  }

  const now = new Date().toISOString();
  await getPool().query(
    "UPDATE admin_mfa_challenges SET completed_at = $1 WHERE id = $2",
    [now, challengeId]
  );

  if (recoveryValid) {
    const remainingCodes = consumeRecoveryCode({
      recoveryCode: code,
      hashedRecoveryCodes: recoveryCodes,
    });
    await getPool().query(
      `
        UPDATE admin_mfa_credentials
        SET recovery_codes = $1::jsonb, updated_at = $2
        WHERE user_id = $3
      `,
      [JSON.stringify(remainingCodes), now, String(row.user_id)]
    );
  }

  return mapAdminUserRow(row);
}

export async function requestAdminPasswordReset(
  identifier: string,
  actor = "public"
) {
  const normalized = identifier.trim().toLowerCase();
  const user = await queryValue(
    `
      SELECT
        id,
        username,
        email,
        display_name
      FROM admin_users
      WHERE lower(username) = $1
         OR lower(email) = $1
    `,
    [normalized]
  );

  if (!user) {
    return false;
  }

  const record = createPasswordResetRecord({
    userId: String(user.id),
    expiresInMs: 60 * 60 * 1000,
    requestedBy: actor,
    metadata: {
      username: String(user.username),
    },
  });

  await getPool().query(
    `
      DELETE FROM admin_password_reset_tokens
      WHERE user_id = $1
         OR expires_at <= $2
         OR consumed_at IS NOT NULL
    `,
    [user.id, new Date().toISOString()]
  );

  await getPool().query(
    `
      INSERT INTO admin_password_reset_tokens (
        id, user_id, token_hash, expires_at, created_at, consumed_at, requested_by, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
    `,
    [
      record.id,
      record.userId,
      record.tokenHash,
      record.expiresAt,
      record.createdAt,
      null,
      record.requestedBy,
      JSON.stringify(record.metadata),
    ]
  );

  const resetLink = `${getSiteUrl()}/login/reset?token=${encodeURIComponent(record.token)}`;
  const settings = await getPlatformSettings();
  await createNotificationJob({
    kind: "admin.password_reset",
    recipient: String(user.email).toLowerCase(),
    subject: "Reset your S-Tech admin password",
    body: [
      `Hi ${String(user.display_name)},`,
      "",
      "A request was made to reset your S-Tech admin password.",
      `Reset link: ${resetLink}`,
      "",
      "This link expires in 60 minutes. If you did not request it, you can ignore this email.",
    ].join("\n"),
    provider: settings.notifications.deliveryMode,
    entityType: "settings",
    entityId: String(user.id),
    metadata: {
      userId: String(user.id),
      resetRequestId: record.id,
    },
  });

  if (
    settings.notifications.autoDispatchInquiryEmails &&
    settings.notifications.deliveryMode !== "disabled"
  ) {
    await runNotificationDispatchCycle({
      limit: 10,
      actor: "system:auto",
    });
  }

  await recordAuditEvent(getPool(), {
    actor,
    action: "admin_password_reset.requested",
    entityType: "security",
    entityId: String(user.id),
    summary: `Requested password reset for ${String(user.username)}`,
    metadata: {
      userId: String(user.id),
      deliveryEmail: String(user.email).toLowerCase(),
    },
  });

  return resetLink;
}

export async function resetAdminPassword(
  token: string,
  newPassword: string,
  actor = "public"
) {
  const tokenHash = hashOpaqueToken(token);
  const row = await queryValue(
    `
      SELECT
        t.*,
        u.username,
        u.id AS user_id,
        u.display_name,
        u.email,
        u.role,
        u.status,
        ${getMfaEnabledSelect("u")},
        u.last_login_at,
        u.created_at
      FROM admin_password_reset_tokens t
      INNER JOIN admin_users u ON u.id = t.user_id
      WHERE t.token_hash = $1
    `,
    [tokenHash]
  );

  if (
    !row ||
    row.consumed_at ||
    toTimestamp(row.expires_at) <= new Date().toISOString()
  ) {
    throw new Error("That password reset link is invalid or has expired.");
  }

  const settings = await getPlatformSettings();
  if (
    settings.security.requireStrongPasswords &&
    !isStrongPassword(newPassword)
  ) {
    throw new Error(
      "Password must include uppercase, lowercase, number, and symbol characters."
    );
  }

  const now = new Date().toISOString();
  await getPool().query(
    `
      UPDATE admin_users
      SET password_hash = $1, updated_at = $2
      WHERE id = $3
    `,
    [hashPassword(newPassword), now, String(row.user_id)]
  );

  await getPool().query(
    `
      UPDATE admin_password_reset_tokens
      SET consumed_at = $1
      WHERE id = $2
    `,
    [now, String(row.id)]
  );

  await revokeAdminSessionsForUser(String(row.user_id), actor);

  await recordAuditEvent(getPool(), {
    actor,
    action: "admin_password_reset.completed",
    entityType: "security",
    entityId: String(row.user_id),
    summary: `Reset password for ${String(row.username)}`,
    metadata: {
      userId: String(row.user_id),
      resetRequestId: String(row.id),
    },
  });

  return mapAdminUserRow(row);
}

export async function getAdminPasswordResetRequest(token: string) {
  const tokenHash = hashOpaqueToken(token);
  const row = await queryValue(
    `
      SELECT *
      FROM admin_password_reset_tokens
      WHERE token_hash = $1
    `,
    [tokenHash]
  );

  if (!row) {
    return null;
  }

  if (row.consumed_at || toTimestamp(row.expires_at) <= new Date().toISOString()) {
    return null;
  }

  return mapPasswordResetRequestRow(row);
}
