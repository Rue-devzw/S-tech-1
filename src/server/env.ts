const integratedDatabaseUrlKeys = [
  "omnitech_DATABASE_URL",
  "omnitech_POSTGRES_PRISMA_URL",
  "omnitech_POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL"
];

const databaseUrlKeys = ["DATABASE_URL", ...integratedDatabaseUrlKeys];

function isLocalDatabaseUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const host = new URL(value).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

export function resolveDatabaseUrl() {
  const keys = process.env.VERCEL ? [...integratedDatabaseUrlKeys, "DATABASE_URL"] : databaseUrlKeys;
  return keys.map((key) => process.env[key]).find(Boolean);
}

export function ensureDatabaseUrlEnv() {
  const resolved = resolveDatabaseUrl();
  if (resolved && (!process.env.DATABASE_URL || (process.env.VERCEL && isLocalDatabaseUrl(process.env.DATABASE_URL)))) {
    process.env.DATABASE_URL = resolved;
  }
  return process.env.DATABASE_URL;
}

export function hasDatabaseUrl() {
  return Boolean(resolveDatabaseUrl());
}
