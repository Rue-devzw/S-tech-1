import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminRequest } from "../_utils";
import { shouldUseSecureCookies } from "@/lib/env";
import {
  ADMIN_SESSION_COOKIE,
  parseAdminSessionToken,
} from "@/lib/server/admin-auth";
import {
  listAdminSessions,
  revokeAdminSession,
} from "@/lib/server/data-store";

const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (auth.response) {
    return auth.response;
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const parsed = parseAdminSessionToken(token);
  const sessions = await listAdminSessions({
    userId: auth.session.user.role === "owner" ? undefined : auth.session.user.id,
    currentSessionId: parsed?.sessionId ?? null,
  });

  return NextResponse.json({ sessions });
}

export async function DELETE(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (auth.response) {
    return auth.response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = revokeSessionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid session revocation payload." },
      { status: 400 }
    );
  }

  const currentToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const currentSession = parseAdminSessionToken(currentToken);

  const sessions = await listAdminSessions({
    userId: auth.session.user.role === "owner" ? undefined : auth.session.user.id,
    currentSessionId: currentSession?.sessionId ?? null,
  });
  const target = sessions.find((session) => session.id === parsed.data.sessionId);

  if (!target) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  await revokeAdminSession(parsed.data.sessionId, auth.session.user.username);

  const response = NextResponse.json({ ok: true });
  if (currentSession?.sessionId === parsed.data.sessionId) {
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: shouldUseSecureCookies(),
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
