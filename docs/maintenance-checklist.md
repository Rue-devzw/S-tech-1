# Maintenance Checklist

This checklist keeps OmniTech Solutions production-ready after launch.

## Daily

- [ ] Check `/api/health`.
- [ ] Review application error logs.
- [ ] Review failed login and suspicious auth activity.
- [ ] Check new service requests.
- [ ] Check overdue jobs and field visits.
- [ ] Review low stock.
- [ ] Review failed notification logs.
- [ ] Confirm backup job succeeded.
- [ ] Check AI fallback or provider error spikes.

## Weekly

- [ ] Review open quotations awaiting customer approval.
- [ ] Review unpaid invoices and payment mismatches.
- [ ] Review warranty claims and follow-up reminders.
- [ ] Review customer ratings and complaints.
- [ ] Review slow routes and database slow queries.
- [ ] Review storage usage and backup retention.
- [ ] Check dependency/security advisories.
- [ ] Confirm staff accounts are still appropriate.

## Monthly

- [ ] Rotate provider API keys where policy requires it.
- [ ] Review Super Admin and Manager accounts.
- [ ] Export or archive audit logs according to retention policy.
- [ ] Test restore from a recent backup in an isolated environment.
- [ ] Review inventory reorder levels and supplier records.
- [ ] Review public website content, portfolio and promotions.
- [ ] Review SEO metadata and broken links.
- [ ] Review AI costs and approval backlog.
- [ ] Review privacy/data retention requirements.

## Before Every Release

- [ ] Review merged changes.
- [ ] Run `npm run test`.
- [ ] Run `npm run test:e2e`.
- [ ] Run `npm run build`.
- [ ] Run `npm audit --omit=dev --audit-level=high`.
- [ ] Run `npm run db:migrate:status` against staging.
- [ ] Apply migrations in staging.
- [ ] Run staging smoke tests.
- [ ] Back up production database.
- [ ] Confirm rollback image/tag is available.
- [ ] Confirm release notes and operational risks.

## After Every Release

- [ ] Check `/api/health`.
- [ ] Test login.
- [ ] Test public service request.
- [ ] Test admin dashboard.
- [ ] Test technician dashboard.
- [ ] Test customer portal route.
- [ ] Review logs for 30 minutes.
- [ ] Monitor 5xx rate and database metrics.
- [ ] Confirm no failed migrations or startup loops.

## Security Maintenance

- [ ] Enforce least privilege for staff accounts.
- [ ] Disable departed staff immediately.
- [ ] Review invitation and password reset activity.
- [ ] Keep `AUTH_SECRET` secure and stable.
- [ ] Keep secrets out of Git and logs.
- [ ] Confirm rate limiting remains enabled.
- [ ] Confirm production database is not publicly exposed.
- [ ] Confirm file storage is private.
- [ ] Review AI prompts/logs for redaction and approval compliance.

## Backup Maintenance

- [ ] Daily encrypted database backup.
- [ ] Point-in-time recovery enabled where supported.
- [ ] File storage versioning enabled.
- [ ] Backup retention policy applied.
- [ ] Restore drill completed at least quarterly.
- [ ] Restore documentation updated after every drill.

## Documentation Maintenance

- [ ] Update docs when routes, roles or workflows change.
- [ ] Update screenshots or descriptions after major UI changes.
- [ ] Keep `.env.example` aligned with code.
- [ ] Keep seed account notes limited to non-production environments.
- [ ] Update deployment runbook after infrastructure changes.

## Brand and Content Maintenance

- [ ] Confirm public pages reflect: We repair. We connect. We build. We automate.
- [ ] Keep Starlink wording independent unless official status is explicitly approved.
- [ ] Remove stale promotions.
- [ ] Keep portfolio privacy controls accurate.
- [ ] Review blog content for relevance and accuracy.
