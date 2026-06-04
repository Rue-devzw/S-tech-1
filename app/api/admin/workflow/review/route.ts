import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { reviewRequestAndCreateJob } from "@/server/services/job-workflow";

export async function POST(request: Request) {
  const actor = await requirePermission("jobs:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const job = await reviewRequestAndCreateJob(await request.json(), actor.id);
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not review request.");
  }
}
