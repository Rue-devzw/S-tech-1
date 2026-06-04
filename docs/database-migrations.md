# Database Migration Guide

OmniTech uses PostgreSQL with Prisma ORM. Production and staging must use committed Prisma migrations, not `prisma db push`.

## Files

- Schema: `prisma/schema.prisma`
- Initial migration: `prisma/migrations/0001_initial/migration.sql`
- Migration lock: `prisma/migrations/migration_lock.toml`
- Seed data: `prisma/seed.ts`

## Local Development Workflow

1. Update `prisma/schema.prisma`.
2. Generate a migration.

```bash
npm run db:migrate:dev -- --name short_descriptive_name
```

3. Review generated SQL in `prisma/migrations`.
4. Regenerate Prisma client if needed.

```bash
npm run db:generate
```

5. Update seed data if the model changed.

```bash
npm run db:seed
```

6. Run verification.

```bash
npm run test
npm run build
```

## Staging and Production Workflow

1. Build from a reviewed commit.
2. Confirm database connectivity with the target `DATABASE_URL`.
3. Check migration state.

```bash
npm run db:migrate:status
```

4. Apply migrations.

```bash
npm run db:migrate:deploy
```

5. Start or roll application containers only after migrations succeed.

## Docker Migration Workflow

```bash
docker compose --profile tools run --rm migrate
```

Seed data in development or staging:

```bash
docker compose --profile tools run --rm seed
```

Do not seed production unless the seed file has been adjusted to create only required roles, permissions and first admin bootstrap data.

## Seed Data Policy

The seed file includes fictional Zimbabwe and Southern Africa-relevant examples:

- Roles and permissions.
- Admin, technician and sales users.
- Service categories and services.
- Customers, service requests, job cards and status history.
- Devices, repair intake, field visits and Starlink workflows.
- Quotations, invoices, payments and receipts.
- Inventory, suppliers and stock movements.
- Promotions, portfolio projects, testimonials, blog posts and FAQs.

Development password: `OmniTech#2026`.

Production must replace demo credentials and avoid fictional operational records unless explicitly desired for training.

## Destructive Change Rules

- Avoid destructive changes in the same release as feature changes.
- Back up production immediately before destructive migrations.
- Prefer nullable columns, backfills and follow-up cleanup migrations.
- For enum changes, test migration SQL against a copy of production data.
- For large tables, assess lock time and use phased migrations.

## Rollback Strategy

Prisma migrations are forward-moving. Prefer a forward-fix migration.

If data restore is required:

1. Stop application writes.
2. Restore the last verified backup to a new database.
3. Point the app to the restored database.
4. Run smoke tests.
5. Reopen access only after verification.

## Backup Commands

Local backup through Docker Compose:

```bash
docker compose --profile tools run --rm backup
```

Host restore:

```bash
POSTGRES_PASSWORD=postgres scripts/restore-postgres.sh backups/omnitech-YYYYMMDDTHHMMSSZ.dump.gz
```
