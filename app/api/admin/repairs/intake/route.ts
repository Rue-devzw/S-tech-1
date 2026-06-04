import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { createRepairIntake } from "@/server/services/repair-module";

export async function POST(request: Request) {
  const actor = await requirePermission("jobs:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const result = await createRepairIntake(await request.json(), actor.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not create repair intake.");
  }
}
