import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { type AdminRole } from "@/lib/admin-user";
import { getAdminSessionSecret } from "@/lib/env";
import {
  getAdminSessionById,
  getPlatformSettings,
} from "@/lib/server/data-store";

export const ADMIN_SESSION_COOKIE = "s_tech_admin_session";
const ADMIN_SESSION_VERSION = "v1";
const DEFAULT_SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const MIN_SESSION_TIMEOUT_MINUTES = 5;
const MAX_SESSION_TIMEOUT_MINUTES = 60 * 24;

function sign(value: string) {
  return createHmac("sha256", getAdminSessionSecret())
    .update(value)
    .digest("hex");
}

function normalizeSessionTimeoutMinutes(value: string) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  if (
    parsed < MIN_SESSION_TIMEOUT_MINUTES ||
    parsed > MAX_SESSION_TIMEOUT_MINUTES
  ) {
    return null;
  }

  return parsed;
}

export async function getAdminSessionTtlMs() {
  const settings = await getPlatformSettings();
  const timeoutMinutes = normalizeSessionTimeoutMinutes(
    settings.security.sessionTimeout
  );

  if (!timeoutMinutes) {
    return DEFAULT_SESSION_TTL_MS;
  }

  return timeoutMinutes * 60 * 1000;
}

export function createAdminSessionToken(sessionId: string, expiresAt: string) {
  const expiresAtMs = new Date(expiresAt).getTime();
  const payload = `${ADMIN_SESSION_VERSION}.${expiresAtMs}.${sessionId}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function parseAdminSessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [version, expiresAtRaw, sessionId, signature] = token.split(".");
  if (
    !version ||
    !expiresAtRaw ||
    !sessionId ||
    !signature ||
    version !== ADMIN_SESSION_VERSION
  ) {
    return null;
  }

  const payload = `${version}.${expiresAtRaw}.${sessionId}`;
  const expectedSignature = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  const expiresAtMs = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAtMs)) {
    return null;
  }

  if (expiresAtMs <= Date.now()) {
    return null;
  }

  return {
    sessionId,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };
}

export async function resolveAdminSession(token?: string | null) {
  const parsed = parseAdminSessionToken(token);
  if (!parsed) {
    return null;
  }

  return getAdminSessionById(parsed.sessionId);
}

export async function hasAdminRole(
  token: string | null | undefined,
  allowedRoles: AdminRole[]
) {
  const session = await resolveAdminSession(token);
  if (!session) {
    return false;
  }

  return allowedRoles.includes(session.user.role);
}

export function getAdminSessionMaxAgeSeconds() {
  return Math.floor(DEFAULT_SESSION_TTL_MS / 1000);
}
