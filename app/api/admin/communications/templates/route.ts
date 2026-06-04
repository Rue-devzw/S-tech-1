import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { listMessageTemplates, upsertMessageTemplate } from "@/server/services/communication-engine";

export async function GET() {
  const actor = await requirePermission("notifications:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const templates = await listMessageTemplates();
  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const actor = await requirePermission("notifications:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const template = await upsertMessageTemplate(await request.json(), actor.id);
    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save message template.");
  }
}
