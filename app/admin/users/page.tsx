import type { Metadata } from "next";
import Link from "next/link";
import { UserManagement } from "@/components/admin/user-management";
import { PageShell } from "@/components/site-shell";
import { makeMetadata } from "@/lib/seo";
import { listManagedUsers } from "@/server/auth-workflows";
import { requirePermission } from "@/server/rbac";

export const dynamic = "force-dynamic";

export const metadata: Metadata = makeMetadata({
  title: "Users and Roles",
  description: "Create and manage OmniTech admin, technician, field installer and staff accounts.",
  path: "/admin/users",
  noIndex: true
});

export default async function AdminUsersPage() {
  const actor = await requirePermission("settings:manage");

  if (!actor) {
    return (
      <PageShell>
        <section className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-3xl font-bold text-ink">Users and roles</h1>
          <p className="mt-4 text-slate-600">You need settings permission to manage users.</p>
          <Link href="/admin" className="mt-6 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
            Back to admin
          </Link>
        </section>
      </PageShell>
    );
  }

  const data = await listManagedUsers().catch(() => null);

  return (
    <PageShell>
      {data ? (
        <UserManagement users={data.users} pendingInvitations={data.pendingInvitations} />
      ) : (
        <section className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-3xl font-bold text-ink">Users and roles</h1>
          <p className="mt-4 text-slate-600">User management is unavailable because the database connection is not ready.</p>
        </section>
      )}
    </PageShell>
  );
}
