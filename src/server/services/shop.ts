import type { PrismaClient, ProductCategory } from "@prisma/client";
import { prisma } from "@/server/db";

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: { productId: string; quantity: number }[];
};

type ShopDatabase = Pick<PrismaClient, "product" | "order">;

export async function getPublishedProducts(category?: ProductCategory, database: ShopDatabase = prisma) {
  return database.product.findMany({
    where: {
      isPublished: true,
      ...(category ? { category } : {})
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getProductBySlug(slug: string, database: ShopDatabase = prisma) {
  return database.product.findUniqueOrThrow({
    where: { slug, isPublished: true }
  });
}

export async function createOrder(data: CreateOrderInput, database: ShopDatabase = prisma) {
  const customerName = data.customerName.trim();
  const customerPhone = data.customerPhone.trim();

  if (!customerName || !customerPhone) {
    throw new Error("Customer name and phone are required.");
  }
  if (!data.items?.length) {
    throw new Error("Order must contain at least one item.");
  }
  if (data.items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
    throw new Error("Every order item must have a product and a positive whole-number quantity.");
  }

  const products = await Promise.all(
    data.items.map((item) => database.product.findUniqueOrThrow({ where: { id: item.productId } }))
  );

  let totalAmount = 0;
  const orderItemsData = products.map((product, index) => {
    const item = data.items[index];
    if (!product.isPublished) throw new Error(`${product.name} is not available for sale.`);
    if (product.fulfillment === "IN_STOCK" && product.stockQuantity < item.quantity) {
      throw new Error(`Only ${product.stockQuantity} unit(s) of ${product.name} are in stock.`);
    }

    totalAmount += product.sellingPrice * item.quantity;
    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.sellingPrice
    };
  });

  const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return database.order.create({
    data: {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: data.customerEmail?.trim() || undefined,
      totalAmount,
      balanceDue: totalAmount,
      status: "PENDING_DEPOSIT",
      items: { create: orderItemsData }
    },
    include: { items: { include: { product: true } } }
  });
}
