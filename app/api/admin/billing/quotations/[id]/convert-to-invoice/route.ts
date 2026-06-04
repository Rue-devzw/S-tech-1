import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { convertQuotationToInvoice } from "@/server/services/billing-module";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("invoices:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json().catch(() => ({}))]);
    const invoice = await convertQuotationToInvoice(id, body, actor.id);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not convert quotation to invoice.");
  }
}
