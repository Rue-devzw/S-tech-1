import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionTtlMs,
  parseAdminSessionToken,
} from "@/lib/server/admin-auth";
import { shouldUseSecureCookies } from "@/lib/env";
import {
  getPersistenceConfigurationErrorMessage,
  isWorkersReadOnlyPreviewMode,
} from "@/lib/server/runtime";
import {
  getRequestSubjectKey,
  getRequestFingerprint,
} from "@/lib/server/request-guard";
import {
  countRecentRequestEvents,
  createAdminSession,
  createAdminMfaChallenge,
  deleteAdminSession,
  getPlatformSettings,
  recordRequestEvent,
  recordSessionAudit,
  recordSecurityAudit,
  verifyAdminMfaChallenge,
  verifyAdminCredentials,
} from "@/lib/server/data-store";

const AUTH_FAILURE_EVENT = "auth_failed";
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_FINGERPRINT_LIMIT = 5;
const AUTH_SUBJECT_LIMIT = 8;

async function getRateLimitResponse(input: {
  fingerprint: string;
  subject?: string;
  username?: string;
}) {
  const fingerprintCount = await countRecentRequestEvents({
    route: "/api/session",
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
    eventType: AUTH_FAILURE_EVENT,
    fingerprint: input.fingerprint,
  });

  if (fingerprintCount >= AUTH_FINGERPRINT_LIMIT) {
    await Promise.all([
      recordRequestEvent({
        route: "/api/session",
        fingerprint: input.fingerprint,
        eventType: "rate_limited",
        subject: input.subject,
        metadata: {
          fingerprint: input.fingerprint,
          username: input.username ?? null,
          scope: "fingerprint",
        },
      }),
      recordSecurityAudit({
        actor: `public:${input.fingerprint}`,
        action: "security.rate_limited",
        entityId: "/api/session",
        summary: "Rate limited request to /api/session",
        metadata: {
          fingerprint: input.fingerprint,
          username: input.username ?? null,
          scope: "fingerprint",
        },
      }),
    ]);

    return NextResponse.json(
      {
        error: "Too many requests. Please wait a moment before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(AUTH_RATE_LIMIT_WINDOW_MS / 1000).toString(),
        },
      }
    );
  }

  if (!input.subject) {
    return null;
  }

  const subjectCount = await countRecentRequestEvents({
    route: "/api/session",
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
    eventType: AUTH_FAILURE_EVENT,
    subject: input.subject,
  });

  if (subjectCount < AUTH_SUBJECT_LIMIT) {
    return null;
  }

  await Promise.all([
    recordRequestEvent({
      route: "/api/session",
      fingerprint: input.fingerprint,
      eventType: "rate_limited",
      subject: input.subject,
      metadata: {
        fingerprint: input.fingerprint,
        username: input.username ?? null,
        scope: "subject",
      },
    }),
    recordSecurityAudit({
      actor: `public:${input.fingerprint}`,
      action: "security.rate_limited",
      entityId: "/api/session",
      summary: "Rate limited request to /api/session",
      metadata: {
        fingerprint: input.fingerprint,
        username: input.username ?? null,
        scope: "subject",
      },
    }),
  ]);

  return NextResponse.json(
    {
      error: "Too many requests. Please wait a moment before trying again.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.ceil(AUTH_RATE_LIMIT_WINDOW_MS / 1000).toString(),
      },
    }
  );
}

export async function POST(request: NextRequest) {
  if (isWorkersReadOnlyPreviewMode()) {
    return NextResponse.json(
      {
        error: getPersistenceConfigurationErrorMessage(),
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
    challengeId?: string;
    mfaCode?: string;
  } | null;
  const username = body?.username?.trim() ?? "";
  const fingerprint = getRequestFingerprint(request);
  const subject = username ? getRequestSubjectKey(username) : undefined;
  const rateLimitResponse = await getRateLimitResponse({
    fingerprint,
    subject,
    username: username || undefined,
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  if (body?.challengeId && body?.mfaCode) {
    const user = await verifyAdminMfaChallenge(body.challengeId, body.mfaCode);

    if (!user) {
      await recordRequestEvent({
        route: "/api/session",
        fingerprint,
        eventType: AUTH_FAILURE_EVENT,
        metadata: {
          challengeId: body.challengeId,
          kind: "mfa",
        },
      });
      await recordSecurityAudit({
        actor: `public:${fingerprint}`,
        action: "security.invalid_mfa",
        entityId: body.challengeId,
        summary: "Rejected invalid admin MFA challenge attempt",
        metadata: {
          challengeId: body.challengeId,
        },
      });
      return NextResponse.json(
        { error: "Invalid authentication code." },
        { status: 401 }
      );
    }

    const sessionTtlMs = await getAdminSessionTtlMs();
    const session = await createAdminSession(user.id, sessionTtlMs);
    if (!session) {
      return NextResponse.json(
        { error: "Unable to create session." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: createAdminSessionToken(session.id, session.expiresAt),
      httpOnly: true,
      sameSite: "lax",
      secure: shouldUseSecureCookies(),
      path: "/",
      maxAge: Math.floor(sessionTtlMs / 1000),
    });
    await recordSessionAudit("session.login", user.username);
    return response;
  }

  const user =
    body?.username && body?.password
      ? await verifyAdminCredentials(body.username, body.password)
      : null;

  if (!user) {
    await recordRequestEvent({
      route: "/api/session",
      fingerprint,
      eventType: AUTH_FAILURE_EVENT,
      subject,
      metadata: {
        username: username || null,
        kind: "password",
      },
    });
    await recordSecurityAudit({
      actor: `public:${fingerprint}`,
      action: "security.invalid_login",
      entityId: username || "unknown",
      summary: "Rejected invalid admin login attempt",
      metadata: {
        username: username || null,
      },
    });
    return NextResponse.json(
      { error: "Invalid admin credentials." },
      { status: 401 }
    );
  }

  const settings = await getPlatformSettings();
  const requiresMfa = settings.security.twoFactorAuth || user.mfaEnabled;

  if (settings.security.twoFactorAuth && !user.mfaEnabled) {
    return NextResponse.json(
      {
        error:
          "Multi-factor authentication is required for this account. Ask an owner to reset enrollment if you are locked out.",
      },
      { status: 403 }
    );
  }

  if (requiresMfa) {
    const challenge = await createAdminMfaChallenge(user.id);

    if (!challenge) {
      return NextResponse.json(
        { error: "Unable to start the MFA challenge." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        mfaRequired: true,
        challengeId: challenge.id,
      },
      { status: 202 }
    );
  }

  const sessionTtlMs = await getAdminSessionTtlMs();
  const session = await createAdminSession(user.id, sessionTtlMs);
  if (!session) {
    return NextResponse.json(
      { error: "Unable to create session." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionToken(session.id, session.expiresAt),
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: Math.floor(sessionTtlMs / 1000),
  });
  await recordSessionAudit("session.login", user.username);
  return response;
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const parsed = parseAdminSessionToken(token);

  if (parsed) {
    await deleteAdminSession(parsed.sessionId);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 0,
  });
  await recordSessionAudit("session.logout");
  return response;
}
