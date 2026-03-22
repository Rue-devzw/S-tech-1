import { requireAdminRouteAccess } from "@/lib/server/admin-route-access";

export default async function AdminTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminRouteAccess(["owner"], "/admin/team");
  return children;
}
