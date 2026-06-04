import { NextResponse } from "next/server";
import { requirePermission } from "@/server/rbac";
import { listDeliveryLogs } from "@/server/services/communication-engine";

export async function GET() {
  const actor = await requirePermission("notifications:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const logs = await listDeliveryLogs();
  return NextResponse.json({ logs });
}
