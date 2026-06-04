# Installation Guide

This guide installs OmniTech Solutions for local development or production-like Docker testing.

## Prerequisites

- Node.js 22 LTS.
- npm 10 or newer.
- Docker Desktop or Docker Engine with Compose.
- PostgreSQL client tools if you want to run backup/restore scripts from the host.
- Git.

## Local Development Install

1. Clone the repository and enter the project folder.

```bash
git clone <repository-url>
cd S-tech-1
```

2. Create a local environment file.

```bash
cp .env.example .env
```

3. Start PostgreSQL.

```bash
docker compose up -d postgres
```

4. Install dependencies.

```bash
npm install
```

5. Apply migrations and seed sample data.

```bash
npm run db:migrate:dev
npm run db:seed
```

6. Start the development server.

```bash
npm run dev
```

7. Open `http://localhost:3000`.

## Production-Like Docker Install

1. Create the environment file.

```bash
cp .env.example .env
```

2. Build and start the stack.

```bash
docker compose up --build
```

3. In another terminal, run migrations and seed data when needed.

```bash
docker compose --profile tools run --rm migrate
docker compose --profile tools run --rm seed
```

4. Check health.

```bash
npm run healthcheck
```

## Seed Accounts

Development seed accounts:

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@omnitech.example` | `OmniTech#2026` |
| Technician | `tech@omnitech.example` | `OmniTech#2026` |
| Sales/Marketing | `sales@omnitech.example` | `OmniTech#2026` |

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local Next.js development server. |
| `npm run build` | Build production bundle. |
| `npm run start` | Start built production app. |
| `npm run test` | Run unit and integration tests. |
| `npm run test:e2e` | Run Playwright tests. |
| `npm run test:qa` | Run typecheck, unit, integration and E2E tests. |
| `npm run db:migrate:dev` | Create/apply local Prisma migrations. |
| `npm run db:migrate:deploy` | Apply committed migrations in staging/production. |
| `npm run db:seed` | Load realistic sample data. |
| `docker compose --profile tools run --rm backup` | Create a local PostgreSQL backup. |

## Install Verification

- `/api/health` returns `status: ok`.
- Public pages load: `/`, `/services`, `/request-service`, `/track-repair`.
- Login works with the seeded admin account.
- Admin dashboard loads at `/admin`.
- Technician dashboard loads at `/technician`.
- Customer registration page loads at `/customer/register`.
