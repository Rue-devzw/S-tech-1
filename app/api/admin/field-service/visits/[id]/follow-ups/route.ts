import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { createFollowUpTask } from "@/server/services/field-service-module";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const task = await createFollowUpTask(id, body, actor.id);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not create follow-up task.");
  }
}
