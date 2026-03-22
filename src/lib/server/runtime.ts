import { getDatabaseUrl, getNodeEnv } from "@/lib/env";

type RuntimeGlobals = typeof globalThis & {
  WebSocketPair?: unknown;
  caches?: unknown;
  navigator?: {
    userAgent?: string;
  };
};

const CLOUDLFARE_DATABASE_REQUIRED_MESSAGE =
  "Managed Postgres is required for Cloudflare Workers deployments. Set DATABASE_URL to enable persistent data and admin features.";

export class PersistenceConfigurationError extends Error {
  constructor(message = CLOUDLFARE_DATABASE_REQUIRED_MESSAGE) {
    super(message);
    this.name = "PersistenceConfigurationError";
  }
}

export function getPersistenceConfigurationErrorMessage() {
  return CLOUDLFARE_DATABASE_REQUIRED_MESSAGE;
}

export function isPersistenceConfigurationError(error: unknown) {
  return error instanceof PersistenceConfigurationError;
}

export function isCloudflareWorkersRuntime() {
  const runtime = globalThis as RuntimeGlobals;
  const userAgent = runtime.navigator?.userAgent;

  return (
    userAgent === "Cloudflare-Workers" ||
    (typeof runtime.WebSocketPair === "function" &&
      typeof runtime.caches === "object")
  );
}

export function isWorkersReadOnlyPreviewMode() {
  return (
    !getDatabaseUrl() &&
    (isCloudflareWorkersRuntime() || getNodeEnv() === "production")
  );
}
