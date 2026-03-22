export const POSTGRES_MIGRATIONS = [
  {
    filename: "0001_initial_schema.sql",
    sql: `CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  client TEXT NOT NULL,
  industry TEXT NOT NULL,
  delivery_timeline TEXT NOT NULL,
  support_window TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  preview_url TEXT,
  rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  sales_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  listing_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'responded', 'closed')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'support')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  password_hash TEXT NOT NULL,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_jobs (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
  provider TEXT NOT NULL CHECK (provider IN ('console', 'resend', 'disabled')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  next_attempt_at TIMESTAMPTZ,
  provider_message_id TEXT,
  delivery_state TEXT NOT NULL DEFAULT 'queued',
  last_event_type TEXT,
  last_webhook_at TIMESTAMPTZ,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_locks (
  name TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_webhook_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  notification_job_id TEXT,
  provider_message_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS request_events (
  id TEXT PRIMARY KEY,
  route TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  subject TEXT,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_listings_featured_sales
  ON listings (featured DESC, sales_count DESC, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
  ON inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_created_at
  ON audit_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at
  ON admin_sessions (expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_notification_jobs_status
  ON notification_jobs (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_request_events_route_fingerprint
  ON request_events (route, fingerprint, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_request_events_route_subject
  ON request_events (route, subject, created_at DESC);`,
  },
  {
    filename: "0002_admin_identity.sql",
    sql: `CREATE TABLE IF NOT EXISTS admin_password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  requested_by TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_admin_password_reset_tokens_user_id
  ON admin_password_reset_tokens (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_password_reset_tokens_expires_at
  ON admin_password_reset_tokens (expires_at DESC);

CREATE TABLE IF NOT EXISTS admin_mfa_credentials (
  user_id TEXT PRIMARY KEY,
  secret TEXT NOT NULL,
  recovery_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
  pending BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  enabled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS admin_mfa_challenges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_admin_mfa_challenges_user_id
  ON admin_mfa_challenges (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_mfa_challenges_expires_at
  ON admin_mfa_challenges (expires_at DESC);`,
  },
  {
    filename: "0003_analytics_events.sql",
    sql: `CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  route TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  subject TEXT,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
  ON analytics_events (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_subject
  ON analytics_events (subject, created_at DESC);`,
  },
] as const;
