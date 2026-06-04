import { NextResponse } from "next/server";
import { apiError, paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requireAnyPermission, requirePermission } from "@/server/rbac";
import { customerUpsertSchema, listQuerySchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requireAnyPermission(["customers:view", "customers:manage"]);
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = {
    deletedAt: null,
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" as const } },
            { phone: { contains: query.q, mode: "insensitive" as const } },
            { email: { contains: query.q, mode: "insensitive" as const } },
            { organization: { contains: query.q, mode: "insensitive" as const } }
          ]
        }
      : {})
  };
  const [items, total] = await Promise.all([
    prisma.customer.findMany({ where, skip: page.skip, take: page.take, orderBy: { updatedAt: query.order }, include: { addresses: true } }),
    prisma.customer.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}

export async function POST(request: Request) {
  const actor = await requirePermission("customers:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const parsed = customerUpsertSchema.parse(await request.json());
    const customer = await prisma.customer.upsert({
      where: { phone: parsed.phone },
      update: parsed,
      create: parsed
    });
    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save customer.");
  }
}
