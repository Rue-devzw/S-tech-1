import { NextResponse } from "next/server";
import { requirePermission } from "@/server/rbac";
import { listAIInteractions } from "@/server/services/ai-assistant";

export async function GET() {
  const actor = await requirePermission("ai:approve");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const interactions = await listAIInteractions();
  return NextResponse.json({ interactions });
}
