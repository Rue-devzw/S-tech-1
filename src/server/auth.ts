import { cookies } from "next/headers";
import { AccountStatus, RoleName } from "@prisma/client";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/server/db";

export const sessionCookieName = "omnitech_session";
const sessionHours = 8;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters.");
  }
  return new TextEncoder().encode(value);
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function canLogin(user: { isActive: boolean; deletedAt: Date | null; accountStatus: AccountStatus }) {
  return user.isActive && !user.deletedAt && user.accountStatus === "ACTIVE";
}

export async function createSession(
  user: { id: string; email: string; role: RoleName; name: string },
  meta?: { ipAddress?: string | null; userAgent?: string | null }
) {
  const sessionSecret = randomToken();
  const expiresAt = new Date(Date.now() + sessionHours * 60 * 60 * 1000);
  const session = await prisma.userSession.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(sessionSecret),
      ipAddress: meta?.ipAddress ?? undefined,
      userAgent: meta?.userAgent ?? undefined,
      expiresAt
    }
  });

  const token = await new SignJWT({
    sub: user.id,
    sid: session.id,
    st: sessionSecret,
    email: user.email,
    role: user.role,
    name: user.name
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionHours}h`)
    .sign(secret());

  (await cookies()).set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionHours * 60 * 60
  });

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return session;
}

export async function clearSession() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (token) {
    try {
      const verified = await jwtVerify(token, secret());
      const sessionId = typeof verified.payload.sid === "string" ? verified.payload.sid : null;
      if (sessionId) {
        await prisma.userSession.updateMany({
          where: { id: sessionId, revokedAt: null },
          data: { revokedAt: new Date() }
        });
      }
    } catch {
      // Expired or invalid cookies are cleared below.
    }
  }
  (await cookies()).delete(sessionCookieName);
}

export async function currentUser() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, secret());
    const userId = verified.payload.sub;
    const sessionId = verified.payload.sid;
    const sessionSecret = verified.payload.st;
    if (!userId || typeof sessionId !== "string" || typeof sessionSecret !== "string") return null;

    const session = await prisma.userSession.findFirst({
      where: {
        id: sessionId,
        userId,
        tokenHash: hashToken(sessionSecret),
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });
    if (!session) return null;

    const user = await prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null, accountStatus: "ACTIVE" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        accountStatus: true,
        customer: true,
        technician: true
      }
    });
    return user;
  } catch {
    return null;
  }
}

export function canAccess(role: RoleName, allowed: RoleName[]) {
  return allowed.includes(role);
}

export async function requireRole(allowed: RoleName[]) {
  const user = await currentUser();
  if (!user || !canAccess(user.role, allowed)) return null;
  return user;
}
