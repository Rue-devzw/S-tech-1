import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { recordPaymentForInvoice } from "@/server/services/job-workflow";

export async function POST(request: Request) {
  const actor = await requirePermission("payments:record");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const payment = await recordPaymentForInvoice(await request.json(), actor.id);
    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not record payment.");
  }
}
