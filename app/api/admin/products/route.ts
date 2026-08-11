import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiError } from "@/server/api-utils";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";
import { productUpsertSchema } from "@/server/validation";

export async function GET() {
  const actor = await requirePermission("products:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
  });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const actor = await requirePermission("products:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const data = productUpsertSchema.parse(await request.json());
    const product = await prisma.product.create({ data });
    await audit("product.created", "Product", product.id, actor.id, { slug: product.slug, published: product.isPublished });
    revalidatePath("/");
    revalidatePath("/shop");
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return apiError(error, "The product could not be created.");
  }
}
