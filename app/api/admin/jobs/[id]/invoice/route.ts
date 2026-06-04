import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { createInvoiceForJob } from "@/server/services/job-workflow";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("invoices:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const invoice = await createInvoiceForJob(actor.id, id);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not create invoice.");
  }
}
