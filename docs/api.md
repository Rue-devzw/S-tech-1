# OmniTech Solutions API Documentation

The platform uses Next.js route handlers as a REST API. Authentication is cookie-session based through `/api/auth/login`; protected endpoints use role-based permission checks.

Machine-readable endpoint summary is available at `GET /api/docs`.

## Base URL

- Local: `http://localhost:3000`
- Staging/Production: configured by `APP_URL`

## Authentication

Login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@omnitech.io",
  "password": "OmniTech#2026"
}
```

The API sets an HTTP-only session cookie. Browser clients should use same-origin requests so the cookie is sent automatically.

Auth endpoints:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/auth/register` | `POST` | Customer self-registration. |
| `/api/auth/login` | `POST` | Staff/customer login. |
| `/api/auth/logout` | `POST` | Clear current session. |
| `/api/auth/me` | `GET` | Return current session user. |
| `/api/auth/invitations` | `POST` | Admin invitation flow. Requires `settings:manage`. |
| `/api/auth/invitations/accept` | `POST` | Accept invitation and set password. |
| `/api/auth/password-reset/request` | `POST` | Request reset instructions. |
| `/api/auth/password-reset/confirm` | `POST` | Complete password reset. |

Security notes:

- Reset and invitation tokens are never returned in API responses.
- High-risk auth endpoints are rate limited.
- Password reset errors are generic to reduce token enumeration.

## Response Conventions

Success list:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "pageCount": 0
  }
}
```

Success object:

```json
{
  "resourceName": {}
}
```

Error response:

```json
{
  "error": "Validation failed.",
  "details": {}
}
```

Common statuses:

| Status | Meaning |
| --- | --- |
| `400` | Invalid payload or invalid workflow transition. |
| `401` | Not logged in. |
| `403` | Logged in but missing permission. |
| `404` | Resource not found where implemented. |
| `409` | Conflict such as existing account. |
| `429` | Rate limit exceeded. |
| `500` | Unexpected server error. |

## Pagination and Filtering

Most collection endpoints accept:

| Query | Description |
| --- | --- |
| `page` | 1-based page number. |
| `pageSize` | 1 to 100. |
| `q` | Search text where supported. |
| `status` | Status enum where supported. |
| `sort` | Sort field where supported. |
| `order` | `asc` or `desc`. |
| `from`, `to` | Date filters where supported. |

## Endpoint Map

| Module | Endpoints | Permission |
| --- | --- | --- |
| Health | `GET /api/health` | Public operational check. |
| Auth | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/invitations`, `/api/auth/password-reset/*` | Public or admin invitation flow. |
| Customers | `GET/POST /api/admin/customers` | `customers:manage`. |
| Services | `GET /api/services`, `GET/POST /api/admin/services` | Public, `settings:manage`. |
| Requests | `POST /api/service-requests`, `GET /api/admin/requests` | Public intake, `requests:manage`. |
| Jobs | `GET /api/admin/jobs`, job workflow endpoints under `/api/admin/jobs/{id}` | `jobs:manage` or `jobs:update_assigned`. |
| Repair Module | `/api/admin/repairs/*` | `jobs:manage` or `jobs:update_assigned`. |
| Starlink Module | `/api/starlink/*`, `/api/admin/starlink/*` | Public intake or `field_visits:manage`. |
| Quotations | `GET/POST /api/admin/billing/quotations`, quotation action routes | `quotes:manage`. |
| Invoices | `GET /api/admin/billing/invoices`, document routes under `/api/billing/documents` | `invoices:manage`. |
| Payments | `POST /api/admin/billing/payments`, `POST /api/admin/payments` | `payments:record`. |
| Inventory | `GET/POST /api/admin/inventory` | `inventory:manage`. |
| Appointments | `GET/POST /api/admin/appointments`, `/api/admin/field-service/*` | `field_visits:manage`. |
| Technician | `/api/technician/jobs/{id}/status`, `/notes`, `/checklists` | `jobs:update_assigned`. |
| Notifications | `/api/admin/communications/*` | `notifications:manage`. |
| Promotions | `GET/POST /api/admin/promotions` | `promotions:manage`. |
| Portfolio | `GET/POST /api/admin/portfolio/projects`, `GET/POST /api/admin/portfolio/testimonials` | `content:manage`. |
| Blog | `GET/POST /api/admin/blog/posts` | `content:manage`. |
| AI | `POST /api/ai/assist`, `/api/admin/ai/interactions` | `ai:use`, `ai:approve`. |
| Reports | `GET /api/admin/reports/operations` | `reports:view`. |
| Settings | `GET/POST /api/admin/settings` | `settings:manage`. |

## Core Workflow Example

1. Customer submits request:

```http
POST /api/service-requests
```

2. Admin reviews request and creates job:

```http
POST /api/admin/workflow/review
```

3. Technician/admin records diagnosis:

```http
POST /api/admin/jobs/{id}/diagnosis
```

4. Admin creates quotation:

```http
POST /api/admin/jobs/{id}/quotation
```

5. Customer approves or rejects quotation:

```http
POST /api/customer/quotations/{id}/decision
```

6. Admin allocates parts, transitions job and issues invoice:

```http
POST /api/admin/jobs/{id}/parts
POST /api/admin/jobs/{id}/transition
POST /api/admin/jobs/{id}/invoice
```

7. Admin records payment and warranty:

```http
POST /api/admin/payments
POST /api/admin/jobs/{id}/warranty
```

## Validation

Payload validation uses Zod schemas in `src/server/validation.ts`.

Important validation rules:

- Passwords require strong minimum length.
- File references require safe filenames and managed `/storage/...` or HTTPS URLs.
- Pagination has a maximum page size of 100.
- Customer-facing AI output requires approval where configured.
- Workflow transitions must use known status enums.

## Audit Logging

Sensitive operations create audit logs, including:

- Login success/failure.
- Password reset.
- Invitation creation.
- Job workflow changes.
- Quotation/invoice/payment actions.
- AI interactions and approvals.
- System setting updates.

Audit metadata must not contain raw passwords, tokens or secret values.
