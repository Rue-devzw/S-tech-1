import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { defaultTemplates, triggerNotification } from "@/server/services/communication-engine";

export async function GET() {
  const actor = await requirePermission("notifications:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ triggers: defaultTemplates });
}

export async function POST(request: Request) {
  const actor = await requirePermission("notifications:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const notifications = await triggerNotification(await request.json(), actor.id);
    return NextResponse.json({ notifications }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not trigger notification.");
  }
}
