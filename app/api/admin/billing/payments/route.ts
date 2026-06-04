import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { recordInvoicePayment } from "@/server/services/billing-module";

export async function POST(request: Request) {
  const actor = await requirePermission("payments:record");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const result = await recordInvoicePayment(await request.json(), actor.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not record payment.");
  }
}
