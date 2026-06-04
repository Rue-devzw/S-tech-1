#!/bin/sh
set -eu

if [ "${1:-}" = "" ]; then
  echo "Usage: scripts/restore-postgres.sh <backup.dump.gz|backup.dump>"
  exit 1
fi

BACKUP_FILE="$1"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-omnitech}"
DB_USER="${POSTGRES_USER:-postgres}"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

case "$BACKUP_FILE" in
  *.gz)
    gunzip -c "$BACKUP_FILE" | pg_restore \
      --host="$DB_HOST" \
      --port="$DB_PORT" \
      --username="$DB_USER" \
      --dbname="$DB_NAME" \
      --clean \
      --if-exists \
      --no-owner \
      --no-privileges
    ;;
  *)
    pg_restore \
      --host="$DB_HOST" \
      --port="$DB_PORT" \
      --username="$DB_USER" \
      --dbname="$DB_NAME" \
      --clean \
      --if-exists \
      --no-owner \
      --no-privileges \
      "$BACKUP_FILE"
    ;;
esac

echo "Restored ${BACKUP_FILE} into ${DB_NAME}"
