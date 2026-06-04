import { NextResponse } from "next/server";
import { paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";
import { listQuerySchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requirePermission("invoices:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = {
    deletedAt: null,
    ...(query.status ? { status: query.status as never } : {}),
    ...(query.q ? { OR: [{ invoiceNumber: { contains: query.q, mode: "insensitive" as const } }, { customer: { name: { contains: query.q, mode: "insensitive" as const } } }] } : {})
  };
  const [items, total] = await Promise.all([
    prisma.invoice.findMany({ where, skip: page.skip, take: page.take, orderBy: { createdAt: query.order }, include: { customer: true, jobCard: true, payments: true, receipts: true } }),
    prisma.invoice.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}
