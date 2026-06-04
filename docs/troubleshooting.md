# Troubleshooting Guide

Use this guide when OmniTech fails to install, build, run, connect to the database, authenticate users or deploy.

## Quick Health Checks

```bash
npm run healthcheck
curl http://localhost:3000/api/health
docker compose ps
docker compose logs app
docker compose logs postgres
```

Healthy response:

```json
{
  "status": "ok",
  "database": "ok"
}
```

## Installation Issues

### `npm install` fails

- Confirm Node.js 22.
- Delete `node_modules` and reinstall.
- Confirm `package-lock.json` is present and not partially merged.

```bash
node --version
rm -rf node_modules
npm install
```

### Build fails during Prisma generate

- Confirm `DATABASE_URL` exists when required.
- Run Prisma validation.

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/omnitech?schema=public" npx prisma validate
```

## Database Issues

### Postgres is not reachable

```bash
docker compose up -d postgres
docker compose logs postgres
docker compose ps
```

Confirm `.env` has a matching `DATABASE_URL`.

Local host URL:

```text
postgresql://postgres:postgres@localhost:5434/omnitech?schema=public
```

Compose app URL:

```text
postgresql://postgres:postgres@postgres:5432/omnitech?schema=public
```

### Migrations fail

1. Check status.

```bash
npm run db:migrate:status
```

2. Validate schema.

```bash
npx prisma validate
```

3. Review the failing migration SQL.
4. Do not use `prisma db push` on staging or production.
5. Restore a backup or forward-fix if production is affected.

### Seed fails

- Confirm migrations are applied.
- Check enum or required field errors.
- Re-run seed after fixing the record.

```bash
npm run db:migrate:dev
npm run db:seed
```

## Authentication Issues

### Login redirects back to login

- Confirm `AUTH_SECRET` is set and at least 32 characters.
- Confirm cookies are not blocked.
- In production, confirm HTTPS and secure cookie handling at the proxy/load balancer.
- Confirm account status is `ACTIVE`.

### Password reset does not show a token

This is expected. Reset tokens must not be returned in API responses. Delivery should happen through the notification provider or controlled admin/testing tooling.

### User sees Forbidden

- Confirm role and permissions.
- Confirm route is appropriate for the role.
- Technicians should use `/technician`, customers `/customer`, admins `/admin`.

## Docker Issues

### `docker compose up --build` fails

- Confirm Docker is running.
- Confirm `.env` exists or rely on compose defaults.
- Run config validation.

```bash
docker compose config
docker compose --profile tools config --services
```

### Docker build hangs resolving base image

This usually indicates Docker Desktop credential, registry or network trouble before the Dockerfile runs.

- Confirm internet access to Docker Hub.
- Restart Docker Desktop.
- Run `docker pull node:22-alpine`.
- Retry `docker build -t omnitech-solutions-platform:local .`.

## Form and Validation Issues

### Request form rejects input

- Customer name must be at least 2 characters.
- Phone must be at least 7 characters.
- Service must be selected.
- Description must be detailed enough.
- Uploaded file references must use safe filenames and managed `/storage/...` or HTTPS URLs.

### Quotation or payment fails

- Amounts must be positive.
- Quotation line items require description, quantity and unit price.
- Payment requires invoice ID, amount and known method.
- Customer approval must be recorded before approved-work transitions.

## AI Issues

### AI provider fails

The assistant falls back to a deterministic local response when provider calls fail.

Check:

- `AI_ASSISTANT_PROVIDER`
- `AI_PROVIDER_BASE_URL`
- `AI_PROVIDER_API_KEY`
- provider response shape
- application logs

### AI output is pending

Customer-facing AI output is intentionally queued for human approval. Review it in the admin AI area.

## Notification Issues

If messages are not delivered:

- Confirm provider variables.
- Check notification logs.
- Confirm customer consent and recipient value.
- Use `log` provider locally.
- Confirm templates are active and contain required variables.

## Deployment Issues

### `/api/health` returns 503

- Database is unavailable or credentials are wrong.
- Check database network access and TLS requirements.
- Check migration state.

### App starts but protected pages fail

- Confirm `AUTH_SECRET` is stable across all containers.
- Confirm `APP_URL` and proxy headers.
- Confirm middleware is receiving cookies.

### Static/public pages load but admin APIs fail

- Check session cookie.
- Check role permissions.
- Check server logs for Prisma or validation errors.

## Emergency Steps

1. Preserve logs.
2. Stop writes if data integrity is at risk.
3. Check `/api/health`.
4. Check database availability.
5. Roll back application image if the last release introduced the failure.
6. Restore database only if forward-fix is impossible and a verified backup exists.
