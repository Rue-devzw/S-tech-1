import { NextResponse } from "next/server";
import { searchParams } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { getAdminDashboard } from "@/server/services/admin-dashboard";

export async function GET(request: Request) {
  const actor = await requirePermission("reports:view");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = searchParams(request);
  const report = await getAdminDashboard({
    from: query.from,
    to: query.to,
    serviceCategoryId: query.serviceCategoryId,
    technicianId: query.technicianId,
    status: query.status
  });
  return NextResponse.json({ report });
}
