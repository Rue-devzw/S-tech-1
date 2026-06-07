import { NextResponse } from "next/server";
import { apiError, paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requireAnyPermission, requirePermission } from "@/server/rbac";
import { createExpense } from "@/server/services/finance";
import { listQuerySchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requireAnyPermission(["invoices:manage", "payments:record", "reports:view"]);
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = {
    deletedAt: null,
    ...(query.status ? { status: query.status as never } : {}),
    ...(query.q
      ? {
          OR: [
            { expenseNumber: { contains: query.q, mode: "insensitive" as const } },
            { vendorName: { contains: query.q, mode: "insensitive" as const } },
            { category: { contains: query.q, mode: "insensitive" as const } },
            { description: { contains: query.q, mode: "insensitive" as const } },
            { reference: { contains: query.q, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.expense.findMany({ where, skip: page.skip, take: page.take, orderBy: { expenseDate: query.order }, include: { recordedBy: { select: { name: true, email: true } } } }),
    prisma.expense.count({ where })
  ]);

  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}

export async function POST(request: Request) {
  const actor = await requirePermission("payments:record");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const expense = await createExpense(await request.json(), actor.id);
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not record expense.");
  }
}
