import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type AdminRole } from "@/lib/admin-user";
import {
  ADMIN_SESSION_COOKIE,
  resolveAdminSession,
} from "@/lib/server/admin-auth";

export async function requireAdminRouteAccess(
  allowedRoles: AdminRole[],
  fallbackPath = "/admin"
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await resolveAdminSession(token);

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(fallbackPath)}`);
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect(fallbackPath);
  }

  return session;
}
