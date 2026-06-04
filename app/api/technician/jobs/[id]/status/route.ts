import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { updateAssignedJobStatus } from "@/server/services/technician-dashboard";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("jobs:update_assigned");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const job = await updateAssignedJobStatus(id, body, actor);
    return NextResponse.json({ job });
  } catch (error) {
    return apiError(error, "Could not update assigned job.");
  }
}
