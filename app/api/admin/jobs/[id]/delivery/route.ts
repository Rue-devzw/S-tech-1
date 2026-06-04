import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { markDeliveryOrCollection } from "@/server/services/job-workflow";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("jobs:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const job = await markDeliveryOrCollection(body, actor.id, id);
    return NextResponse.json({ job });
  } catch (error) {
    return apiError(error, "Could not confirm delivery or collection.");
  }
}
