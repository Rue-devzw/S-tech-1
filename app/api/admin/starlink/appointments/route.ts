import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { bookStarlinkAppointment } from "@/server/services/starlink-module";

export async function POST(request: Request) {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const appointment = await bookStarlinkAppointment(await request.json(), actor.id);
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not book Starlink-related appointment.");
  }
}
