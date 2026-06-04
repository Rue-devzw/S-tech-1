import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { sendQuotation } from "@/server/services/billing-module";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("quotes:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const quotation = await sendQuotation(id, actor.id);
    return NextResponse.json({ quotation });
  } catch (error) {
    return apiError(error, "Could not send quotation.");
  }
}
