# Vercel Deployment

This is the preferred production deployment path for OmniTech Solutions.

## Target Architecture

- App hosting: Vercel Next.js.
- Database: Prisma Postgres from the Vercel Marketplace, or Neon Postgres connected to Vercel.
- Product image storage: the public GitHub repository's dedicated `product-media` branch.
- Private job evidence/document storage: Vercel Blob.
- Domain: `omnitech.io`.
- Email identity: `OmniTech Solutions <hello@omnitech.io>`.

## 1. Create the Vercel Project

1. Push this repository to GitHub.
2. In Vercel, import the repository as a new project.
3. Keep the framework preset as Next.js.
4. Use the production branch you want to deploy from.

The project includes `vercel.json`, so Vercel will use `npm ci` and `npm run build`.

## 2. Add Postgres

Use one of these:

- Prisma Postgres from Vercel Marketplace.
- Neon Postgres from Vercel Marketplace.
- Existing external Postgres by setting `DATABASE_URL` manually.

After connecting the integration, confirm Vercel has a production `DATABASE_URL` variable.

## 3. Configure Storage

Product images are uploaded by the authenticated admin API to GitHub's Contents API. Create a fine-grained GitHub personal access token scoped only to `StriveRue/S-tech`, with repository Contents read/write permission. Store it only in Vercel as `GITHUB_CONTENTS_TOKEN`.

The `product-media` branch must exist before the first upload. Vercel should continue deploying only `main`, so media commits do not start deployments.

For private job evidence and documents, add Vercel Blob:

In Vercel:

1. Open the project.
2. Go to Storage.
3. Create or connect a Blob store.
4. Confirm `BLOB_READ_WRITE_TOKEN` is available in the project environment.

The app exposes an authenticated upload endpoint at `/api/uploads/blob`.

## 4. Required Environment Variables

Set these in Vercel Project Settings > Environment Variables:

```bash
APP_URL=https://omnitech.io
NEXT_PUBLIC_SITE_URL=https://omnitech.io
AUTH_SECRET=<32+ random characters>
EMAIL_FROM="OmniTech Solutions <hello@omnitech.io>"
EMAIL_PROVIDER=log
SMS_PROVIDER=log
WHATSAPP_PROVIDER=log
AI_PROVIDER=log
RATE_LIMIT_DISABLED=false
PRODUCT_IMAGE_STORAGE=github
GITHUB_REPOSITORY_OWNER=StriveRue
GITHUB_REPOSITORY_NAME=S-tech
GITHUB_REPOSITORY_BRANCH=product-media
GITHUB_PRODUCT_IMAGES_PATH=public/uploads/products
GITHUB_CONTENTS_TOKEN=<fine-grained repository token>
```

The database and Blob integrations should add:

```bash
DATABASE_URL=<postgres connection string>
BLOB_READ_WRITE_TOKEN=<vercel blob token>
```

Add provider keys only when their providers are enabled:

```bash
EMAIL_API_KEY=
SMS_API_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
AI_API_KEY=
```

## 5. Pull Environment Locally

```bash
npx vercel login
npx vercel link
npm run vercel:pull
```

This creates `.env.local` for local Vercel-linked development.

## 6. Run Production Migrations

Before the first production deployment, and before releases with schema changes:

```bash
DATABASE_URL="postgresql://..." npm run db:migrate:deploy
```

Seed only if you intentionally want starter data:

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

Replace seeded demo credentials before launch.

## 7. Deploy

From the local repository:

```bash
npm run vercel:deploy
```

Or deploy by pushing to the connected Git branch after migrations have run.

## 8. Domain

In Vercel Project Settings > Domains, add:

```text
omnitech.io
www.omnitech.io
```

Follow Vercel's DNS instructions. If DNS stays on Cloudflare, use Vercel's recommended CNAME/A records and keep SSL active.

## 9. Verify

```bash
curl https://omnitech.io/api/health
curl https://omnitech.io/robots.txt
curl https://omnitech.io/sitemap.xml
```

Then test:

- Public service request.
- Login.
- Admin dashboard.
- Customer portal.
- Product image upload and deletion from `/admin/products`, confirming the files appear on `product-media`.
- Blob upload through authenticated private workflows or `/api/uploads/blob`.
