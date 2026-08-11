# OmniTech Solutions Platform

We repair. We connect. We build. We automate.

OmniTech Solutions is a production-oriented technology services platform for electronics repairs, phone repairs, PC/laptop repairs, TV and general electronics servicing, upgrades, networking, network infrastructure, Starlink-related installation support, web development, software engineering, mobile apps, AI-powered applications, automation systems and digital transformation services.

The platform includes a public website, service request intake, customer portal, admin dashboard, technician dashboard, job cards, field scheduling, quotations, invoices, receipts, inventory, CRM history, communication workflows, promotions, portfolio, blog/knowledge centre, AI assistant functions, reporting and audit logs.

## Stack

- Next.js 15 with React and TypeScript.
- Tailwind CSS.
- PostgreSQL.
- Prisma ORM.
- Cookie-session authentication with role-based access control.
- Docker-ready standalone Next.js runtime.
- Provider abstractions for storage, notifications and AI.

## Quick Start

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:migrate:dev
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Development seed accounts:

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@omnitech.io` | `OmniTech#2026` |
| Technician | `tech@omnitech.io` | `OmniTech#2026` |
| Sales/Marketing | `sales@omnitech.io` | `OmniTech#2026` |

Replace seed credentials before production launch.

## Important Routes

| Area | Route |
| --- | --- |
| Public website | `/` |
| Services | `/services` |
| Request service | `/request-service` |
| Track repair | `/track-repair` |
| Login | `/login` |
| Customer registration | `/customer/register` |
| Customer portal | `/customer` |
| Admin dashboard | `/admin` |
| Technician dashboard | `/technician` |
| Health check | `/api/health` |
| Machine-readable API summary | `/api/docs` |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development server. |
| `npm run build` | Generate Prisma client and build production app. |
| `npm run start` | Start built production app. |
| `npm run typecheck` | Run TypeScript checks. |
| `npm run test` | Run unit and integration tests. |
| `npm run test:e2e` | Run Playwright tests. |
| `npm run test:qa` | Run typecheck, unit, integration and E2E tests. |
| `npm run db:generate` | Generate Prisma client. |
| `npm run db:migrate:dev` | Create/apply local migrations. |
| `npm run db:migrate:deploy` | Apply committed migrations in staging/production. |
| `npm run db:migrate:status` | Check migration status. |
| `npm run db:seed` | Load realistic fictional seed data. |
| `npm run docker:build` | Build local Docker image. |
| `npm run docker:up` | Start Docker Compose stack. |
| `npm run docker:down` | Stop Docker Compose stack. |
| `npm run vercel:pull` | Pull linked Vercel project environment into `.env.local`. |
| `npm run vercel:migrate` | Apply Prisma migrations to the configured Vercel/Postgres database. |
| `npm run vercel:deploy` | Run QA and deploy the app to Vercel production. |
| `npm run healthcheck` | Check `/api/health`. |

## Docker Workflow

```bash
cp .env.example .env
docker compose up --build
docker compose --profile tools run --rm migrate
docker compose --profile tools run --rm seed
```

Create a local backup:

```bash
docker compose --profile tools run --rm backup
```

## Documentation Pack

- [Documentation index](docs/README.md)
- [Installation guide](docs/installation.md)
- [Environment setup](docs/environment-setup.md)
- [Database migration guide](docs/database-migrations.md)
- [Admin user manual](docs/admin-user-manual.md)
- [Technician user manual](docs/technician-user-manual.md)
- [Customer portal guide](docs/customer-portal-guide.md)
- [API documentation](docs/api.md)
- [Troubleshooting guide](docs/troubleshooting.md)
- [Deployment guide](docs/deployment.md)
- [Vercel deployment guide](docs/vercel-deployment.md)
- [Maintenance checklist](docs/maintenance-checklist.md)
- [Architecture](docs/architecture.md)
- [Security checklist](docs/security-checklist.md)
- [QA strategy](docs/qa-strategy.md)
- [Design system](docs/design-system.md)

## Production Readiness Notes

Before launch:

- Set a strong `AUTH_SECRET`.
- Use Prisma Postgres or Neon Postgres through Vercel Marketplace.
- Use the dedicated GitHub `product-media` branch for public product pictures and Vercel Blob for private file evidence.
- Run `npm run db:migrate:deploy`; do not use `db push`.
- Connect reviewed email, SMS and WhatsApp providers.
- Connect AI provider only after data/privacy approval.
- Enforce production backups and restore drills.
- Enable centralized logging and monitoring.
- Run the release checklist in [deployment.md](docs/deployment.md).

## Security

The platform includes secure password hashing, HTTP-only session cookies, route-level permissions, middleware protection, auth rate limiting, safe file-reference validation, audit logging, masked secret settings and AI prompt/context redaction.

Review [security-checklist.md](docs/security-checklist.md) before production launch.
