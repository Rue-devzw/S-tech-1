import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { saveRepairPartsNeeded } from "@/server/services/repair-module";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("jobs:update_assigned");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const parts = await saveRepairPartsNeeded(id, body, actor.id);
    return NextResponse.json({ parts }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save parts needed.");
  }
}
