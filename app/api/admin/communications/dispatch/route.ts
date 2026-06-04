import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { dispatchQueuedNotifications } from "@/server/services/communication-engine";

export async function POST(request: Request) {
  const actor = await requirePermission("notifications:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const results = await dispatchQueuedNotifications(await request.json().catch(() => ({})), actor.id);
    return NextResponse.json({ results });
  } catch (error) {
    return apiError(error, "Could not dispatch queued notifications.");
  }
}
