import { NextResponse } from "next/server";
import { apiError, paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";
import { appointmentSchema, listQuerySchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = { deletedAt: null, ...(query.status ? { status: query.status as never } : {}) };
  const [items, total] = await Promise.all([
    prisma.appointment.findMany({ where, skip: page.skip, take: page.take, orderBy: { startsAt: query.order }, include: { customer: true, assignedTo: true, jobCard: true, serviceRequest: true } }),
    prisma.appointment.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}

export async function POST(request: Request) {
  const actor = await requirePermission("field_visits:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const parsed = appointmentSchema.parse(await request.json());
    const appointment = await prisma.appointment.create({ data: { ...parsed, startsAt: new Date(parsed.startsAt), endsAt: new Date(parsed.endsAt) } });
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save appointment.");
  }
}
