# OmniTech Solutions Deployment Runbook

Brand promise: We repair. We connect. We build. We automate.

This runbook describes how to build, configure, deploy, monitor, back up and roll back the OmniTech Solutions platform in local development, staging and production.

## Runtime Architecture

- Application: Next.js standalone server running on Node.js 22.
- Database: PostgreSQL 16 managed by Prisma migrations.
- Storage: local volume for development; S3-compatible private object storage for staging/production.
- Auth: HTTP-only session cookie signed with `AUTH_SECRET`.
- Notifications: provider abstraction for email, SMS-ready and WhatsApp-ready channels.
- AI: provider-agnostic assistant layer with redaction, logging, approval workflow and local fallback.

## Required Environment Variables

Use `.env.example` as the source template. Production secrets must come from the deployment platform secret store, not from committed files.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. Use a private host and TLS in production. |
| `AUTH_SECRET` | Yes | At least 32 random characters. Rotate through a planned session invalidation window. |
| `APP_URL` | Yes | Public base URL for links, health checks and notification content. Use `https://omnitech.io` in production. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public canonical site URL for SEO metadata, OpenGraph, robots and sitemap output. Use `https://omnitech.io` in production. |
| `STORAGE_DRIVER` | Yes | `local` for development; `s3` or compatible implementation for production. |
| `STORAGE_LOCAL_DIR` | Dev | Local attachment directory, mounted as a Docker volume. |
| `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Prod | Required when S3-compatible storage is enabled. |
| `EMAIL_PROVIDER`, `EMAIL_FROM`, `EMAIL_API_KEY` | Optional | Use `log` until a real provider is connected. |
| `SMS_PROVIDER`, `SMS_API_KEY` | Optional | Provider-ready configuration. |
| `WHATSAPP_PROVIDER`, `WHATSAPP_API_KEY`, `WHATSAPP_PHONE_NUMBER_ID` | Optional | WhatsApp-ready configuration. |
| `AI_ASSISTANT_PROVIDER`, `AI_PROVIDER_BASE_URL`, `AI_PROVIDER_API_KEY`, `AI_MODEL` | Optional | Use `local-fallback` until a reviewed provider is connected. |
| `AI_COST_INPUT_PER_1K`, `AI_COST_OUTPUT_PER_1K` | Optional | Cost tracking for AI usage. |
| `LOG_LEVEL` | Optional | `info` by default. |
| `BACKUP_DIR`, `BACKUP_RETENTION_DAYS` | Ops | Local backup destination and retention for compose tooling. |

## Local Development

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Start Postgres:

```bash
docker compose up -d postgres
```

3. Install dependencies and create the database schema:

```bash
npm install
npm run db:migrate:dev
npm run db:seed
npm run dev
```

4. Open `http://localhost:3000`.

Seed logins:

- `admin@omnitech.io` / `OmniTech#2026`
- `tech@omnitech.io` / `OmniTech#2026`
- `sales@omnitech.io` / `OmniTech#2026`

## Docker Local Workflow

Build and run the full stack:

```bash
docker compose up --build
```

Run production-style migrations and seed data against the compose database:

```bash
docker compose --profile tools run --rm migrate
docker compose --profile tools run --rm seed
```

Create a local database backup:

```bash
docker compose --profile tools run --rm backup
```

Restore from a backup on the host, with PostgreSQL client tools installed:

```bash
POSTGRES_PASSWORD=postgres scripts/restore-postgres.sh backups/omnitech-YYYYMMDDTHHMMSSZ.dump.gz
```

## Build Scripts

- `npm run build`: generates Prisma client and builds the Next.js standalone bundle.
- `npm run start`: starts the built Next.js server.
- `npm run typecheck`: runs TypeScript checks.
- `npm run test`: runs unit and integration tests.
- `npm run test:e2e`: runs Playwright browser/API tests.
- `npm run test:qa`: runs typecheck, unit, integration and E2E checks.
- `npm run db:migrate:dev`: creates/applies local development migrations.
- `npm run db:migrate:deploy`: applies committed migrations in staging/production.
- `npm run db:migrate:status`: checks migration drift/status.
- `npm run db:seed`: loads seed data.
- `npm run docker:build`: builds a local Docker image.
- `npm run healthcheck`: checks `/api/health`.

## Database Migration Workflow

Development:

1. Change `prisma/schema.prisma`.
2. Run `npm run db:migrate:dev -- --name descriptive_change_name`.
3. Review generated SQL in `prisma/migrations`.
4. Run `npm run db:seed` if seed data changed.
5. Run `npm run test:qa` before merging.

Staging and production:

1. Build the image from a reviewed commit.
2. Run `npm run db:migrate:status` against the target database.
3. Run `npm run db:migrate:deploy` as a one-off release job.
4. Start or roll the app containers only after migrations succeed.
5. Do not use `prisma db push` outside disposable development databases.

The repository includes `prisma/migrations/0001_initial/migration.sql` as the initial deployable schema.

## Staging Deployment Notes

- Use separate staging secrets, database, storage bucket and notification provider credentials.
- Run staging with production-like Docker image settings and `NODE_ENV=production`.
- Keep `AI_ASSISTANT_PROVIDER=local-fallback` unless the AI provider has been approved for test data.
- Enable real email/SMS/WhatsApp providers only with staging sender identities and test recipients.
- Run release validation:

```bash
npm run db:migrate:deploy
npm run test:qa
npm run healthcheck
```

- Confirm these manual checks:
  - Public site and request form load.
  - Admin login works.
  - Customer registration works.
  - Service request to job-card workflow works.
  - Quotation approval and invoice conversion work.
  - `/api/health` returns `status: ok`.

## Production Deployment Notes

- Use managed PostgreSQL on a private network with TLS required.
- Use least-privilege database users for app runtime, migrations and backups.
- Use managed secrets for all environment variables.
- Use S3-compatible private storage for photos/documents; serve files through signed URLs or controlled application routes.
- Terminate HTTPS at a load balancer or platform edge; enable HSTS.
- Run one migration job per release before rolling app containers.
- Roll out with blue/green or rolling deployments and keep the previous image available.
- Run the application as a non-root user; the Dockerfile already uses `nextjs`.
- Confirm security headers, secure cookies and proxy headers in the deployed environment.

Recommended production release sequence:

1. Build and tag the image with the commit SHA.
2. Run tests in CI.
3. Back up the production database.
4. Run `npm run db:migrate:status`.
5. Run `npm run db:migrate:deploy`.
6. Deploy the new image.
7. Check `/api/health`.
8. Smoke test public intake, login, admin dashboard and technician dashboard.
9. Monitor logs, error rate, latency and database metrics for at least 30 minutes.

## Backup Plan

- Database:
  - Nightly encrypted full backups.
  - Point-in-time recovery enabled on managed PostgreSQL.
  - Retain daily backups for at least 14 days and monthly backups according to business/legal requirements.
  - Run quarterly restore drills into an isolated environment.
- Files:
  - Enable bucket versioning for production object storage.
  - Use lifecycle policies for retention and deletion.
  - Keep production and staging buckets separate.
- Configuration:
  - Store secrets in the provider secret manager.
  - Keep an offline record of required variable names, not secret values.

Local compose backup command:

```bash
docker compose --profile tools run --rm backup
```

## Monitoring Plan

Track:

- `/api/health` availability and latency.
- HTTP 5xx rate, 4xx spikes and route latency.
- Database CPU, memory, storage, connection count, locks and slow queries.
- Migration job success/failure.
- Queue/notification delivery failures once external providers are connected.
- AI provider failures, fallback usage, token spend and approval backlog.
- Disk usage for local storage in development and bucket growth in production.

Alert on:

- Health check failure for more than two consecutive checks.
- Elevated 5xx rate.
- Database storage below 20 percent free.
- Failed backups.
- Failed migrations.
- Unexpected Super Admin/user invitation activity.

## Logging Plan

- Application logs should go to stdout/stderr for container collection.
- Do not log passwords, tokens, raw reset links, secret settings, API keys or unredacted AI prompts.
- Keep audit events in the database for user/security workflows.
- Ship production container logs and audit exports to centralized logging or SIEM.
- Use correlation IDs at the edge or platform layer when available.
- Retain logs according to privacy and business policy.

## Rollback Strategy

Application rollback:

1. Keep the previous Docker image tag for every release.
2. If health checks or smoke tests fail, redeploy the previous image.
3. Verify `/api/health`, login and core workflows.
4. Create an incident note with timeline, scope and follow-up actions.

Database rollback:

- Prefer forward-fix migrations for schema changes.
- For destructive migrations, take a verified backup immediately before deploy.
- If rollback requires restore, stop app writes, restore the backup to a new database, point the app to the restored database, and verify core workflows before reopening access.

Feature rollback:

- Use configuration flags in `SystemSetting` for provider switches, AI provider changes and notification delivery modes.
- Disable risky integrations before rolling back the whole app when possible.
