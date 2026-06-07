const databaseUrlKeys = [
  "DATABASE_URL",
  "omnitech_DATABASE_URL",
  "omnitech_POSTGRES_PRISMA_URL",
  "omnitech_POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL"
];

export function resolveDatabaseUrl() {
  return databaseUrlKeys.map((key) => process.env[key]).find(Boolean);
}

export function ensureDatabaseUrlEnv() {
  if (!process.env.DATABASE_URL) {
    const fallback = resolveDatabaseUrl();
    if (fallback) process.env.DATABASE_URL = fallback;
  }
  return process.env.DATABASE_URL;
}

export function hasDatabaseUrl() {
  return Boolean(resolveDatabaseUrl());
}
