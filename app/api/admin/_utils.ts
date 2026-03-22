import { NextRequest, NextResponse } from "next/server";
import { type AdminRole } from "@/lib/admin-user";
import {
  ADMIN_SESSION_COOKIE,
  resolveAdminSession,
} from "@/lib/server/admin-auth";

export async function ensureAdminRequest(
  request: NextRequest,
  allowedRoles?: AdminRole[]
) {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const resolvedSession = await resolveAdminSession(session);

  if (!resolvedSession) {
    return {
      response: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
      session: null,
    };
  }

  if (allowedRoles && !allowedRoles.includes(resolvedSession.user.role)) {
    return {
      response: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
      session: null,
    };
  }

  return {
    response: null,
    session: resolvedSession,
  };
}
