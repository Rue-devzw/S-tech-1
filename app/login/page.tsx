import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import {
  ADMIN_SESSION_COOKIE,
  resolveAdminSession,
} from "@/lib/server/admin-auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const params = await searchParams;
  const nextPath = params.next || "/admin";
  const session = await resolveAdminSession(token);

  if (session) {
    redirect(nextPath);
  }

  return <LoginForm nextPath={nextPath} />;
}
