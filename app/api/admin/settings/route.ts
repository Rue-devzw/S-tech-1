import { NextResponse } from "next/server";
import { apiError, paginated, pagination, searchParams } from "@/server/api-utils";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";
import { listQuerySchema, systemSettingSchema } from "@/server/validation";

function mask(setting: { isSecret: boolean; value: unknown }) {
  return setting.isSecret ? { ...setting, value: "***" } : setting;
}

export async function GET(request: Request) {
  const actor = await requirePermission("settings:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const query = listQuerySchema.parse(searchParams(request));
  const page = pagination(query);
  const where = query.q ? { key: { contains: query.q, mode: "insensitive" as const } } : {};
  const [items, total] = await Promise.all([
    prisma.systemSetting.findMany({ where, skip: page.skip, take: page.take, orderBy: { updatedAt: query.order } }),
    prisma.systemSetting.count({ where })
  ]);
  return NextResponse.json(paginated(items.map(mask), total, page.page, page.pageSize));
}

export async function POST(request: Request) {
  const actor = await requirePermission("settings:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const parsed = systemSettingSchema.parse(await request.json());
    const setting = await prisma.systemSetting.upsert({
      where: { key: parsed.key },
      update: { value: parsed.value as never, description: parsed.description || undefined, isSecret: parsed.isSecret, updatedById: actor.id },
      create: { key: parsed.key, value: parsed.value as never, description: parsed.description || undefined, isSecret: parsed.isSecret, updatedById: actor.id }
    });
    await audit("SYSTEM_SETTING_UPSERTED", "SystemSetting", setting.id, actor.id, {
      key: setting.key,
      isSecret: setting.isSecret
    });
    return NextResponse.json({ setting: mask(setting) }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not save setting.");
  }
}
