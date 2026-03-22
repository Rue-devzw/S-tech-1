import "server-only";

import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import {
  type AdminMfaStatus,
  type AdminPasswordResetRequest,
  type AdminSession,
  type AdminStatus,
  type AdminUser,
} from "@/lib/admin-user";
import {
  type AnalyticsEvent,
  type AnalyticsOverview,
} from "@/lib/analytics";
import { type AuditEvent } from "@/lib/audit";
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
  createMfaChallengeRecord,
  createPasswordResetRecord,
  createTotpProvisioningUri,
  formatTotpSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashOpaqueToken,
  hashPassword,
  isStrongPassword,
  verifyPassword,
  verifyRecoveryCode,
  verifyTotpCode,
  consumeRecoveryCode,
  hashRecoveryCode,
} from "@/lib/server/admin-identity";
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
import {
  getAdminDisplayName,
  getAdminPassword,
  getAdminUsername,
  getNotificationDeliveryConfigError,
  getNotificationWebhookConfigError,
  getSiteUrl,
  getSqliteDbPath,
} from "@/lib/env";

type StatementResult = {
  changes?: number;
  lastInsertRowid?: number | bigint;
};

type Statement = {
  run: (...params: unknown[]) => StatementResult;
  get: (...params: unknown[]) => Record<string, unknown> | undefined;
  all: (...params: unknown[]) => Array<Record<string, unknown>>;
};

type Database = {
  exec: (sql: string) => void;
  prepare: (sql: string) => Statement;
};

const require = createRequire(import.meta.url);
const DATA_DIR = path.join(process.cwd(), ".data");
const legacyListingsPath = path.join(DATA_DIR, "listings.json");
const legacyInquiriesPath = path.join(DATA_DIR, "inquiries.json");

declare global {
  var __sTechDatabase: Database | undefined;
  var __sTechDatabaseReady: boolean | undefined;
}

function getDatabase() {
  if (!globalThis.__sTechDatabase) {
    const sqlitePath = path.join(process.cwd(), getSqliteDbPath());
    mkdirSync(path.dirname(sqlitePath), { recursive: true });

    const sqliteModule = require("node:sqlite") as {
      DatabaseSync: new (path: string) => Database;
    };

    globalThis.__sTechDatabase = new sqliteModule.DatabaseSync(sqlitePath);
  }

  if (!globalThis.__sTechDatabaseReady) {
    initializeDatabase(globalThis.__sTechDatabase);
    globalThis.__sTechDatabaseReady = true;
  }

  return globalThis.__sTechDatabase;
}

function initializeDatabase(database: Database) {
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = OFF;

    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      client TEXT NOT NULL,
      industry TEXT NOT NULL,
      delivery_timeline TEXT NOT NULL,
      support_window TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      technologies TEXT NOT NULL,
      features TEXT NOT NULL,
      outcomes TEXT NOT NULL,
      image_url TEXT NOT NULL,
      preview_url TEXT,
      rating REAL NOT NULL DEFAULT 0,
      sales_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL,
      listing_name TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'responded', 'closed')),
      date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      metadata TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'support')),
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
      password_hash TEXT NOT NULL,
      last_login_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      consumed_at TEXT,
      requested_by TEXT NOT NULL,
      metadata TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_mfa_credentials (
      user_id TEXT PRIMARY KEY,
      secret TEXT NOT NULL,
      recovery_codes TEXT NOT NULL,
      pending INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      enabled_at TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_mfa_challenges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS notification_jobs (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      channel TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
      provider TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      next_attempt_at TEXT,
      provider_message_id TEXT,
      delivery_state TEXT NOT NULL DEFAULT 'queued',
      last_event_type TEXT,
      last_webhook_at TEXT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      metadata TEXT NOT NULL,
      created_at TEXT NOT NULL,
      processed_at TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS job_locks (
      name TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notification_webhook_events (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      event_id TEXT NOT NULL UNIQUE,
      event_type TEXT NOT NULL,
      notification_job_id TEXT,
      provider_message_id TEXT,
      payload TEXT NOT NULL,
      received_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS request_events (
      id TEXT PRIMARY KEY,
      route TEXT NOT NULL,
      fingerprint TEXT NOT NULL,
      subject TEXT,
      event_type TEXT NOT NULL,
      metadata TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      route TEXT NOT NULL,
      fingerprint TEXT NOT NULL,
      subject TEXT,
      event_type TEXT NOT NULL,
      metadata TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
      ON inquiries (created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_audit_events_created_at
      ON audit_events (created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at
      ON admin_sessions (expires_at DESC);

    CREATE INDEX IF NOT EXISTS idx_admin_password_reset_tokens_user_id
      ON admin_password_reset_tokens (user_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_admin_password_reset_tokens_expires_at
      ON admin_password_reset_tokens (expires_at DESC);

    CREATE INDEX IF NOT EXISTS idx_admin_mfa_challenges_user_id
      ON admin_mfa_challenges (user_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_admin_mfa_challenges_expires_at
      ON admin_mfa_challenges (expires_at DESC);

    CREATE INDEX IF NOT EXISTS idx_notification_jobs_status
      ON notification_jobs (status, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_request_events_route_fingerprint
      ON request_events (route, fingerprint, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_request_events_route_subject
      ON request_events (route, subject, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
      ON analytics_events (created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
      ON analytics_events (event_type, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_analytics_events_subject
      ON analytics_events (subject, created_at DESC);
  `);

  seedListings(database);
  seedInquiries(database);
  seedSettings(database);
  seedAdminUsers(database);
  migrateNotificationJobsTable(database);
  migrateNotificationWebhookEventsTable(database);
}

function getColumnNames(database: Database, tableName: string) {
  return database
    .prepare(`PRAGMA table_info(${tableName})`)
    .all()
    .map((column) => String(column.name));
}

function ensureColumn(
  database: Database,
  tableName: string,
  columnName: string,
  definition: string
) {
  const columns = getColumnNames(database, tableName);
  if (columns.includes(columnName)) {
    return;
  }

  database.exec(
    `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`
  );
}

function migrateNotificationJobsTable(database: Database) {
  ensureColumn(database, "notification_jobs", "next_attempt_at", "TEXT");
  ensureColumn(database, "notification_jobs", "provider_message_id", "TEXT");
  ensureColumn(
    database,
    "notification_jobs",
    "delivery_state",
    "TEXT NOT NULL DEFAULT 'queued'"
  );
  ensureColumn(database, "notification_jobs", "last_event_type", "TEXT");
  ensureColumn(database, "notification_jobs", "last_webhook_at", "TEXT");
}

function migrateNotificationWebhookEventsTable(database: Database) {
  ensureColumn(
    database,
    "notification_webhook_events",
    "notification_job_id",
    "TEXT"
  );
  ensureColumn(
    database,
    "notification_webhook_events",
    "provider_message_id",
    "TEXT"
  );
}

function readLegacyJson<T>(filePath: string, fallback: T): T {
  try {
    const raw = readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function seedListings(database: Database) {
  const row = database.prepare("SELECT COUNT(*) as count FROM listings").get();
  const count = Number(row?.count ?? 0);

  if (count > 0) {
    return;
  }

  const listings = readLegacyJson<Listing[]>(legacyListingsPath, LISTINGS);
  const insert = database.prepare(`
    INSERT INTO listings (
      id, slug, name, category, price, short_description, description, client,
      industry, delivery_timeline, support_window, featured, technologies,
      features, outcomes, image_url, preview_url, rating, sales_count,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const baseTime = Date.now();
  listings.forEach((listing, index) => {
    const timestamp = new Date(baseTime + index).toISOString();
    insert.run(
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
      listing.featured ? 1 : 0,
      JSON.stringify(listing.technologies),
      JSON.stringify(listing.features),
      JSON.stringify(listing.outcomes),
      listing.imageUrl,
      listing.previewUrl ?? "",
      listing.rating,
      listing.salesCount,
      timestamp,
      timestamp
    );
  });
}

function seedInquiries(database: Database) {
  const row = database.prepare("SELECT COUNT(*) as count FROM inquiries").get();
  const count = Number(row?.count ?? 0);

  if (count > 0) {
    return;
  }

  const inquiries = readLegacyJson<Inquiry[]>(legacyInquiriesPath, INQUIRIES);
  const insert = database.prepare(`
    INSERT INTO inquiries (
      id, listing_id, listing_name, user_name, user_email, message,
      status, date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const baseTime = Date.now();
  inquiries.forEach((inquiry, index) => {
    const timestamp = new Date(baseTime + index).toISOString();
    insert.run(
      inquiry.id,
      inquiry.listingId,
      inquiry.listingName,
      inquiry.userName,
      inquiry.userEmail,
      inquiry.message,
      inquiry.status,
      inquiry.date,
      timestamp,
      timestamp
    );
  });
}

function seedSettings(database: Database) {
  const row = database
    .prepare("SELECT COUNT(*) as count FROM app_settings")
    .get();
  const count = Number(row?.count ?? 0);

  if (count > 0) {
    return;
  }

  const now = new Date().toISOString();
  const insert = database.prepare(`
    INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, ?)
  `);

  insert.run("general", JSON.stringify(DEFAULT_PLATFORM_SETTINGS.general), now);
  insert.run(
    "notifications",
    JSON.stringify(DEFAULT_PLATFORM_SETTINGS.notifications),
    now
  );
  insert.run(
    "security",
    JSON.stringify(DEFAULT_PLATFORM_SETTINGS.security),
    now
  );
}

function seedAdminUsers(database: Database) {
  const row = database
    .prepare("SELECT COUNT(*) as count FROM admin_users")
    .get();
  const count = Number(row?.count ?? 0);

  if (count > 0) {
    return;
  }

  const now = new Date().toISOString();
  database
    .prepare(
      `
        INSERT INTO admin_users (
          id, username, display_name, email, role, status, password_hash,
          last_login_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      randomUUID(),
      getAdminUsername(),
      getAdminDisplayName(),
      `${getAdminUsername()}@s-tech.local`,
      "owner",
      "active",
      hashPassword(getAdminPassword()),
      null,
      now,
      now
    );
}

function parseJsonArray(value: unknown): string[] {
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

function mapListingRow(row: Record<string, unknown>): Listing {
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
    featured: Number(row.featured) === 1,
    technologies: parseJsonArray(row.technologies),
    features: parseJsonArray(row.features),
    outcomes: parseJsonArray(row.outcomes),
    imageUrl: String(row.image_url),
    previewUrl: row.preview_url ? String(row.preview_url) : "",
    rating: Number(row.rating),
    salesCount: Number(row.sales_count),
  };
}

function mapInquiryRow(row: Record<string, unknown>): Inquiry {
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

function mapAuditRow(row: Record<string, unknown>): AuditEvent {
  return {
    id: String(row.id),
    actor: String(row.actor),
    action: String(row.action),
    entityType: String(row.entity_type) as AuditEvent["entityType"],
    entityId: String(row.entity_id),
    summary: String(row.summary),
    metadata: parseJsonObject(row.metadata),
    createdAt: String(row.created_at),
  };
}

function mapAnalyticsEventRow(row: Record<string, unknown>): AnalyticsEvent {
  return {
    id: String(row.id),
    route: String(row.route),
    fingerprint: String(row.fingerprint),
    subject: row.subject ? String(row.subject) : null,
    eventType: String(row.event_type) as AnalyticsEvent["eventType"],
    metadata: parseJsonObject(row.metadata),
    createdAt: String(row.created_at),
  };
}

function mapNotificationJobRow(row: Record<string, unknown>): NotificationJob {
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
    nextAttemptAt: row.next_attempt_at ? String(row.next_attempt_at) : null,
    providerMessageId: row.provider_message_id
      ? String(row.provider_message_id)
      : null,
    deliveryState: row.delivery_state
      ? (String(row.delivery_state) as NotificationDeliveryState)
      : "queued",
    lastEventType: row.last_event_type ? String(row.last_event_type) : null,
    lastWebhookAt: row.last_webhook_at ? String(row.last_webhook_at) : null,
    entityType: String(row.entity_type) as NotificationJob["entityType"],
    entityId: String(row.entity_id),
    metadata: parseJsonObject(row.metadata),
    createdAt: String(row.created_at),
    processedAt: row.processed_at ? String(row.processed_at) : null,
    updatedAt: String(row.updated_at),
  };
}

function mapNotificationWebhookEventRow(
  row: Record<string, unknown>
): NotificationWebhookEvent {
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
    receivedAt: String(row.received_at),
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

function mapAdminUserRow(row: Record<string, unknown>): AdminUser {
  return {
    id: String(row.id),
    username: String(row.username),
    displayName: String(row.display_name),
    email: String(row.email),
    role: String(row.role) as AdminUser["role"],
    status: String(row.status) as AdminStatus,
    mfaEnabled:
      typeof row.mfa_enabled === "boolean"
        ? row.mfa_enabled
        : Number(row.mfa_enabled ?? 0) === 1,
    lastLoginAt: row.last_login_at ? String(row.last_login_at) : null,
    createdAt: String(row.created_at),
  };
}

function mapPasswordResetRequestRow(
  row: Record<string, unknown>
): AdminPasswordResetRequest {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    expiresAt: String(row.expires_at),
    createdAt: String(row.created_at),
    consumedAt: row.consumed_at ? String(row.consumed_at) : null,
    requestedBy: String(row.requested_by),
  };
}

function recordAuditEvent(
  database: Database,
  event: Omit<AuditEvent, "id" | "createdAt">
) {
  const now = new Date().toISOString();
  database
    .prepare(
      `
        INSERT INTO audit_events (
          id, actor, action, entity_type, entity_id, summary, metadata, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      randomUUID(),
      event.actor,
      event.action,
      event.entityType,
      event.entityId,
      event.summary,
      JSON.stringify(event.metadata),
      now
    );
}

function pruneRequestEvents(database: Database) {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  database
    .prepare("DELETE FROM request_events WHERE created_at < ?")
    .run(cutoff);
}

function pruneAnalyticsEvents(database: Database) {
  const cutoff = new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toISOString();
  database
    .prepare("DELETE FROM analytics_events WHERE created_at < ?")
    .run(cutoff);
}

function normalizeInquiryMessage(message: string) {
  return message.trim().replace(/\s+/g, " ").toLowerCase();
}

function getMfaEnabledSelect(prefix = "u") {
  const userIdReference = prefix ? `${prefix}.id` : "id";
  return `
    EXISTS (
      SELECT 1
      FROM admin_mfa_credentials m
      WHERE m.user_id = ${userIdReference}
        AND m.pending = 0
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

export async function getListings() {
  const database = getDatabase();
  const rows = database
    .prepare(
      `
        SELECT * FROM listings
        ORDER BY featured DESC, sales_count DESC, created_at ASC
      `
    )
    .all();
  return rows.map(mapListingRow);
}

export async function getListingById(id: string) {
  const database = getDatabase();
  const row = database.prepare("SELECT * FROM listings WHERE id = ?").get(id);
  return row ? mapListingRow(row) : null;
}

export async function upsertListing(listing: Listing, actor = "admin") {
  const database = getDatabase();
  const existing = database
    .prepare("SELECT created_at FROM listings WHERE id = ?")
    .get(listing.id);
  const now = new Date().toISOString();
  const createdAt = existing?.created_at ? String(existing.created_at) : now;

  database
    .prepare(
      `
        INSERT OR REPLACE INTO listings (
          id, slug, name, category, price, short_description, description, client,
          industry, delivery_timeline, support_window, featured, technologies,
          features, outcomes, image_url, preview_url, rating, sales_count,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
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
      listing.featured ? 1 : 0,
      JSON.stringify(listing.technologies),
      JSON.stringify(listing.features),
      JSON.stringify(listing.outcomes),
      listing.imageUrl,
      listing.previewUrl ?? "",
      listing.rating,
      listing.salesCount,
      createdAt,
      now
    );

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const existing = database
    .prepare("SELECT * FROM listings WHERE id = ?")
    .get(id);

  if (!existing) {
    return false;
  }

  database.prepare("DELETE FROM listings WHERE id = ?").run(id);

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const rows = database
    .prepare(
      `
        SELECT * FROM inquiries
        ORDER BY created_at DESC
      `
    )
    .all();
  return rows.map(mapInquiryRow);
}

export async function createInquiry(
  input: Omit<Inquiry, "id" | "status" | "date">,
  actor = "public"
) {
  const database = getDatabase();
  const inquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    listingId: input.listingId,
    listingName: input.listingName,
    userName: input.userName.trim(),
    userEmail: input.userEmail.trim().toLowerCase(),
    message: input.message.trim(),
    status: "pending",
    date: new Date().toISOString().slice(0, 10),
  };
  const now = new Date().toISOString();

  database
    .prepare(
      `
        INSERT INTO inquiries (
          id, listing_id, listing_name, user_name, user_email, message,
          status, date, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      inquiry.id,
      inquiry.listingId,
      inquiry.listingName,
      inquiry.userName,
      inquiry.userEmail,
      inquiry.message,
      inquiry.status,
      inquiry.date,
      now,
      now
    );

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const existing = database
    .prepare("SELECT * FROM inquiries WHERE id = ?")
    .get(id);

  if (!existing) {
    return null;
  }

  const updatedAt = new Date().toISOString();
  database
    .prepare("UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, updatedAt, id);

  const updated = database
    .prepare("SELECT * FROM inquiries WHERE id = ?")
    .get(id);

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const rows = database
    .prepare(
      `
        SELECT * FROM audit_events
        ORDER BY created_at DESC
        LIMIT ?
      `
    )
    .all(limit);
  return rows.map(mapAuditRow);
}

export async function recordRequestEvent(input: {
  route: string;
  fingerprint: string;
  eventType: string;
  subject?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const database = getDatabase();
  const now = new Date().toISOString();

  pruneRequestEvents(database);
  database
    .prepare(
      `
        INSERT INTO request_events (
          id, route, fingerprint, subject, event_type, metadata, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      randomUUID(),
      input.route,
      input.fingerprint,
      input.subject ?? null,
      input.eventType,
      JSON.stringify(input.metadata ?? {}),
      now
    );
}

export async function countRecentRequestEvents(input: {
  route: string;
  windowMs: number;
  eventType: string;
  fingerprint?: string;
  subject?: string;
}) {
  const database = getDatabase();
  const since = new Date(Date.now() - input.windowMs).toISOString();

  let sql = `
    SELECT COUNT(*) as count
    FROM request_events
    WHERE route = ?
      AND event_type = ?
      AND created_at >= ?
  `;
  const params: unknown[] = [input.route, input.eventType, since];

  if (input.fingerprint) {
    sql += " AND fingerprint = ?";
    params.push(input.fingerprint);
  }

  if (input.subject) {
    sql += " AND subject = ?";
    params.push(input.subject);
  }

  const row = database.prepare(sql).get(...params);
  return Number(row?.count ?? 0);
}

export async function recordAnalyticsEvent(input: {
  route: string;
  fingerprint: string;
  eventType: AnalyticsEvent["eventType"];
  subject?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const database = getDatabase();
  const now = new Date().toISOString();

  pruneAnalyticsEvents(database);
  database
    .prepare(
      `
        INSERT INTO analytics_events (
          id, route, fingerprint, subject, event_type, metadata, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      randomUUID(),
      input.route,
      input.fingerprint,
      input.subject ?? null,
      input.eventType,
      JSON.stringify(input.metadata ?? {}),
      now
    );
}

export async function getAnalyticsOverview(windowDays = 30): Promise<AnalyticsOverview> {
  const database = getDatabase();
  const analyticsSince = new Date(
    Date.now() - 180 * 24 * 60 * 60 * 1000
  ).toISOString();
  const events = database
    .prepare(
      `
        SELECT * FROM analytics_events
        WHERE created_at >= ?
        ORDER BY created_at ASC
      `
    )
    .all(analyticsSince)
    .map(mapAnalyticsEventRow);
  const inquiries = database
    .prepare(
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
        WHERE i.created_at >= ?
        ORDER BY i.created_at ASC
      `
    )
    .all(analyticsSince)
    .map((row) => ({
      inquiryId: String(row.inquiry_id),
      listingId: String(row.listing_id),
      listingName: String(row.listing_name),
      category: String(row.category),
      price: Number(row.price),
      createdAt: String(row.created_at),
    }));
  const listings = await getListings();

  return buildAnalyticsOverview({
    events,
    inquiries,
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
  const database = getDatabase();

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const since = new Date(Date.now() - input.windowMs).toISOString();
  const rows = database
    .prepare(
      `
        SELECT message
        FROM inquiries
        WHERE listing_id = ?
          AND user_email = ?
          AND created_at >= ?
        ORDER BY created_at DESC
        LIMIT 10
      `
    )
    .all(input.listingId, input.userEmail.trim().toLowerCase(), since);

  const normalizedIncoming = normalizeInquiryMessage(input.message);
  return rows.some(
    (row) => normalizeInquiryMessage(String(row.message)) === normalizedIncoming
  );
}

export async function getNotificationJobs(limit = 25) {
  const database = getDatabase();
  const rows = database
    .prepare(
      `
        SELECT * FROM notification_jobs
        ORDER BY created_at DESC
        LIMIT ?
      `
    )
    .all(limit);

  return rows.map(mapNotificationJobRow);
}

export async function getNotificationSummary(): Promise<NotificationSummary> {
  const database = getDatabase();
  const rows = database
    .prepare(
      `
        SELECT status, COUNT(*) as count
        FROM notification_jobs
        GROUP BY status
      `
    )
    .all();

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
  const database = getDatabase();
  const settings = await getPlatformSettings();
  const deliveryMode = settings.notifications.deliveryMode;
  const providerConfigError = getNotificationDeliveryConfigError(deliveryMode);
  const webhookConfigError = getNotificationWebhookConfigError(deliveryMode);
  const now = new Date().toISOString();

  const dueRow = database
    .prepare(
      `
        SELECT COUNT(*) as count
        FROM notification_jobs
        WHERE status = 'queued'
          AND (next_attempt_at IS NULL OR next_attempt_at <= ?)
      `
    )
    .get(now);
  const retryRow = database
    .prepare(
      `
        SELECT COUNT(*) as count
        FROM notification_jobs
        WHERE status = 'queued'
          AND attempts > 0
          AND next_attempt_at > ?
      `
    )
    .get(now);
  const failedRow = database
    .prepare(
      `
        SELECT COUNT(*) as count
        FROM notification_jobs
        WHERE status = 'failed'
      `
    )
    .get();
  const oldestDueRow = database
    .prepare(
      `
        SELECT created_at
        FROM notification_jobs
        WHERE status = 'queued'
          AND (next_attempt_at IS NULL OR next_attempt_at <= ?)
        ORDER BY created_at ASC
        LIMIT 1
      `
    )
    .get(now);
  const oldestFailureRow = database
    .prepare(
      `
        SELECT updated_at
        FROM notification_jobs
        WHERE status = 'failed'
        ORDER BY updated_at ASC
        LIMIT 1
      `
    )
    .get();
  const lockRow = database
    .prepare(
      `
        SELECT expires_at
        FROM job_locks
        WHERE name = ?
          AND expires_at > ?
      `
    )
    .get("notification_dispatch", now);
  const lastDispatchCompletedRow = database
    .prepare(
      `
        SELECT created_at, metadata
        FROM audit_events
        WHERE action = 'notification.dispatch_completed'
        ORDER BY created_at DESC
        LIMIT 1
      `
    )
    .get();
  const lastDispatchAttemptRow = database
    .prepare(
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
    )
    .get();
  const lastWebhookRow = database
    .prepare(
      `
        SELECT received_at
        FROM notification_webhook_events
        ORDER BY received_at DESC
        LIMIT 1
      `
    )
    .get();
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
    oldestDueCreatedAt: oldestDueRow?.created_at
      ? String(oldestDueRow.created_at)
      : null,
    oldestFailureAt: oldestFailureRow?.updated_at
      ? String(oldestFailureRow.updated_at)
      : null,
    lockActive: Boolean(lockRow),
    lastDispatchCompletedAt: lastDispatchCompletedRow?.created_at
      ? String(lastDispatchCompletedRow.created_at)
      : null,
    lastDispatchAttemptAt: lastDispatchAttemptRow?.created_at
      ? String(lastDispatchAttemptRow.created_at)
      : null,
    lastDispatchProcessedCount:
      typeof processedCount === "number" ? processedCount : null,
    lastWebhookReceivedAt: lastWebhookRow?.received_at
      ? String(lastWebhookRow.received_at)
      : null,
  };
}

export async function countDueNotificationJobs() {
  const database = getDatabase();
  const now = new Date().toISOString();
  const row = database
    .prepare(
      `
        SELECT COUNT(*) as count
        FROM notification_jobs
        WHERE status = 'queued'
          AND (next_attempt_at IS NULL OR next_attempt_at <= ?)
      `
    )
    .get(now);

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
  const database = getDatabase();
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

  database
    .prepare(
      `
        INSERT INTO notification_jobs (
          id, kind, channel, recipient, subject, body, status, provider,
          attempts, last_error, next_attempt_at, provider_message_id,
          delivery_state, last_event_type, last_webhook_at, entity_type,
          entity_id, metadata, created_at, processed_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
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
      job.updatedAt
    );

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const now = new Date().toISOString();
  const rows = database
    .prepare(
      `
        SELECT * FROM notification_jobs
        WHERE status = 'queued'
          AND (next_attempt_at IS NULL OR next_attempt_at <= ?)
        ORDER BY created_at ASC
        LIMIT ?
      `
    )
    .all(now, limit);

  const processedJobs: NotificationJob[] = [];

  for (const row of rows) {
    const job = mapNotificationJobRow(row);
    const attempts = job.attempts + 1;
    const updatedAt = new Date().toISOString();

    try {
      const delivery = await deliverNotification(job);

      database
        .prepare(
          `
            UPDATE notification_jobs
            SET status = 'sent',
                attempts = ?,
                last_error = NULL,
                next_attempt_at = NULL,
                provider_message_id = ?,
                delivery_state = 'sent',
                last_event_type = COALESCE(last_event_type, 'email.sent'),
                processed_at = ?,
                updated_at = ?
            WHERE id = ?
          `
        )
        .run(
          attempts,
          delivery.providerMessageId,
          updatedAt,
          updatedAt,
          job.id
        );

      recordAuditEvent(database, {
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

        database
          .prepare(
            `
              UPDATE notification_jobs
              SET status = 'queued',
                  attempts = ?,
                  last_error = ?,
                  next_attempt_at = ?,
                  delivery_state = 'queued',
                  updated_at = ?
              WHERE id = ?
            `
          )
          .run(attempts, lastError, nextAttemptAt, updatedAt, job.id);

        recordAuditEvent(database, {
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
        database
          .prepare(
            `
              UPDATE notification_jobs
              SET status = 'failed',
                  attempts = ?,
                  last_error = ?,
                  next_attempt_at = NULL,
                  delivery_state = 'failed',
                  processed_at = ?,
                  updated_at = ?
              WHERE id = ?
            `
          )
          .run(attempts, lastError, updatedAt, updatedAt, job.id);

        recordAuditEvent(database, {
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

    const updated = database
      .prepare("SELECT * FROM notification_jobs WHERE id = ?")
      .get(job.id);

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
  const database = getDatabase();
  const rows = database
    .prepare(
      `
        SELECT * FROM notification_jobs
        WHERE status = 'failed'
        ORDER BY updated_at ASC
        LIMIT ?
      `
    )
    .all(limit);

  const requeuedJobs: NotificationJob[] = [];
  const now = new Date().toISOString();

  rows.forEach((row) => {
    const job = mapNotificationJobRow(row);

    database
      .prepare(
        `
          UPDATE notification_jobs
          SET status = 'queued',
              attempts = 0,
              last_error = NULL,
              next_attempt_at = ?,
              provider_message_id = NULL,
              delivery_state = 'queued',
              last_event_type = NULL,
              last_webhook_at = NULL,
              processed_at = NULL,
              updated_at = ?
          WHERE id = ?
        `
      )
      .run(now, now, job.id);

    recordAuditEvent(database, {
      actor,
      action: "notification.requeued",
      entityType: "notification",
      entityId: job.id,
      summary: `Requeued ${job.kind} notification to ${job.recipient}`,
      metadata: {
        provider: job.provider,
      },
    });

    const updated = database
      .prepare("SELECT * FROM notification_jobs WHERE id = ?")
      .get(job.id);

    if (updated) {
      requeuedJobs.push(mapNotificationJobRow(updated));
    }
  });

  return requeuedJobs;
}

export async function getNotificationWebhookEvents(limit = 25) {
  const database = getDatabase();
  const rows = database
    .prepare(
      `
        SELECT * FROM notification_webhook_events
        ORDER BY received_at DESC
        LIMIT ?
      `
    )
    .all(limit);

  return rows.map(mapNotificationWebhookEventRow);
}

export async function ingestResendWebhookEvent(input: {
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
  providerMessageId?: string | null;
}) {
  const database = getDatabase();
  const receivedAt = new Date().toISOString();
  const providerMessageId = input.providerMessageId?.trim() || null;
  const inserted = database
    .prepare(
      `
        INSERT OR IGNORE INTO notification_webhook_events (
          id, provider, event_id, event_type, notification_job_id,
          provider_message_id, payload, received_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      randomUUID(),
      "resend",
      input.eventId,
      input.eventType,
      null,
      providerMessageId,
      JSON.stringify(input.payload),
      receivedAt
    );

  if (Number(inserted.changes ?? 0) === 0) {
    const existing = database
      .prepare("SELECT * FROM notification_webhook_events WHERE event_id = ?")
      .get(input.eventId);

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
    ? database
        .prepare(
          "SELECT * FROM notification_jobs WHERE provider_message_id = ?"
        )
        .get(providerMessageId)
    : undefined;

  let updatedJob: NotificationJob | null = null;
  let webhookEvent = database
    .prepare("SELECT * FROM notification_webhook_events WHERE event_id = ?")
    .get(input.eventId);

  if (jobRow) {
    const jobId = String(jobRow.id);
    const nextStatus = isFailureDeliveryState(deliveryState)
      ? "failed"
      : "sent";

    database
      .prepare(
        `
          UPDATE notification_jobs
          SET status = ?,
              delivery_state = ?,
              last_event_type = ?,
              last_webhook_at = ?,
              last_error = ?,
              updated_at = ?
          WHERE id = ?
        `
      )
      .run(
        nextStatus,
        deliveryState,
        input.eventType,
        receivedAt,
        lastError,
        receivedAt,
        jobId
      );

    database
      .prepare(
        `
          UPDATE notification_webhook_events
          SET notification_job_id = ?
          WHERE event_id = ?
        `
      )
      .run(jobId, input.eventId);

    recordAuditEvent(database, {
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

    const refreshedJob = database
      .prepare("SELECT * FROM notification_jobs WHERE id = ?")
      .get(jobId);
    updatedJob = refreshedJob ? mapNotificationJobRow(refreshedJob) : null;
    webhookEvent = database
      .prepare("SELECT * FROM notification_webhook_events WHERE event_id = ?")
      .get(input.eventId);
  } else {
    recordAuditEvent(database, {
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

function acquireJobLock(
  database: Database,
  input: {
    name: string;
    owner: string;
    ttlMs: number;
  }
) {
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + input.ttlMs).toISOString();

  database.prepare("DELETE FROM job_locks WHERE expires_at <= ?").run(now);

  const inserted = database
    .prepare(
      `
        INSERT OR IGNORE INTO job_locks (name, owner, expires_at, updated_at)
        VALUES (?, ?, ?, ?)
      `
    )
    .run(input.name, input.owner, expiresAt, now);

  return Number(inserted.changes ?? 0) > 0;
}

function releaseJobLock(database: Database, name: string, owner: string) {
  database
    .prepare("DELETE FROM job_locks WHERE name = ? AND owner = ?")
    .run(name, owner);
}

export async function runNotificationDispatchCycle(input?: {
  limit?: number;
  actor?: string;
  owner?: string;
  lockTtlMs?: number;
}) {
  const database = getDatabase();
  const limit = input?.limit ?? 20;
  const actor = input?.actor ?? "system:cron";
  const owner = input?.owner ?? randomUUID();
  const lockName = "notification_dispatch";
  const lockTtlMs = input?.lockTtlMs ?? 60_000;

  if (!acquireJobLock(database, { name: lockName, owner, ttlMs: lockTtlMs })) {
    const health = await getNotificationQueueHealth();
    recordAuditEvent(database, {
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
      recordAuditEvent(database, {
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

    recordAuditEvent(database, {
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
    releaseJobLock(database, lockName, owner);
  }
}

export async function recordSessionAudit(
  action: "session.login" | "session.logout",
  actor = "admin"
) {
  const database = getDatabase();

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const rows = database
    .prepare("SELECT key, value FROM app_settings ORDER BY key ASC")
    .all();

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
  const database = getDatabase();
  const now = new Date().toISOString();

  database
    .prepare(
      `
        INSERT OR REPLACE INTO app_settings (key, value, updated_at)
        VALUES (?, ?, ?)
      `
    )
    .run(section, JSON.stringify(value), now);

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const rows = database
    .prepare(
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
    )
    .all();
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
  const database = getDatabase();
  const existing = database
    .prepare("SELECT id FROM admin_users WHERE username = ?")
    .get(input.username);

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
    username: input.username.trim(),
    displayName: input.displayName.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    status: "active",
    mfaEnabled: false,
    lastLoginAt: null,
    createdAt: now,
  };

  database
    .prepare(
      `
        INSERT INTO admin_users (
          id, username, display_name, email, role, status, password_hash,
          last_login_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      user.id,
      user.username,
      user.displayName,
      user.email,
      user.role,
      user.status,
      hashPassword(input.password),
      null,
      now,
      now
    );

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const existing = database
    .prepare("SELECT * FROM admin_users WHERE id = ?")
    .get(id);

  if (!existing) {
    return null;
  }

  const nextRole = input.role ?? (String(existing.role) as AdminUser["role"]);
  const nextStatus = input.status ?? (String(existing.status) as AdminStatus);
  const now = new Date().toISOString();

  database
    .prepare(
      `
        UPDATE admin_users
        SET role = ?, status = ?, updated_at = ?
        WHERE id = ?
      `
    )
    .run(nextRole, nextStatus, now, id);

  const updated = database
    .prepare(
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
        WHERE id = ?
      `
    )
    .get(id);

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const row = database
    .prepare(
      `
        SELECT
          u.*,
          ${getMfaEnabledSelect()}
        FROM admin_users u
        WHERE u.username = ?
      `
    )
    .get(username.trim());

  if (!row || String(row.status) !== "active") {
    return null;
  }

  if (!verifyPassword(password, String(row.password_hash))) {
    return null;
  }

  return mapAdminUserRow(row);
}

export async function createAdminSession(userId: string, ttlMs: number) {
  const database = getDatabase();
  const user = database
    .prepare(
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
        WHERE u.id = ?
      `
    )
    .get(userId);

  if (!user) {
    return null;
  }

  const sessionId = randomUUID();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  database.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(now);
  database
    .prepare(
      `
        INSERT INTO admin_sessions (
          id, user_id, expires_at, created_at, last_seen_at
        ) VALUES (?, ?, ?, ?, ?)
      `
    )
    .run(sessionId, userId, expiresAt, now, now);

  database
    .prepare(
      "UPDATE admin_users SET last_login_at = ?, updated_at = ? WHERE id = ?"
    )
    .run(now, now, userId);

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
  const database = getDatabase();
  const row = database
    .prepare(
      `
        SELECT
          s.id as session_id,
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
          u.created_at as user_created_at
        FROM admin_sessions s
        INNER JOIN admin_users u ON u.id = s.user_id
        WHERE s.id = ?
      `
    )
    .get(sessionId);

  if (!row) {
    return null;
  }

  if (String(row.expires_at) <= new Date().toISOString()) {
    database.prepare("DELETE FROM admin_sessions WHERE id = ?").run(sessionId);
    return null;
  }

  if (String(row.status) !== "active") {
    return null;
  }

  database
    .prepare("UPDATE admin_sessions SET last_seen_at = ? WHERE id = ?")
    .run(new Date().toISOString(), sessionId);

  return {
    id: String(row.session_id),
    expiresAt: String(row.expires_at),
    createdAt: String(row.created_at),
    lastSeenAt: String(row.last_seen_at),
    user: mapAdminUserRow({
      ...row,
      created_at: row.user_created_at,
    }),
  } satisfies AdminSession;
}

export async function deleteAdminSession(sessionId: string) {
  const database = getDatabase();
  database.prepare("DELETE FROM admin_sessions WHERE id = ?").run(sessionId);
}

export async function listAdminSessions(input?: {
  userId?: string;
  currentSessionId?: string | null;
}) {
  const database = getDatabase();
  let sql = `
    SELECT
      s.id as session_id,
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
      u.created_at as user_created_at
    FROM admin_sessions s
    INNER JOIN admin_users u ON u.id = s.user_id
    WHERE s.expires_at > ?
  `;
  const params: unknown[] = [new Date().toISOString()];

  if (input?.userId) {
    sql += " AND s.user_id = ?";
    params.push(input.userId);
  }

  sql += " ORDER BY s.last_seen_at DESC, s.created_at DESC";

  const rows = database.prepare(sql).all(...params);
  return rows.map((row) => ({
    id: String(row.session_id),
    expiresAt: String(row.expires_at),
    createdAt: String(row.created_at),
    lastSeenAt: String(row.last_seen_at),
    user: mapAdminUserRow({
      ...row,
      created_at: row.user_created_at,
    }),
    isCurrent:
      input?.currentSessionId != null &&
      String(row.session_id) === input.currentSessionId,
  }));
}

export async function revokeAdminSession(
  sessionId: string,
  actor = "admin"
) {
  const database = getDatabase();
  const existing = database
    .prepare(
      `
        SELECT
          s.id as session_id,
          s.user_id,
          u.username
        FROM admin_sessions s
        INNER JOIN admin_users u ON u.id = s.user_id
        WHERE s.id = ?
      `
    )
    .get(sessionId);

  if (!existing) {
    return false;
  }

  database.prepare("DELETE FROM admin_sessions WHERE id = ?").run(sessionId);

  recordAuditEvent(database, {
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
  const database = getDatabase();
  let sql = "DELETE FROM admin_sessions WHERE user_id = ?";
  const params: unknown[] = [userId];

  if (exceptSessionId) {
    sql += " AND id != ?";
    params.push(exceptSessionId);
  }

  const result = database.prepare(sql).run(...params);
  const count = Number(result.changes ?? 0);

  if (count > 0) {
    recordAuditEvent(database, {
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
  const database = getDatabase();
  const row = database
    .prepare(
      `
        SELECT
          pending,
          enabled_at,
          recovery_codes
        FROM admin_mfa_credentials
        WHERE user_id = ?
      `
    )
    .get(userId);

  if (!row) {
    return getDefaultMfaStatus();
  }

  const recoveryCodes = parseJsonArray(row.recovery_codes);
  const pending = Number(row.pending) === 1;

  return {
    enabled: !pending && Boolean(row.enabled_at),
    pending,
    enabledAt: row.enabled_at ? String(row.enabled_at) : null,
    recoveryCodesRemaining: recoveryCodes.length,
  } satisfies AdminMfaStatus;
}

export async function beginAdminMfaEnrollment(
  userId: string,
  actor = "admin"
) {
  const database = getDatabase();
  const user = database
    .prepare("SELECT id, username, email FROM admin_users WHERE id = ?")
    .get(userId);

  if (!user) {
    throw new Error("Admin user not found.");
  }

  const now = new Date().toISOString();
  const secret = generateTotpSecret();
  const recoveryCodes = generateRecoveryCodes();

  database
    .prepare(
      `
        INSERT OR REPLACE INTO admin_mfa_credentials (
          user_id, secret, recovery_codes, pending, created_at, updated_at, enabled_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      userId,
      secret,
      JSON.stringify(recoveryCodes.map((code) => hashRecoveryCode(code))),
      1,
      now,
      now,
      null
    );

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const row = database
    .prepare(
      `
        SELECT secret, pending
        FROM admin_mfa_credentials
        WHERE user_id = ?
      `
    )
    .get(userId);

  if (!row || Number(row.pending) !== 1) {
    throw new Error("No pending MFA enrollment was found.");
  }

  if (!verifyTotpCode({ secret: String(row.secret), code })) {
    throw new Error("Invalid authentication code.");
  }

  const now = new Date().toISOString();
  database
    .prepare(
      `
        UPDATE admin_mfa_credentials
        SET pending = 0,
            enabled_at = ?,
            updated_at = ?
        WHERE user_id = ?
      `
    )
    .run(now, now, userId);

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const existing = database
    .prepare("SELECT user_id FROM admin_mfa_credentials WHERE user_id = ?")
    .get(userId);

  if (!existing) {
    return false;
  }

  database
    .prepare("DELETE FROM admin_mfa_credentials WHERE user_id = ?")
    .run(userId);
  database
    .prepare("DELETE FROM admin_mfa_challenges WHERE user_id = ?")
    .run(userId);

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const user = database
    .prepare("SELECT id FROM admin_users WHERE id = ? AND status = 'active'")
    .get(userId);

  if (!user) {
    return null;
  }

  const credential = database
    .prepare(
      `
        SELECT user_id
        FROM admin_mfa_credentials
        WHERE user_id = ?
          AND pending = 0
          AND enabled_at IS NOT NULL
      `
    )
    .get(userId);

  if (!credential) {
    return null;
  }

  const challenge = createMfaChallengeRecord({
    userId,
    expiresInMs: 10 * 60 * 1000,
  });

  database
    .prepare(
      `
        DELETE FROM admin_mfa_challenges
        WHERE user_id = ?
           OR expires_at <= ?
      `
    )
    .run(userId, new Date().toISOString());

  database
    .prepare(
      `
        INSERT INTO admin_mfa_challenges (
          id, user_id, expires_at, created_at, completed_at
        ) VALUES (?, ?, ?, ?, ?)
      `
    )
    .run(
      challenge.id,
      challenge.userId,
      challenge.expiresAt,
      challenge.createdAt,
      null
    );

  return challenge;
}

export async function verifyAdminMfaChallenge(
  challengeId: string,
  code: string
) {
  const database = getDatabase();
  const row = database
    .prepare(
      `
        SELECT
          c.id as challenge_id,
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
        WHERE c.id = ?
      `
    )
    .get(challengeId);

  if (!row || row.completed_at) {
    return null;
  }

  if (String(row.expires_at) <= new Date().toISOString()) {
    database
      .prepare("DELETE FROM admin_mfa_challenges WHERE id = ?")
      .run(challengeId);
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
  database
    .prepare(
      "UPDATE admin_mfa_challenges SET completed_at = ? WHERE id = ?"
    )
    .run(now, challengeId);

  if (recoveryValid) {
    const remainingCodes = consumeRecoveryCode({
      recoveryCode: code,
      hashedRecoveryCodes: recoveryCodes,
    });
    database
      .prepare(
        `
          UPDATE admin_mfa_credentials
          SET recovery_codes = ?, updated_at = ?
          WHERE user_id = ?
        `
      )
      .run(JSON.stringify(remainingCodes), now, String(row.user_id));
  }

  return mapAdminUserRow(row);
}

export async function requestAdminPasswordReset(
  identifier: string,
  actor = "public"
) {
  const database = getDatabase();
  const normalized = identifier.trim().toLowerCase();
  const user = database
    .prepare(
      `
        SELECT
          id,
          username,
          email,
          display_name
        FROM admin_users
        WHERE lower(username) = ?
           OR lower(email) = ?
      `
    )
    .get(normalized, normalized);

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

  database
    .prepare(
      `
        DELETE FROM admin_password_reset_tokens
        WHERE user_id = ?
           OR expires_at <= ?
           OR consumed_at IS NOT NULL
      `
    )
    .run(user.id, new Date().toISOString());

  database
    .prepare(
      `
        INSERT INTO admin_password_reset_tokens (
          id, user_id, token_hash, expires_at, created_at, consumed_at, requested_by, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      record.id,
      record.userId,
      record.tokenHash,
      record.expiresAt,
      record.createdAt,
      null,
      record.requestedBy,
      JSON.stringify(record.metadata)
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

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const tokenHash = hashOpaqueToken(token);
  const row = database
    .prepare(
      `
        SELECT
          t.*,
          u.username,
          u.id as user_id,
          u.display_name,
          u.email,
          u.role,
          u.status,
          ${getMfaEnabledSelect("u")},
          u.last_login_at,
          u.created_at
        FROM admin_password_reset_tokens t
        INNER JOIN admin_users u ON u.id = t.user_id
        WHERE t.token_hash = ?
      `
    )
    .get(tokenHash);

  if (!row || row.consumed_at || String(row.expires_at) <= new Date().toISOString()) {
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
  database
    .prepare(
      `
        UPDATE admin_users
        SET password_hash = ?, updated_at = ?
        WHERE id = ?
      `
    )
    .run(hashPassword(newPassword), now, String(row.user_id));

  database
    .prepare(
      `
        UPDATE admin_password_reset_tokens
        SET consumed_at = ?
        WHERE id = ?
      `
    )
    .run(now, String(row.id));

  await revokeAdminSessionsForUser(String(row.user_id), actor);

  recordAuditEvent(database, {
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
  const database = getDatabase();
  const tokenHash = hashOpaqueToken(token);
  const row = database
    .prepare(
      `
        SELECT *
        FROM admin_password_reset_tokens
        WHERE token_hash = ?
      `
    )
    .get(tokenHash);

  if (!row) {
    return null;
  }

  if (row.consumed_at || String(row.expires_at) <= new Date().toISOString()) {
    return null;
  }

  return mapPasswordResetRequestRow(row);
}
