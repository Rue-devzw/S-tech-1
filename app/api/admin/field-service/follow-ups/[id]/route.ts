import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { updateFollowUpTaskStatus } from "@/server/services/field-service-module";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const task = await updateFollowUpTaskStatus(id, body, actor.id);
    return NextResponse.json({ task });
  } catch (error) {
    return apiError(error, "Could not update follow-up task.");
  }
}
