CREATE TABLE IF NOT EXISTS admin_password_reset_tokens (
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
  ON admin_mfa_challenges (expires_at DESC);
