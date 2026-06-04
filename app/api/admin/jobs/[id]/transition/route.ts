import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requireAnyPermission } from "@/server/rbac";
import { transitionJob } from "@/server/services/job-workflow";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAnyPermission(["jobs:manage", "jobs:update_assigned"]);
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const job = await transitionJob(body, actor.id, id);
    return NextResponse.json({ job });
  } catch (error) {
    return apiError(error, "Could not update job status.");
  }
}
