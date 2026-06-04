import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { saveRepairEstimate } from "@/server/services/repair-module";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("jobs:update_assigned");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const intake = await saveRepairEstimate(id, body, actor.id);
    return NextResponse.json({ intake });
  } catch (error) {
    return apiError(error, "Could not save repair estimate.");
  }
}
