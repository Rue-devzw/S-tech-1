# Release Checklist

## Goal

Ship a production change with consistent checks before, during, and after rollout.

## Pre-Release

1. Pull the target branch and confirm scope.
2. Run repo validation:

```bash
npm run ci
npm run test:e2e
```

3. Run environment preflight for the target tier:

```bash
npm run ops:preflight -- --target=staging
```

4. Rehearse any managed Postgres cutover before the release window:

```bash
npm run db:postgres:cutover-rehearsal -- --truncate
```

5. If the release includes schema changes:

```bash
npm run db:postgres:migrate
```

6. Confirm notification worker health in staging:

```bash
npm run notifications:health https://staging.example.com
```

7. Confirm the staging deployment still serves the expected public routes:

```bash
npm run deployment:smoke https://staging.example.com
```

8. Optionally run the GitHub Actions release gate for the target tier from [`.github/workflows/release-gate.yml`](/Users/Strive/Projects/S-tech-1/.github/workflows/release-gate.yml).

9. Review open risks:
   - migrations
   - auth changes
   - notification delivery changes
   - admin workflow changes

## Release Window

1. Announce release start in the team channel.
2. Deploy the new application version.
3. Apply any pending Postgres migrations if not handled automatically by startup.
4. Smoke-check the public surface:
   - `/`
   - `/store`
   - `/listing/st-003`
5. Smoke-check the admin surface:
   - `/login`
   - `/admin`
   - `/admin/leads`
   - `/admin/team`
6. Run health checks:

```bash
npm run deployment:smoke https://your-app.example.com
npm run notifications:health https://your-app.example.com
```

## Post-Release

1. Verify error tracking and alert channels are quiet.
2. Confirm notifications still dispatch:

```bash
npm run notifications:dispatch https://your-app.example.com 5
```

3. Confirm analytics events are still flowing by loading `/admin/analytics`.
4. Record any migrations or operator actions taken during the release.

## Rollback

Rollback triggers:

- login failures for valid admins
- elevated 5xx rate
- blocked notification worker with due backlog
- bad schema migration or unrecoverable data error

Rollback steps:

1. Re-deploy the last known good application revision.
2. Re-run public and admin smoke checks.
3. If a migration caused the issue, stop and assess whether rollback is application-only or data-involved.
4. If customer data was corrupted, move to the backup/restore runbook before further writes.

## Release Notes Template

Use this structure in the deploy channel:

- Release id / commit:
- Scope:
- Migrations applied:
- Manual checks completed:
- Rollback owner:
- Follow-up items:
