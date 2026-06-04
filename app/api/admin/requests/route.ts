import { NextResponse } from "next/server";
import { paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";
import { listQuerySchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requirePermission("requests:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = {
    deletedAt: null,
    ...(query.status ? { status: query.status as never } : {}),
    ...(query.q ? { OR: [{ requestNumber: { contains: query.q, mode: "insensitive" as const } }, { title: { contains: query.q, mode: "insensitive" as const } }, { customer: { name: { contains: query.q, mode: "insensitive" as const } } }] } : {})
  };
  const [items, total] = await Promise.all([
    prisma.serviceRequest.findMany({ where, skip: page.skip, take: page.take, orderBy: { createdAt: query.order }, include: { customer: true, service: { include: { category: true } }, jobCard: true } }),
    prisma.serviceRequest.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}
