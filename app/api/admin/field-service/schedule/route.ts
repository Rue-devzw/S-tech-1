import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { bookFieldAppointment, listFieldSchedule } from "@/server/services/field-service-module";

export async function GET() {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const visits = await listFieldSchedule();
  return NextResponse.json({ visits });
}

export async function POST(request: Request) {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const result = await bookFieldAppointment(await request.json(), actor.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not book field appointment.");
  }
}
