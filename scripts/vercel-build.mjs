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

for (const [command, args] of [
  ["npx", ["prisma", "migrate", "deploy"]],
  ["npm", ["run", "build"]]
]) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
