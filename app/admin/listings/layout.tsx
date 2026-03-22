import { requireAdminRouteAccess } from "@/lib/server/admin-route-access";

export default async function AdminListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminRouteAccess(["owner", "manager"]);
  return children;
}
