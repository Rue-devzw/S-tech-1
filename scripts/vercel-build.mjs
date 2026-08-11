import { spawnSync } from "node:child_process";

const integrationDatabaseUrl = [
  process.env.omnitech_DATABASE_URL,
  process.env.omnitech_POSTGRES_PRISMA_URL,
  process.env.omnitech_POSTGRES_URL,
  process.env.POSTGRES_PRISMA_URL,
  process.env.POSTGRES_URL
].find(Boolean);

function isLocalDatabaseUrl(value) {
  if (!value) return false;
  try {
    const host = new URL(value).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

if (integrationDatabaseUrl && (!process.env.DATABASE_URL || isLocalDatabaseUrl(process.env.DATABASE_URL))) {
  process.env.DATABASE_URL = integrationDatabaseUrl;
}

if (!process.env.DATABASE_URL || isLocalDatabaseUrl(process.env.DATABASE_URL)) {
  console.error("A hosted DATABASE_URL is required for a Vercel production build.");
  process.exit(1);
}

const steps = [
  { command: "npx", args: ["prisma", "migrate", "deploy"], env: process.env },
  ...(process.env.SEED_SHOP_ON_BUILD === "true"
    ? [{ command: "npm", args: ["run", "db:seed"], env: { ...process.env, SEED_SHOP_ONLY: "true" } }]
    : []),
  { command: "npm", args: ["run", "build"], env: process.env }
];

for (const { command, args, env } of steps) {
  const result = spawnSync(command, args, { stdio: "inherit", env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
