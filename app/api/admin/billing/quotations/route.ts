import { NextResponse } from "next/server";
import { apiError, paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";
import { createQuotationDraft } from "@/server/services/billing-module";
import { listQuerySchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requirePermission("quotes:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = {
    deletedAt: null,
    ...(query.status ? { status: query.status as never } : {}),
    ...(query.q ? { OR: [{ quotationNumber: { contains: query.q, mode: "insensitive" as const } }, { customer: { name: { contains: query.q, mode: "insensitive" as const } } }] } : {})
  };
  const [items, total] = await Promise.all([
    prisma.quotation.findMany({ where, skip: page.skip, take: page.take, orderBy: { createdAt: query.order }, include: { customer: true, items: true, jobCard: true } }),
    prisma.quotation.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}

export async function POST(request: Request) {
  const actor = await requirePermission("quotes:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const quotation = await createQuotationDraft(await request.json(), actor.id);
    return NextResponse.json({ quotation }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not create quotation draft.");
  }
}
