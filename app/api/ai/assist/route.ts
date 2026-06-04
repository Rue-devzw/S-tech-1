import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { runAIAssistant } from "@/server/services/ai-assistant";

export async function POST(request: Request) {
  const actor = await requirePermission("ai:use");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const interaction = await runAIAssistant(await request.json(), actor.id);
    return NextResponse.json({ interaction }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not run AI assistant.");
  }
}
