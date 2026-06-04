import { NextResponse } from "next/server";
import { paginated, pagination, searchParams } from "@/server/api-utils";
import { requirePermission } from "@/server/rbac";
import { prisma } from "@/server/db";
import { listQuerySchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requirePermission("jobs:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = {
    deletedAt: null,
    ...(query.status ? { status: query.status as never } : {}),
    ...(query.q
      ? { OR: [{ jobNumber: { contains: query.q, mode: "insensitive" as const } }, { faultReported: { contains: query.q, mode: "insensitive" as const } }, { customer: { name: { contains: query.q, mode: "insensitive" as const } } }] }
      : {})
  };
  const [items, total] = await Promise.all([
    prisma.jobCard.findMany({ where, skip: page.skip, take: page.take, orderBy: { updatedAt: query.order }, include: { customer: true, assignedTo: true, device: true } }),
    prisma.jobCard.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}

export async function POST() {
  return NextResponse.json({ error: "Create jobs through POST /api/admin/workflow/review or repair intake workflows." }, { status: 405 });
}
