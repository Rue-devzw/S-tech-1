#!/bin/sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
DB_HOST="${POSTGRES_HOST:-postgres}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-omnitech}"
DB_USER="${POSTGRES_USER:-postgres}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUTPUT="${BACKUP_DIR}/${DB_NAME}-${STAMP}.dump"

mkdir -p "$BACKUP_DIR"

pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="$OUTPUT"

gzip -f "$OUTPUT"
find "$BACKUP_DIR" -name "${DB_NAME}-*.dump.gz" -type f -mtime +"$RETENTION_DAYS" -delete

echo "Created backup ${OUTPUT}.gz"
