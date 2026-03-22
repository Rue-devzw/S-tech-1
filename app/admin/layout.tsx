import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  ADMIN_SESSION_COOKIE,
  resolveAdminSession,
} from "@/lib/server/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await resolveAdminSession(token);

  if (!session) {
    redirect("/login?next=/admin");
  }

  return <AdminShell currentUser={session.user}>{children}</AdminShell>;
}
