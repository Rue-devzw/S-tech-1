import { requireAdminRouteAccess } from "@/lib/server/admin-route-access";

export default async function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminRouteAccess(["owner"]);
  return children;
}
