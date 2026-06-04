# OmniTech Solutions Platform Architecture

Tagline: **We repair. We connect. We build. We automate.**

## Architecture decisions

- Next.js App Router provides public pages, portals and API routes for the MVP while preserving a path to a separate NestJS service later.
- PostgreSQL with Prisma is the source of truth for users, customers, services, requests, job cards, quotes, invoices, inventory, content, notifications and audit logs.
- Authentication uses signed HTTP-only cookies, bcrypt password hashing and role-based authorization helpers.
- Communications are provider abstractions first: email, SMS and WhatsApp notifications are queued and can be connected to Resend, Twilio, WhatsApp Cloud API or local providers.
- AI is provider-agnostic through `src/server/providers/ai.ts`, ready for diagnostics, advert drafting, report generation and FAQ/chatbot answers.
- Storage is represented by attachment records and environment-driven storage settings; local and S3-compatible implementations can be added behind the same model.

## Phase 1 implemented

- Public website and company profile.
- Services catalogue.
- Service request intake with validation, customer creation, audit log and notification queue.
- Admin operations dashboard.
- Technician dashboard.
- Customer portal shell with real records.
- Starlink, networking, repair, software and automation service lanes.
- Quote, invoice, inventory, CRM, warranty-ready and audit database models.
- Portfolio, testimonials, knowledge centre and promotions content models/pages.
- Secure password auth foundation and RBAC checks.
- Seed data for admin, technician, customer, services, request, job, quote, invoice, inventory and content.

## Permissions

- `SUPER_ADMIN`, `ADMIN`, `MANAGER`: full admin dashboard, job creation, quote creation and AI tools.
- `SALES`: quote creation and sales workflows.
- `TECHNICIAN`: technician dashboard and job updates.
- `CUSTOMER`: customer portal.
- Anonymous users: public pages and request intake.

## Validation rules

- Intake requires customer name, phone, service, title and detailed description.
- Login requires valid email and 8+ character password.
- Job updates are constrained to known operational statuses.
- Quote line items require description, positive quantity and non-negative price.
- AI prompts are length-limited and restricted to known assistant modes.

## Error cases

- Invalid form payloads return `400` with structured validation details.
- Unauthenticated or unauthorized protected API calls return `403`.
- Missing service requests during job creation return a controlled error.
- Unknown server errors are logged and returned as generic messages.

## Acceptance criteria

- A visitor can view services and submit a service request.
- The system creates or updates the customer CRM record during intake.
- Intake creates an audit log and queues a notification.
- Admin users can sign in and see live operational metrics from the database.
- Technicians can sign in and see assigned jobs.
- Customer users can see their requests, jobs and invoices once linked.
- Seed data demonstrates Starlink, repair, networking, software and automation workflows.

## Remaining phases

- Phase 2: full CRUD screens for job cards, quotes, invoices, receipts and inventory movements.
- Phase 3: field scheduling calendar, Starlink/networking checklists, evidence uploads and warranty certificates.
- Phase 4: WhatsApp/SMS/email provider integrations, templates and delivery monitoring.
- Phase 5: AI provider implementation, chatbot widget, report generator and advert approval workflow.
- Phase 6: analytics dashboards, exportable reports, backups, observability, rate limiting and deployment hardening.
