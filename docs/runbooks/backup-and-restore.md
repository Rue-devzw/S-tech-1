# Backup And Restore

## Goal

Make database recovery a repeatable operator task instead of an improvisation during an incident.

## Primary System Of Record

Production should run on Postgres through `DATABASE_URL`.

SQLite remains a local fallback and is not the recommended production database.

## Backup Cadence

- Production Postgres: daily automated backups plus point-in-time recovery if supported by the provider.
- Staging Postgres: daily or before major migration rehearsals.
- SQLite fallback: copy the `.data/*.sqlite` file before risky local work.

## Manual Postgres Backup

Use `pg_dump` against the managed database:

```bash
pg_dump "$DATABASE_URL" --format=custom --file "backup-$(date +%Y%m%d-%H%M%S).dump"
```

Recommended:

- store backups in encrypted object storage
- tag by environment and timestamp
- keep a restore log with operator name and reason

## Manual SQLite Backup

```bash
cp .data/s-tech.sqlite ".data/s-tech-backup-$(date +%Y%m%d-%H%M%S).sqlite"
```

## Restore Drill

Run this in staging first and document the outcome.

### Postgres Restore

1. Provision an empty Postgres database.
2. Restore the backup:

```bash
pg_restore --clean --if-exists --no-owner --dbname "$DATABASE_URL" backup-YYYYMMDD-HHMMSS.dump
```

3. Run migrations to ensure current schema alignment:

```bash
npm run db:postgres:migrate
```

4. Run verification and smoke tests:

```bash
npm run db:postgres:verify
npm run test:e2e
```

### SQLite Restore

1. Stop the app process.
2. Replace the active SQLite file with the backup copy.
3. Restart the app.

## Data Validation After Restore

Check:

- admin login works
- `/store` and `/listing/st-003` load
- `/admin/leads` and `/admin/analytics` load
- notification health endpoint returns a sensible status

```bash
npm run notifications:health https://your-app.example.com
```

## Restore Decision Guide

Prefer application rollback when:

- code is broken
- schema is intact
- data is not corrupted

Prefer database restore when:

- incorrect destructive writes occurred
- migration damaged records
- data cannot be repaired safely by script

## Drill Frequency

- staging restore rehearsal: at least once per quarter
- production backup audit: monthly
- major migration rehearsal: before each risky schema change
