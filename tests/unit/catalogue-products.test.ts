import assert from "node:assert/strict";
import test from "node:test";
import { CATALOGUE_PHONE_COUNT, cataloguePhoneProducts } from "../../src/lib/catalogue-products";

test("customer catalogue exposes all 120 phone variants with formal pre-order terms", () => {
  assert.equal(CATALOGUE_PHONE_COUNT, 120);
  assert.equal(cataloguePhoneProducts.length, CATALOGUE_PHONE_COUNT);
  assert.equal(new Set(cataloguePhoneProducts.map((product) => product.slug)).size, CATALOGUE_PHONE_COUNT);

  for (const product of cataloguePhoneProducts) {
    assert.equal(product.category, "PHONE");
    assert.equal(product.condition, "REFURBISHED");
    assert.equal(product.fulfillment, "PRE_ORDER_OVERSEAS");
    assert.equal(product.depositPercentage, 90);
    assert.equal(product.stockQuantity, 0);
    assert.equal(product.specifications.shippingTime, "3-14 days");
    assert.equal(product.specifications.condition, "A+ grade renewed");
    assert.equal(product.specifications.deliveryOutsideHarare, "$5-$10 courier fee");
  }
});

test("catalogue preserves representative customer prices and brand counts", () => {
  assert.equal(cataloguePhoneProducts.filter((product) => product.brand === "Apple").length, 48);
  assert.equal(cataloguePhoneProducts.filter((product) => product.brand === "Google").length, 4);
  assert.equal(cataloguePhoneProducts.filter((product) => product.brand === "Samsung").length, 68);
  assert.equal(cataloguePhoneProducts.find((product) => product.name === "Samsung S26 Ultra 512GB")?.sellingPrice, 999.31);
  assert.equal(cataloguePhoneProducts.find((product) => product.name === "Samsung A14 128GB")?.sellingPrice, 87.55);
  assert.equal(cataloguePhoneProducts.find((product) => product.name === "Google Pixel 8 128GB")?.sellingPrice, 258.88);
  assert.equal(cataloguePhoneProducts.find((product) => product.name === "Apple iPhone 14 Pro 256GB eSIM")?.sellingPrice, 474.84);
  assert.equal(cataloguePhoneProducts.find((product) => product.name === "Apple iPhone 17 Pro Max 256GB")?.sellingPrice, 1387.10);
  assert.equal(cataloguePhoneProducts.some((product) => product.name.includes("Waterproof")), false);
});
