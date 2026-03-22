# S-Tech Studios

A Next.js 15 storefront and internal admin prototype for S-Tech Studios.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Genkit with Google AI for the admin copy assistant
- SQLite via Node.js built-in `node:sqlite` for local fallback persistence
- Postgres runtime support via `pg` and versioned SQL migrations

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

The app runs on `http://localhost:9002`.

The repository scripts already enable Node's SQLite runtime flag for local development, import/verify tooling, and production builds on Node 22.

## Environment Variables

- `NEXT_PUBLIC_SITE_URL`: Public base URL used for metadata, sitemap, and robots output.
- `DEPLOYMENT_ENV`: Deployment tier label used by preflight checks, release automation, and health reporting. Use `local`, `staging`, or `production`.
- `GOOGLE_API_KEY`: Required only if you want the AI listing assistant to generate copy.
- `ADMIN_USERNAME`: Initial owner username used to seed the first admin account.
- `ADMIN_PASSWORD`: Initial owner password used during first-run seeding.
- `ADMIN_DISPLAY_NAME`: Name assigned to the initial owner account.
- `ADMIN_SESSION_SECRET`: Secret used to sign the admin session cookie.
- `SQLITE_DB_PATH`: Relative path to the local SQLite database file. Defaults to `.data/s-tech.sqlite`.
- `DATABASE_URL`: Optional managed Postgres connection string. When set, the application runtime uses Postgres instead of SQLite.
- `RESEND_API_KEY`: Optional API key used when notification delivery mode is set to `resend`.
- `RESEND_API_BASE_URL`: Optional override for the Resend send-email endpoint. Defaults to `https://api.resend.com/emails`.
- `RESEND_WEBHOOK_SECRET`: Secret used to verify signed Resend webhook deliveries.
- `INTERNAL_CRON_SECRET`: Secret required by the internal notification runner endpoint.
- `NOTIFICATION_RUNNER_BATCH_SIZE`: Default max number of due notifications processed per runner cycle.
- `NOTIFICATION_ALERT_WEBHOOK_URL`: Optional webhook that receives structured alert payloads when the notification runner is blocked or crashes.
- `SENTRY_DSN`: Optional DSN used to emit blocked-runner and crash alerts into Sentry from the notification worker.
- `NOTIFICATION_HEALTH_MAX_DUE`: Optional override for the due-backlog warning threshold used by the cron health endpoint.
- `NOTIFICATION_HEALTH_MAX_DEAD_LETTERS`: Optional override for the dead-letter warning threshold used by the cron health endpoint.
- `NOTIFICATION_HEALTH_MAX_STALE_MINUTES`: Optional override for the stale-runner threshold used by the cron health endpoint.
- `NOTIFICATION_FROM_EMAIL`: Sender address for outbound notification emails.
- `NOTIFICATION_FROM_NAME`: Friendly sender name for outbound notification emails.
- `NOTIFICATION_REPLY_TO`: Optional reply-to address for outbound notification emails.

## Scripts

- `npm run dev`: Start the local development server on port `9002`.
- `npm run db:postgres:migrate`: Apply versioned Postgres schema migrations.
- `npm run db:postgres:import [-- --truncate]`: Import the current SQLite dataset into Postgres.
- `npm run db:postgres:verify`: Compare SQLite and Postgres row counts after import.
- `npm run db:postgres:cutover-rehearsal [-- --truncate --skip-e2e --port=9010]`: Rehearse a Postgres cutover locally by migrating, importing, verifying, booting the production server, and running smoke checks against it.
- `npm run build`: Build the production bundle.
- `npm run start`: Run the production server.
- `npm run ops:preflight [-- --target=production]`: Validate deployment-critical environment assumptions for local, staging, or production targets.
- `npm run deployment:smoke [baseUrl]`: Run read-only smoke checks against a deployed environment.
- `npm run notifications:dispatch [baseUrl] [limit]`: Trigger the internal notification runner against a running deployment.
- `npm run notifications:health [baseUrl]`: Query the cron health endpoint and fail the process when the worker is blocked, or degraded when `NOTIFICATION_HEALTH_ALLOW_DEGRADED` is not set.
- `npm run typecheck`: Generate Next route types and run TypeScript checks.
- `npm run lint`: Run ESLint with zero warnings allowed.
- `npm run lint:fix`: Auto-fix lint issues where possible.
- `npm run format`: Format the repository with Prettier.
- `npm run format:check`: Verify formatting without writing changes.
- `npm run ci`: Run formatting, linting, type-checking, and production build checks.

## CI

GitHub Actions runs the `ci` script on pushes and pull requests through [`.github/workflows/ci.yml`](/Users/Strive/Projects/S-tech-1/.github/workflows/ci.yml).

Environment-specific release gates can be run manually through [`.github/workflows/release-gate.yml`](/Users/Strive/Projects/S-tech-1/.github/workflows/release-gate.yml). The selected GitHub environment should provide the same variables and secrets that `ops:preflight` expects, including `DEPLOYMENT_ENV`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD`, and `INTERNAL_CRON_SECRET`.

## Cloudflare Workers

This repo now includes checked-in OpenNext Cloudflare config via [wrangler.jsonc](/Users/Strive/Projects/S-tech-1/wrangler.jsonc), [open-next.config.ts](/Users/Strive/Projects/S-tech-1/open-next.config.ts), and [public/_headers](/Users/Strive/Projects/S-tech-1/public/_headers).

Use:

```bash
npm run preview
npm run deploy
```

Important:

- `WORKER_SELF_REFERENCE` is pinned to the Worker name `s-tech-1`, which must match the actual Worker created in Cloudflare.
- If you deploy from Cloudflare Workers Builds, set the build command to `npm run cf:build` and the deploy command to `npm run cf:deploy` so OpenNext uses the checked-in config instead of letting `npx wrangler deploy` trigger an interactive migration.
- When `DATABASE_URL` is not configured in a production build, the storefront now falls back to a read-only preview mode for catalog pages instead of crashing. Admin auth, password reset, and inquiry submission still require a managed Postgres database.
- Cloudflare Workers Builds must receive production values like `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL` during the build itself. If those are missing, the bundle will fall back to preview-mode defaults such as `http://localhost:9002`.
- Keep secrets in Cloudflare environment variables or secrets, not in `.dev.vars`.

## Operations

Operator documentation now lives under [`docs/runbooks/README.md`](/Users/Strive/Projects/S-tech-1/docs/runbooks/README.md).

Recommended launch-readiness commands:

```bash
npm run ops:preflight -- --target=staging
npm run ops:preflight -- --target=production
npm run deployment:smoke https://your-app.example.com
npm run notifications:health https://your-app.example.com
npm run db:postgres:cutover-rehearsal -- --truncate
```

## Current Production Notes

- Public storefront routes build and render successfully.
- Admin routes are protected by a signed session cookie and redirect to `/login` when unauthenticated.
- Admin authentication uses persisted users, password hashing, stored sessions, and role checks (`owner`, `manager`, `support`).
- Listings, inquiries, and platform settings persist through the active database backend and create audit events for admin-facing changes.
- Inquiry notifications now use a durable outbox with retries, manual requeue support, and optional Resend delivery.
- A protected internal runner endpoint now allows cron or a scheduler to process due notifications without an admin browser session.
- A signed Resend webhook endpoint now reconciles post-send delivery events back into the notification log.
- Storefront page views and inquiry submissions now feed a dedicated analytics event stream, and the admin analytics dashboard is backed by live rollups instead of placeholder charts.
- Public routes now ship with canonical metadata, structured data, improved robots/sitemap output, and an accessible mobile navigation experience.
- The repo now includes operator runbooks for environment management, incident response, backup and restore drills, and release checklists.
- The repo now includes a read-only deployment smoke checker plus a scripted Postgres cutover rehearsal flow for staging-style rollout practice.
- The notification pipeline now emits structured JSON logs for delivery attempts, webhook ingestion, runner health checks, and blocked worker runs.
- The cron health endpoint now returns a shared `status`, `reasons`, and `thresholds` contract for schedulers and uptime monitors.
- The cron health endpoint now reports a `DEPLOYMENT_ENV` label so uptime automation can verify it is checking the intended tier.
- GitHub Actions can run environment-specific notification uptime checks from [`.github/workflows/notification-uptime.yml`](/Users/Strive/Projects/S-tech-1/.github/workflows/notification-uptime.yml) when the staging and production cron-health secrets are configured.
- GitHub Actions can also run an environment-aware release gate from [`.github/workflows/release-gate.yml`](/Users/Strive/Projects/S-tech-1/.github/workflows/release-gate.yml) before a rollout window.
- The repo includes Postgres schema migrations plus SQLite-to-Postgres import tooling in [`docs/postgres-migration.md`](/Users/Strive/Projects/S-tech-1/docs/postgres-migration.md).
- When `DATABASE_URL` is configured, the same application API runs against Postgres at runtime. Without it, the app falls back to the local SQLite database path.
