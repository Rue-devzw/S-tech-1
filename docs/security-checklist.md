# OmniTech Solutions Security Checklist

Brand promise: We repair. We connect. We build. We automate.

This checklist records the production security review for authentication, authorization, validation, file handling, rate limiting, auditability, secrets, backups, customer privacy, admin controls and AI data handling.

## Fixed in this pass

- [x] Password reset request responses no longer return raw reset tokens.
- [x] User invitation responses no longer return raw invitation tokens.
- [x] Login, customer registration, password reset request, password reset confirmation and invitation creation now have application-level rate limits.
- [x] Password reset confirmation now uses a generic failure response to avoid token-validity enumeration.
- [x] Technician API routes are covered by middleware role checks in addition to route-level permission checks.
- [x] Device, site and field photo references now require safe filenames and either managed `/storage/...` paths or HTTPS URLs.
- [x] AI prompts, provider calls and AI interaction logs redact emails, phone numbers, secrets, tokens, API keys and sensitive context keys before persistence.
- [x] System setting changes are audit logged without writing secret values into audit metadata.
- [x] Login password fields include browser autocomplete hints for safer password-manager behavior.
- [x] Regression tests cover token non-disclosure, technician API middleware protection, rate limiting, redaction and file-reference validation.

## Authentication and sessions

- [x] Passwords are hashed server-side before storage.
- [x] Session cookies are HTTP-only, same-site and secure in production.
- [x] Account status is checked before login.
- [x] Password reset tokens are hashed at rest, expire and are one-time use.
- [x] Active sessions are revoked after password reset.
- [ ] Enforce MFA for Super Admin and Manager roles before production.
- [ ] Add account lockout escalation and admin unlock workflow after repeated failed logins.

## Authorization and admin permissions

- [x] Admin, technician and customer areas are protected by role-aware middleware.
- [x] API routes use permission checks for sensitive operations.
- [x] Technicians are separated from financial and settings permissions unless explicitly granted.
- [ ] Run a permission-matrix review before each release that adds a module or role.
- [ ] Add break-glass Super Admin access procedure with monitoring.

## Input validation and file handling

- [x] Core API payloads use Zod validation schemas.
- [x] File reference payloads reject unsafe schemes and path traversal-style filenames.
- [ ] When binary upload endpoints are added, enforce MIME sniffing, size limits, malware scanning, private object ACLs and signed download URLs.
- [ ] Strip EXIF metadata from customer photos before public display.

## Rate limiting and abuse controls

- [x] High-risk auth endpoints have in-process rate limiting.
- [ ] Replace or back the limiter with Redis, a WAF or platform-native edge limits in distributed production deployments.
- [ ] Add per-account throttles for quotation approval, manual messaging and AI generation endpoints.

## Audit logging

- [x] Login success/failure, password reset, invitation, workflow, AI and system-setting events are audit logged.
- [x] Secret setting values are masked in API responses and excluded from audit metadata.
- [ ] Ship audit logs to append-only storage or a SIEM in production.
- [ ] Define audit retention, export and tamper-evidence policy.

## Secrets management

- [x] Runtime configuration is environment-variable driven.
- [x] Secret settings are masked in admin responses.
- [ ] Store production secrets in a managed secret store, not plain `.env` files.
- [ ] Rotate `AUTH_SECRET`, AI provider keys, mail/SMS/WhatsApp keys and database credentials on a documented schedule.
- [ ] Block builds or deployments when required secrets are missing or too weak.

## Database exposure and backups

- [x] Prisma is the only application database access path.
- [ ] Production PostgreSQL must be private-network only, with TLS required and no public internet exposure.
- [ ] Use least-privilege database users for app runtime, migrations and backups.
- [ ] Enable daily encrypted backups, point-in-time recovery and quarterly restore drills.
- [ ] Monitor failed connections, slow queries and privileged schema changes.

## Customer privacy

- [x] AI logs redact direct identifiers and secrets before storage.
- [x] Technician views are scoped away from sensitive finance/settings data.
- [ ] Define data retention for customer photos, invoices, messages and warranty records.
- [ ] Add customer data export and deletion workflows where legally required.
- [ ] Require explicit consent before marketing messages.

## AI data handling

- [x] AI service is provider-agnostic and falls back safely.
- [x] Customer-facing AI output requires human approval.
- [x] Sensitive AI input/context is redacted before prompt rendering, provider submission and database logging.
- [x] AI interactions track provider, model, token counts, cost estimate and safety flags.
- [ ] Use a provider contract that prevents model training on OmniTech/customer data.
- [ ] Add per-role AI usage limits and management cost alerts.

## Production release gate

- [ ] Run unit, integration, E2E, accessibility and RBAC regression tests.
- [ ] Confirm all high-risk findings are fixed or formally accepted.
- [ ] Verify backups and restore.
- [ ] Verify HTTPS, HSTS, CSP, secure cookies and proxy headers in staging.
- [ ] Verify staging and production databases, storage buckets and credentials are fully separated.
