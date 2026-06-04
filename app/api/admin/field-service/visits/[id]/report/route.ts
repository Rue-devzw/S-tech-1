import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { generateServiceReport } from "@/server/services/field-service-module";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [{ id }, body] = await Promise.all([params, request.json().catch(() => ({}))]);
    const report = await generateServiceReport(id, body, actor.id);
    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not generate service report.");
  }
}
