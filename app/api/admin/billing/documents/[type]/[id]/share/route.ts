import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { shareBillingDocument } from "@/server/services/billing-module";

const allowedTypes = ["quotation", "invoice", "receipt"] as const;

export async function POST(request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const actor = await requirePermission("invoices:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ type, id }, body] = await Promise.all([params, request.json()]);
    if (!allowedTypes.includes(type as never)) return NextResponse.json({ error: "Unsupported document type." }, { status: 400 });
    const result = await shareBillingDocument(type as (typeof allowedTypes)[number], id, body, actor.id);
    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "Could not share billing document.");
  }
}
