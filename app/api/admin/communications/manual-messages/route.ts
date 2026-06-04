import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { sendManualMessage } from "@/server/services/communication-engine";

export async function POST(request: Request) {
  const actor = await requirePermission("notifications:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const result = await sendManualMessage(await request.json(), actor.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not queue manual message.");
  }
}
