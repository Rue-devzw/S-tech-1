import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { recordStarlinkHandover } from "@/server/services/starlink-module";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const plan = await recordStarlinkHandover(id, body, actor.id);
    return NextResponse.json({ plan });
  } catch (error) {
    return apiError(error, "Could not record Starlink handover.");
  }
}
