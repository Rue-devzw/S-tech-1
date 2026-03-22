# Postgres Runtime and Migration

This repo now supports Postgres at runtime behind the existing `data-store` API. SQLite remains available as the local fallback when `DATABASE_URL` is not set.

## What Was Added

- Versioned Postgres schema migrations in `db/postgres/migrations`.
- A migration runner in `scripts/postgres-migrate.mjs`.
- A SQLite-to-Postgres import tool in `scripts/sqlite-to-postgres.mjs`.
- A row-count verification tool in `scripts/postgres-verify.mjs`.

## Required Environment

- `DEPLOYMENT_ENV`: Set to `local` for rehearsal, or the live tier label when validating a deployed environment.
- `DATABASE_URL`: Postgres connection string for the target managed database.
- `SQLITE_DB_PATH`: Existing SQLite path to export from. Defaults to `.data/s-tech.sqlite`.

## Recommended Workflow

1. Provision a managed Postgres database.
2. Export its connection string into `DATABASE_URL`.
3. Apply schema migrations:

```bash
npm run db:postgres:migrate
```

4. Import current SQLite data:

```bash
npm run db:postgres:import
```

If you want to replace the target contents first:

```bash
npm run db:postgres:import -- --truncate
```

5. Verify row counts:

```bash
npm run db:postgres:verify
```

6. Rehearse the runtime cutover on the production build:

```bash
npm run db:postgres:cutover-rehearsal -- --truncate
```

The rehearsal command runs local preflight, migrations, SQLite import, row-count verification, production build, browser smoke tests, deployment smoke checks, and notification-health checks against a Postgres-backed app instance on a temporary port.

## Runtime Behavior

- If `DATABASE_URL` is set, the application uses Postgres for reads and writes.
- If `DATABASE_URL` is unset, the application falls back to SQLite at `SQLITE_DB_PATH`.
- On first Postgres boot, the app applies pending SQL migrations and seeds default listings, settings, and the initial owner account when those tables are empty.

## Validation Notes

- `npm run db:postgres:import` and `npm run db:postgres:verify` already include the required Node SQLite runtime flag.
- A successful cutover check should include schema migration, import, row-count verification, and browser smoke tests against a `DATABASE_URL`-backed app instance.
- `npm run db:postgres:cutover-rehearsal` automates that full local rehearsal path.
