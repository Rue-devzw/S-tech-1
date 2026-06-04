import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { approveAIInteraction } from "@/server/services/ai-assistant";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const actor = await requirePermission("ai:approve");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await context.params;
  try {
    const interaction = await approveAIInteraction(id, await request.json(), actor.id);
    return NextResponse.json({ interaction });
  } catch (error) {
    return apiError(error, "Could not review AI output.");
  }
}
