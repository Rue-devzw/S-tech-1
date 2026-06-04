import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { confirmCustomerCollection } from "@/server/services/repair-module";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("jobs:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const confirmation = await confirmCustomerCollection(id, body, actor.id);
    return NextResponse.json({ confirmation }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not confirm customer collection.");
  }
}
