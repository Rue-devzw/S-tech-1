import assert from "node:assert/strict";
import test from "node:test";
import {
  accountStatusUpdateSchema,
  aiAssistSchema,
  customerRegisterSchema,
  fieldAppointmentSchema,
  fieldVisitEvidenceSchema,
  invoiceConversionSchema,
  paymentRecordSchema,
  productUpsertSchema,
  quotationDecisionSchema,
  repairIntakeSchema,
  serviceRequestSchema
} from "../../src/server/validation";

test("service request intake validates required customer and service fields", () => {
  const parsed = serviceRequestSchema.parse({
    name: "Tariro Moyo",
    phone: "+263770000000",
    serviceId: "svc_123",
    title: "Laptop will not power on",
    description: "The laptop stopped powering on after a power cut.",
    urgency: "HIGH"
  });

  assert.equal(parsed.urgency, "HIGH");
  assert.equal(parsed.email, undefined);
});

test("customer registration enforces strong password length", () => {
  assert.throws(() =>
    customerRegisterSchema.parse({
      name: "Customer",
      email: "customer@example.com",
      phone: "+263770000000",
      password: "short"
    })
  );
});

test("payment records require positive amounts and known methods", () => {
  const parsed = paymentRecordSchema.parse({
    invoiceId: "inv_123",
    amount: 50,
    method: "CASH"
  });

  assert.equal(parsed.amount, 50);
  assert.throws(() => paymentRecordSchema.parse({ invoiceId: "inv_123", amount: 0, method: "CASH" }));
});

test("quotation decision, invoice conversion and account status schemas accept valid workflow input", () => {
  assert.equal(quotationDecisionSchema.parse({ decision: "ACCEPTED" }).decision, "ACCEPTED");
  assert.equal(invoiceConversionSchema.parse({ dueAt: "2026-06-30" }).dueAt, "2026-06-30");
  assert.equal(accountStatusUpdateSchema.parse({ status: "SUSPENDED", isActive: false }).isActive, false);
});

test("field appointments validate scheduling and location fields", () => {
  const parsed = fieldAppointmentSchema.parse({
    customerId: "cus_123",
    serviceType: "STARLINK",
    title: "Starlink installation",
    startsAt: "2026-06-01T08:00:00.000Z",
    endsAt: "2026-06-01T10:00:00.000Z",
    address: "Harare"
  });

  assert.equal(parsed.serviceType, "STARLINK");
});

test("AI assistant schema requires a known function type", () => {
  assert.equal(
    aiAssistSchema.parse({
      type: "TECHNICIAN_TROUBLESHOOTING",
      input: "Laptop does not power on after charging port replacement."
    }).type,
    "TECHNICIAN_TROUBLESHOOTING"
  );
});

test("file references reject unsafe URLs and filenames", () => {
  const baseRepair = {
    customerId: "cus_123",
    device: { type: "LAPTOP" },
    faultCategory: "NO_POWER",
    faultDescription: "Laptop does not power on after a power surge."
  };

  assert.throws(() =>
    repairIntakeSchema.parse({
      ...baseRepair,
      conditionPhotos: [{ filename: "../secret.txt", url: "javascript:alert(1)" }]
    })
  );

  assert.equal(
    fieldVisitEvidenceSchema.parse({
      fieldPhotos: [{ filename: "site-front.jpg", url: "/storage/uploads/site-front.jpg" }]
    }).fieldPhotos[0].filename,
    "site-front.jpg"
  );
});

test("shop products accept managed local and GitHub images but reject arbitrary remote URLs", () => {
  const product = {
    slug: "test-laptop",
    name: "Test Laptop 16GB/512GB",
    category: "LAPTOP",
    brand: "OmniTech",
    description: "A complete product description for catalogue testing.",
    specifications: { memory: "16GB", storage: "512GB SSD" },
    condition: "BRAND_NEW",
    fulfillment: "IN_STOCK",
    costPrice: 500,
    sellingPrice: 650,
    depositPercentage: 50,
    stockQuantity: 3,
    images: ["/uploads/products/test-laptop.webp"],
    featured: false,
    isPublished: true,
    warrantyDays: 90
  };

  assert.equal(productUpsertSchema.parse(product).images[0], "/uploads/products/test-laptop.webp");
  const githubImage = "https://raw.githubusercontent.com/StriveRue/S-tech/product-media/public/uploads/products/test-laptop.webp";
  assert.equal(productUpsertSchema.parse({ ...product, images: [githubImage] }).images[0], githubImage);
  assert.throws(() => productUpsertSchema.parse({ ...product, condition: "SOURCED_ONLINE", fulfillment: "PRE_ORDER_OVERSEAS" }));
  assert.throws(() => productUpsertSchema.parse({ ...product, images: ["https://example.com/product.webp"] }));
});
