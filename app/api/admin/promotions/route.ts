import { NextResponse } from "next/server";
import { apiError, paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";
import { listQuerySchema, promotionSchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requirePermission("promotions:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = { deletedAt: null, ...(query.status ? { status: query.status as never } : {}), ...(query.q ? { title: { contains: query.q, mode: "insensitive" as const } } : {}) };
  const [items, total] = await Promise.all([
    prisma.promotion.findMany({ where, skip: page.skip, take: page.take, orderBy: { startsAt: query.order } }),
    prisma.promotion.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}

export async function POST(request: Request) {
  const actor = await requirePermission("promotions:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const parsed = promotionSchema.parse(await request.json());
    const promotion = await prisma.promotion.upsert({
      where: { slug: parsed.slug },
      update: { ...parsed, startsAt: new Date(parsed.startsAt), endsAt: new Date(parsed.endsAt) },
      create: { ...parsed, startsAt: new Date(parsed.startsAt), endsAt: new Date(parsed.endsAt) }
    });
    return NextResponse.json({ promotion }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save promotion.");
  }
}
