import assert from "node:assert/strict";
import test from "node:test";
import { createOrder, getPublishedProducts } from "../../src/server/services/shop";

function product(overrides: Record<string, unknown> = {}) {
  return {
    id: "prod_123",
    slug: "test-product",
    name: "Test product",
    category: "LAPTOP",
    brand: "OmniTech",
    description: "Test product",
    specifications: {},
    condition: "BRAND_NEW",
    fulfillment: "PRE_ORDER_OVERSEAS",
    costPrice: 700,
    sellingPrice: 850,
    depositPercentage: 50,
    stockQuantity: 0,
    images: [],
    featured: false,
    isPublished: true,
    warrantyDays: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

test("getPublishedProducts fetches published products newest first", async () => {
  let received: unknown;
  const products = [product(), product({ id: "prod_456", name: "Second product" })];
  const database = {
    product: { findMany: async (args: unknown) => ((received = args), products) }
  };

  const result = await getPublishedProducts(undefined, database as never);

  assert.equal(result.length, 2);
  assert.deepEqual(received, { where: { isPublished: true }, orderBy: { createdAt: "desc" } });
});

test("getPublishedProducts applies a category filter", async () => {
  let received: unknown;
  const database = {
    product: { findMany: async (args: unknown) => ((received = args), []) }
  };

  await getPublishedProducts("LAPTOP", database as never);
  assert.deepEqual(received, {
    where: { isPublished: true, category: "LAPTOP" },
    orderBy: { createdAt: "desc" }
  });
});

test("createOrder calculates totals from database prices and generates tracking number", async () => {
  let productLookup: unknown;
  let orderCreate: any;
  const database = {
    product: {
      findUniqueOrThrow: async (args: unknown) => {
        productLookup = args;
        return product();
      }
    },
    order: {
      create: async (args: any) => {
        orderCreate = args;
        return { id: "order_abc", ...args.data };
      }
    }
  };

  const result = await createOrder(
    {
      customerName: "Tendai M.",
      customerPhone: "+263718000000",
      items: [{ productId: "prod_123", quantity: 2 }]
    },
    database as never
  );

  assert.deepEqual(productLookup, { where: { id: "prod_123" } });
  assert.equal(result.totalAmount, 1700);
  assert.equal(result.balanceDue, 1700);
  assert.equal(result.status, "PENDING_DEPOSIT");
  assert.match(result.orderNumber, /^ORD-\d{4}-\d{4}$/);
  assert.equal(orderCreate.data.items.create[0].unitPrice, 850);
});

test("createOrder rejects empty orders and invalid quantities before writing", async () => {
  let writes = 0;
  const database = {
    product: { findUniqueOrThrow: async () => product() },
    order: { create: async () => void writes++ }
  };

  await assert.rejects(
    createOrder({ customerName: "Invalid Order", customerPhone: "+263000000", items: [] }, database as never),
    /at least one item/
  );
  await assert.rejects(
    createOrder({ customerName: "Invalid Order", customerPhone: "+263000000", items: [{ productId: "prod_123", quantity: 0 }] }, database as never),
    /positive whole-number quantity/
  );
  assert.equal(writes, 0);
});
