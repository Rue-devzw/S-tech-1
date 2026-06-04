import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { allocatePartsToJob } from "@/server/services/job-workflow";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("inventory:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const movements = await allocatePartsToJob(body, actor.id, id);
    return NextResponse.json({ movements }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not allocate parts.");
  }
}
