import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/server/api-utils";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { deleteProductImage, isManagedProductImageUrl, saveProductImage } from "@/server/product-images";
import { requirePermission } from "@/server/rbac";

export const runtime = "nodejs";

const deleteImageSchema = z.object({
  url: z.string().refine(isManagedProductImageUrl, "Invalid managed product image path.")
});

export async function POST(request: Request) {
  const actor = await requirePermission("products:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });

    const image = await saveProductImage(file);
    await audit("product.image.uploaded", "ProductImage", image.filename, actor.id, { url: image.url, size: image.size });
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    return apiError(error, "The product image could not be uploaded.");
  }
}

export async function DELETE(request: Request) {
  const actor = await requirePermission("products:manage");
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { url } = deleteImageSchema.parse(await request.json());
    const references = await prisma.product.count({ where: { images: { has: url } } });
    if (references > 0) {
      return NextResponse.json({ error: "Remove this image from every product before deleting its file." }, { status: 409 });
    }

    const removed = await deleteProductImage(url);
    await audit("product.image.deleted", "ProductImage", url, actor.id, { removed });
    return NextResponse.json({ removed });
  } catch (error) {
    return apiError(error, "The product image could not be deleted.");
  }
}
