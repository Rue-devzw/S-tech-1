# Environment Management

## Goal

Keep local, staging, and production environments predictable, auditable, and safe to operate.

## Environment Tiers

- `local`: Developer workstation using `.env.local`. SQLite is acceptable here.
- `staging`: Production-like environment for migrations, smoke tests, and operator rehearsal. Postgres should be enabled.
- `production`: Customer-facing environment. Postgres, cron, observability, and alerting should all be enabled.

## Required Variables By Tier

### All Tiers

- `DEPLOYMENT_ENV`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_DISPLAY_NAME`

### Staging And Production

- `DATABASE_URL`
- `INTERNAL_CRON_SECRET`
- `NOTIFICATION_FROM_EMAIL`
- `NOTIFICATION_FROM_NAME`

### Strongly Recommended For Production

- `RESEND_API_KEY`
- `RESEND_WEBHOOK_SECRET`
- `SENTRY_DSN`
- `NOTIFICATION_ALERT_WEBHOOK_URL`

## Validation Command

Run this before a deploy or after any secret rotation:

```bash
npm run ops:preflight -- --target=staging
npm run ops:preflight -- --target=production
```

What it checks:

- Deployment tier label matches the target environment.
- Public URL is not localhost outside local development.
- Public URL uses HTTPS outside local development.
- Session secret length.
- Default bootstrap password replacement.
- Postgres presence for non-local targets.
- Cron secret presence.
- Optional observability and notification secrets.

## Secret Handling Rules

- Store environment variables in your deployment platform secret manager, not in git.
- Keep `.env.local` for local-only secrets.
- Set `DEPLOYMENT_ENV=staging` in staging and `DEPLOYMENT_ENV=production` in production so health checks and release automation can verify the target tier.
- Do not share the seeded owner password across people. Create named admin users through `/admin/team`.
- Rotate `ADMIN_SESSION_SECRET`, `INTERNAL_CRON_SECRET`, `RESEND_API_KEY`, and `RESEND_WEBHOOK_SECRET` on schedule or after suspected exposure.

## Rotation Guidance

### Session Secret Rotation

1. Generate a new `ADMIN_SESSION_SECRET`.
2. Update staging and verify admin login still works.
3. Roll the same change to production during a low-risk window.
4. Expect existing admin sessions to be invalidated.

### Cron Secret Rotation

1. Generate a new `INTERNAL_CRON_SECRET`.
2. Update the deployed app secret.
3. Update any scheduler or uptime check using the cron endpoint.
4. Run:

```bash
npm run notifications:health https://your-app.example.com
```

### Resend Secret Rotation

1. Rotate `RESEND_API_KEY` in the Resend dashboard.
2. Rotate `RESEND_WEBHOOK_SECRET` after updating webhook signing settings.
3. Verify delivery and reconciliation:

```bash
npm run notifications:dispatch https://your-app.example.com 5
npm run notifications:health https://your-app.example.com
```

## Ownership

- Engineering owns schema, migrations, release automation, and health endpoints.
- Product or operations owns release timing and stakeholder comms.
- On-call owner must have access to:
  - deployment platform logs
  - Postgres backups
  - cron/scheduler configuration
  - Sentry or alert webhook target
