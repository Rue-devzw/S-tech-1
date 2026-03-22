# Incident Response

## Goal

Triage and stabilize common production incidents quickly with a shared language and first-response checklist.

## First Five Minutes

1. Confirm impact:
   - public storefront
   - admin-only
   - notifications only
   - scheduled jobs only
2. Capture the exact failure:
   - URL
   - status code
   - timestamp
   - affected environment
3. Check current deploy and recent changes.
4. Decide whether to:
   - mitigate in place
   - disable a feature
   - roll back

## Incident Types

### Public Site Down Or Returning 5xx

Immediate checks:

- Deployment logs
- Runtime error logs
- Recent deploy or migration
- `/robots.txt` and `/sitemap.xml` only if crawl-related, not app outage

Actions:

1. Roll back to the previous stable deploy if customer impact is broad.
2. Verify `/`, `/store`, and a listing detail page.
3. If the failure started after schema changes, confirm migration state.

### Admin Login Failing

Immediate checks:

- `ADMIN_SESSION_SECRET` changes
- cookie domain / site URL mismatch
- database connectivity
- owner account status in admin users table

Actions:

1. Confirm `/login` loads.
2. Check whether failures affect all admins or one user.
3. If it is user-specific, use `/admin/team` after gaining access with another owner.
4. If it is global, treat as release rollback candidate.

### Notification Worker Blocked

Immediate checks:

```bash
npm run notifications:health https://your-app.example.com
```

Look for:

- blocked status
- due backlog
- dead letters
- missing provider config

Actions:

1. Restore missing env (`RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, or cron secret).
2. Re-run health.
3. Dispatch a small batch:

```bash
npm run notifications:dispatch https://your-app.example.com 5
```

4. Escalate if dead letters continue to rise after config is restored.

### Bad Migration Or Data Integrity Problem

Immediate checks:

- last applied migration
- row counts
- whether writes are still happening

Actions:

1. Freeze further risky changes.
2. Decide whether an app rollback is enough.
3. If data repair is needed, follow the backup and restore runbook.
4. Log exact affected tables before restoration.

## Comms Template

- Impact:
- Start time:
- Suspected cause:
- Current mitigation:
- Next update:

## Exit Criteria

Do not close the incident until:

- primary user journey is working again
- alerts are clear or understood
- release state is documented
- follow-up remediation is captured in the backlog
