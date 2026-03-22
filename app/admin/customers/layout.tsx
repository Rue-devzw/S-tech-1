import { requireAdminRouteAccess } from "@/lib/server/admin-route-access";

export default async function AdminCustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminRouteAccess(["owner"], "/admin/team");
  return children;
}
