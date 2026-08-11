import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiError } from "@/server/api-utils";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { deleteProductImage } from "@/server/product-images";
import { requirePermission } from "@/server/rbac";
import { productUpsertSchema } from "@/server/validation";

type ProductRouteContext = { params: Promise<{ id: string }> };

async function removeUnreferencedImages(urls: string[]) {
  for (const url of urls) {
    try {
      const references = await prisma.product.count({ where: { images: { has: url } } });
      if (references === 0) await deleteProductImage(url);
    } catch {
      // Product data is authoritative; an orphaned file can be cleaned up separately.
    }
  }
}

export async function PATCH(request: Request, { params }: ProductRouteContext) {
  const actor = await requirePermission("products:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const data = productUpsertSchema.parse(await request.json());
    const previous = await prisma.product.findUniqueOrThrow({ where: { id } });
    const product = await prisma.product.update({ where: { id }, data });
    const removedImages = previous.images.filter((image) => !product.images.includes(image));
    await removeUnreferencedImages(removedImages);
    await audit("product.updated", "Product", product.id, actor.id, { slug: product.slug, published: product.isPublished });
    revalidatePath("/");
    revalidatePath("/shop");
    return NextResponse.json({ product });
  } catch (error) {
    return apiError(error, "The product could not be updated.");
  }
}

export async function DELETE(_request: Request, { params }: ProductRouteContext) {
  const actor = await requirePermission("products:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: { _count: { select: { orderItems: true } } }
    });
    if (product._count.orderItems > 0) {
      return NextResponse.json(
        { error: "This product has order history. Unpublish it instead so historical orders remain intact." },
        { status: 409 }
      );
    }

    await prisma.product.delete({ where: { id } });
    await removeUnreferencedImages(product.images);
    await audit("product.deleted", "Product", id, actor.id, { slug: product.slug });
    revalidatePath("/");
    revalidatePath("/shop");
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return apiError(error, "The product could not be deleted.");
  }
}
