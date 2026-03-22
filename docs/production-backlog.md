# Production Execution Backlog

This backlog turns the repo assessment into executable work. Tickets are grouped by phase and ordered by delivery priority.

## Phase 1

### P1-01: Production Config Guardrails
- Status: Completed
- Goal: Prevent invalid auth, notification, and scheduler configurations from reaching runtime.
- Scope:
  - Validate notification provider requirements before saving settings.
  - Validate session timeout values before persisting security settings.
  - Add reusable environment-backed capability checks.
- Acceptance criteria:
  - Admin cannot save `resend` delivery mode when required server env is missing.
  - Invalid security timeout values are rejected by the API with actionable errors.

### P1-02: Real Session Security Enforcement
- Status: Completed
- Goal: Make the admin security settings influence actual runtime behavior.
- Scope:
  - Use saved `sessionTimeout` to control new admin session TTL.
  - Clamp invalid timeout values to a safe fallback.
  - Enforce strong-password policy during admin user creation when enabled.
- Acceptance criteria:
  - New admin sessions honor configured timeout minutes.
  - Strong-password policy blocks weak newly created admin passwords.

### P1-03: Storefront Server Rendering
- Status: Completed
- Goal: Move public catalog pages from client hydration to server-driven rendering.
- Scope:
  - Refactor `/`, `/store`, and `/listing/[id]` to fetch listings on the server.
  - Keep interactive UI client-only where necessary.
- Acceptance criteria:
  - Listing content is present in initial HTML for public pages.
  - Public pages no longer depend on `useListings()` for first paint.

### P1-04: Automated Browser Smoke Coverage
- Status: Completed
- Goal: Add repeatable end-to-end verification for critical journeys.
- Scope:
  - Install Playwright.
  - Add smoke tests for home, store, listing detail, inquiry submit, login, and admin CRUD basics.
  - Wire tests into CI.
- Acceptance criteria:
  - CI runs browser smoke tests on pull requests.
  - Failures clearly identify the broken journey.

### P1-05: Public Endpoint Abuse Protection
- Status: Completed
- Goal: Reduce brute-force and spam risk on public mutation endpoints.
- Scope:
  - Add rate limiting to `/api/session`.
  - Add rate limiting and basic anti-spam controls to `/api/inquiries`.
  - Add audit visibility for throttled events.
- Acceptance criteria:
  - Excessive requests receive deterministic throttling responses.
  - Normal traffic remains unaffected.

### P1-06: Managed Database Migration Foundation
- Status: Completed
- Goal: Prepare the app to move off local SQLite.
- Scope:
  - Choose Postgres driver or ORM strategy.
  - Define schema migration workflow.
  - Add deployment and local setup documentation.
- Acceptance criteria:
  - Schema can be recreated from migrations.
  - Development and deployment instructions are documented.

### P1-07: Runtime Database Cutover
- Status: Completed
- Goal: Replace the SQLite-backed runtime store with a Postgres-backed implementation behind the same application API.
- Scope:
  - Preserve the existing `data-store` export surface.
  - Add runtime backend selection between SQLite fallback and Postgres.
  - Validate the app against a Postgres-backed end-to-end smoke run.
- Acceptance criteria:
  - When `DATABASE_URL` is set, listings, inquiries, admin auth, settings, notifications, and audits use Postgres.
  - Existing callers continue importing the same `data-store` module without code changes.

## Phase 2

### P2-01: Admin Identity Lifecycle
- Status: Completed
- Goal: Replace bootstrap-style access with a real admin identity workflow.
- Scope:
  - Password reset.
  - Session revocation.
  - MFA enrollment and verification.
  - Strong password enforcement for resets as well as creation.
- Acceptance criteria:
  - Admins can recover access without DB edits.
  - Security settings map to implemented behavior.

### P2-02: Notification Worker Hardening
- Status: Completed
- Goal: Make outbound notification delivery observable and operationally safe.
- Scope:
  - Dedicated scheduled dispatch workflow.
  - Queue health metrics and dead-letter visibility.
  - Better operator feedback for failed delivery configuration.
- Acceptance criteria:
  - Notification failures are visible without reading raw DB rows.
  - Retry and dead-letter behavior is documented and testable.

### P2-03: Observability Baseline
- Status: Completed
- Goal: Add production diagnostics and incident visibility.
- Scope:
  - Error tracking.
  - Structured request logs.
  - Health checks and uptime monitoring.
  - Deploy and cron alerting.
- Acceptance criteria:
  - App errors and failed jobs are visible in one observability surface.
  - Operators can identify regressions quickly.

### P2-04: Real Analytics Pipeline
- Status: Completed
- Goal: Replace demo analytics with tracked product events and rollups.
- Scope:
  - Define storefront and admin events.
  - Persist or ship analytics events.
  - Replace hard-coded charts in admin analytics.
- Acceptance criteria:
  - Admin analytics reflect real application behavior.
  - Demo metric constants are removed from the analytics page.

## Phase 3

### P3-01: Domain Model Cleanup
- Status: Completed
- Goal: Align routes, page names, and data structures with real product concepts.
- Scope:
  - Split team access from customers and leads.
  - Revisit catalog, inquiry, and sales terminology.
  - Normalize admin information architecture.
- Acceptance criteria:
  - Route names match the entity shown on screen.
  - Admin navigation is internally consistent.

### P3-02: Performance, Accessibility, and SEO Hardening
- Status: Completed
- Goal: Make public pages launch-ready from a quality perspective.
- Scope:
  - Lighthouse budgets.
  - Accessibility audit and fixes.
  - Metadata and structured data review.
  - Image and content optimization.
- Acceptance criteria:
  - Public routes meet agreed performance and accessibility thresholds.

### P3-03: Ops Runbooks and Launch Readiness
- Status: Completed
- Goal: Make the product maintainable under real production conditions.
- Scope:
  - Incident runbooks.
  - Backup and restore drill docs.
  - Environment management guide.
  - Release checklist.
- Acceptance criteria:
  - Core operational procedures are documented and rehearsed.

### P3-04: Deployment Automation and Cutover Rehearsal
- Status: Completed
- Goal: Turn launch-readiness docs into executable deployment checks.
- Scope:
  - Add an environment-aware release gate workflow.
  - Add a read-only deployment smoke checker for live staging and production URLs.
  - Automate a local Postgres cutover rehearsal against the production build.
- Acceptance criteria:
  - Operators can run a scripted cutover rehearsal before rollout.
  - GitHub Actions can validate the selected target tier before a release.
