import { NextResponse } from "next/server";
import { apiError, paginated, pagination, searchParams } from "@/server/api-utils";
import { prisma } from "@/server/db";
import { requireAnyPermission, requirePermission } from "@/server/rbac";
import { inventoryItemSchema, listQuerySchema } from "@/server/validation";

export async function GET(request: Request) {
  const actor = await requireAnyPermission(["inventory:view", "inventory:manage"]);
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = { deletedAt: null, ...(query.q ? { OR: [{ name: { contains: query.q, mode: "insensitive" as const } }, { sku: { contains: query.q, mode: "insensitive" as const } }, { category: { contains: query.q, mode: "insensitive" as const } }] } : {}) };
  const [items, total] = await Promise.all([
    prisma.inventoryItem.findMany({ where, skip: page.skip, take: page.take, orderBy: { updatedAt: query.order }, include: { supplier: true } }),
    prisma.inventoryItem.count({ where })
  ]);
  return NextResponse.json(paginated(items, total, page.page, page.pageSize));
}

export async function POST(request: Request) {
  const actor = await requirePermission("inventory:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const parsed = inventoryItemSchema.parse(await request.json());
    const item = await prisma.inventoryItem.upsert({ where: { sku: parsed.sku }, update: parsed, create: parsed });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save inventory item.");
  }
}
