import { NextResponse } from "next/server";
import { apiError, paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";
import { listQuerySchema, serviceUpsertSchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requirePermission("settings:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = { deletedAt: null, ...(query.q ? { name: { contains: query.q, mode: "insensitive" as const } } : {}) };
  const [items, total] = await Promise.all([
    prisma.service.findMany({ where, skip: page.skip, take: page.take, orderBy: { updatedAt: query.order }, include: { category: true } }),
    prisma.service.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}

export async function POST(request: Request) {
  const actor = await requirePermission("settings:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const parsed = serviceUpsertSchema.parse(await request.json());
    const service = await prisma.service.upsert({ where: { slug: parsed.slug }, update: parsed, create: parsed });
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save service.");
  }
}
