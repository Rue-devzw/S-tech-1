# Environment Setup

OmniTech is environment-variable driven. Use `.env.example` as the template and keep real secrets in a secret manager for staging and production.

## Local Setup

```bash
cp .env.example .env
```

The default local values are designed for Docker Compose PostgreSQL and local file storage.

## Core Variables

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5434/omnitech?schema=public` | PostgreSQL connection string. Production should use private networking and TLS. |
| `AUTH_SECRET` | Yes | random 32+ chars | Signs session cookies. Rotating it invalidates sessions. |
| `APP_URL` | Yes | `https://omnitech.io` | Used for links, health checks and notifications. |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://omnitech.io` | Public canonical URL used for SEO metadata, OpenGraph, robots and sitemap output. |
| `NODE_ENV` | Yes | `production` | Use `production` outside local development. |
| `RATE_LIMIT_DISABLED` | No | `false` | Keep false in staging/production. |
| `BLOB_READ_WRITE_TOKEN` | Production on Vercel | Vercel Blob integration | Required for `/api/uploads/blob` and production upload storage. |

## Storage Variables

| Variable | Required | Notes |
| --- | --- | --- |
| `STORAGE_DRIVER` | Yes | `local` for dev; S3-compatible storage for production. |
| `STORAGE_LOCAL_DIR` | Local | Local evidence/document storage path. |
| `S3_ENDPOINT` | Production when S3 enabled | S3-compatible endpoint. |
| `S3_REGION` | Production when S3 enabled | Storage region. |
| `S3_BUCKET` | Production when S3 enabled | Private bucket for documents/photos. |
| `S3_ACCESS_KEY_ID` | Production when S3 enabled | Store in secret manager. |
| `S3_SECRET_ACCESS_KEY` | Production when S3 enabled | Store in secret manager. |

## Communication Variables

| Variable | Notes |
| --- | --- |
| `EMAIL_PROVIDER` | Use `log` locally until a provider is connected. |
| `EMAIL_FROM` | Sender identity for customer-facing messages. |
| `EMAIL_API_KEY` | Provider secret. |
| `SMS_PROVIDER`, `SMS_API_KEY` | SMS-ready provider configuration. |
| `WHATSAPP_PROVIDER`, `WHATSAPP_API_KEY`, `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp-ready workflow configuration. |

## AI Variables

| Variable | Notes |
| --- | --- |
| `AI_ASSISTANT_PROVIDER` | `local-fallback` by default; `http` for an external provider. |
| `AI_PROVIDER_BASE_URL` | HTTP endpoint for provider abstraction. |
| `AI_PROVIDER_API_KEY` | Provider secret. |
| `AI_MODEL` | Provider model name. |
| `AI_COST_INPUT_PER_1K`, `AI_COST_OUTPUT_PER_1K` | Used for usage cost estimates. |

Customer-facing AI output must remain human-approved. Do not configure a provider that trains on customer data without an explicit business and privacy decision.

## Backup and Logging Variables

| Variable | Notes |
| --- | --- |
| `LOG_LEVEL` | Default `info`. |
| `BACKUP_DIR` | Local backup destination for scripts. |
| `BACKUP_RETENTION_DAYS` | Local backup retention window. |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Docker Compose Postgres values. |

## Staging Rules

- Use separate database, storage bucket, secrets and provider credentials from production.
- Keep demo/test recipients for email, SMS and WhatsApp.
- Do not reuse production customer data unless it is anonymized.
- Run `npm run db:migrate:deploy`, `npm run test:qa` and `npm run healthcheck` before release approval.

## Production Rules

- Store secrets in the hosting platform secret store.
- Use a strong `AUTH_SECRET`; minimum 32 random characters.
- Never commit `.env` files.
- Use least-privilege PostgreSQL credentials.
- Keep PostgreSQL private, with TLS required.
- Use private object storage and signed access for customer evidence and documents.
- Rotate provider keys on a documented schedule.
