# OmniTech Solutions QA Strategy

## Quality Goals

OmniTech must be reliable for public customers, internal administrators, technicians and managers. QA coverage focuses on the brand promise: repair workflows must be traceable, connectivity/field work must be scheduled and documented, digital systems must be secure, and automation must remain human-approved where customer-facing.

## Test Layers

| Layer | Scope | Tooling | Command |
| --- | --- | --- | --- |
| Static checks | TypeScript, route compile safety | `tsc`, Next build | `npm run typecheck`, `npm run build` |
| Unit tests | Validation schemas, RBAC rules, pure helpers | Node test runner + `tsx` | `npm run test:unit` |
| Integration tests | Workflow contracts, Prisma schema health, API route inventory | Node test runner + `tsx` | `npm run test:integration` |
| API tests | Public docs, auth protection, REST response shape | Playwright request API | `npm run test:e2e` |
| End-to-end tests | Public intake, navigation, protected routes, workflow smoke paths | Playwright browser | `npm run test:e2e` |
| Accessibility checks | Landmarks, labels, headings, keyboard-visible controls | Playwright assertions | `npm run test:e2e` |
| Regression tests | Core workflow acceptance scenarios and route inventory | Node + Playwright | `npm run test:qa` |

## Required Coverage

- Unit: Zod validation for forms and APIs, RBAC permission rules, status transition payloads, AI approval input, content publishing payloads.
- Integration: Prisma schema validation, route presence for required modules, workflow payload acceptance from service request through warranty.
- E2E: public website, service request form, login redirect for protected areas, admin/technician/customer route protection.
- Accessibility: form labels, headings, landmark roles, focusable CTAs, mobile viewport smoke test.
- API: `/api/docs`, unauthenticated protected API returns `403`, list response conventions, validation error shape.
- Database: `prisma validate`, schema model/index presence for core entities, seed-data compatibility through TypeScript checks.
- RBAC: customer/technician/admin separation, `manage` vs `view` permissions, AI approval permission.

## Core Workflow Acceptance Test

The core service workflow is accepted when the following can be completed without validation errors and with audited state changes in implementation paths:

1. Service request submitted with customer contact, service, title, description, urgency and preferred date.
2. Admin reviews the request and creates a job card with optional device or appointment details.
3. Technician records diagnosis with symptoms, findings, recommendation, estimate and final/draft state.
4. Admin creates quotation with line items, labour/service/parts charges, discount and tax-ready totals.
5. Customer approves or rejects quotation.
6. Approved work moves through parts allocation, repair/installation, testing and completion status.
7. Invoice is issued or generated from quotation.
8. Payment is recorded against invoice.
9. Receipt is generated and warranty is created with coverage, terms and expiry date.

## Release Gate

Before production release:

```bash
npm run typecheck
DATABASE_URL="postgresql://..." npx prisma validate
npm run test
DATABASE_URL="postgresql://..." AUTH_SECRET="..." npm run build
npm run test:e2e
```

Any failed RBAC, payment, warranty, notification or customer-facing workflow test blocks release.
