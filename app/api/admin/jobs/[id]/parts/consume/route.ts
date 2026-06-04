import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { consumeReservedParts } from "@/server/services/job-workflow";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("jobs:update_assigned");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const result = await consumeReservedParts(id, actor.id);
    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "Could not consume parts.");
  }
}
