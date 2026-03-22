# Ops Runbooks

This folder collects the operator-facing procedures needed to launch and maintain S-Tech Studios in production.

## Runbook Index

- [`environment-management.md`](/Users/Strive/Projects/S-tech-1/docs/runbooks/environment-management.md): Environment tiers, required secrets, rotation policy, and ownership guidance.
- [`release-checklist.md`](/Users/Strive/Projects/S-tech-1/docs/runbooks/release-checklist.md): Pre-release, release, rollback, and post-release checks.
- [`incident-response.md`](/Users/Strive/Projects/S-tech-1/docs/runbooks/incident-response.md): Triage flow for app, auth, and notification incidents.
- [`backup-and-restore.md`](/Users/Strive/Projects/S-tech-1/docs/runbooks/backup-and-restore.md): Backup cadence plus restore drills for Postgres and SQLite fallback.

## Quick Commands

```bash
npm run ops:preflight -- --target=staging
npm run ops:preflight -- --target=production
npm run db:postgres:migrate
npm run db:postgres:cutover-rehearsal -- --truncate
npm run deployment:smoke https://your-app.example.com
npm run db:postgres:verify
npm run notifications:health https://your-app.example.com
npm run notifications:dispatch https://your-app.example.com 20
```
