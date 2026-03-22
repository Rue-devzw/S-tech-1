CREATE TABLE IF NOT EXISTS analytics_events (
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
  ON analytics_events (subject, created_at DESC);
