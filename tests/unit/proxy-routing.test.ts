import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "../../proxy";

function request(url: string, host: string) {
  return new NextRequest(url, { headers: { host } });
}

test("shop root rewrites to the storefront while preserving the public URL", async () => {
  const response = await proxy(request("https://shop.s-techsolutions.org/", "shop.s-techsolutions.org"));
  assert.equal(response.headers.get("x-middleware-rewrite"), "https://shop.s-techsolutions.org/shop");
});

test("portal registration is public and rewrites to the existing registration page", async () => {
  const response = await proxy(request("https://portal.s-techsolutions.org/register", "portal.s-techsolutions.org"));
  assert.equal(response.headers.get("x-middleware-rewrite"), "https://portal.s-techsolutions.org/customer/register");
});

test("portal and staff roots still enforce authentication", async () => {
  const portalResponse = await proxy(request("https://portal.s-techsolutions.org/", "portal.s-techsolutions.org"));
  const staffResponse = await proxy(request("https://staff.s-techsolutions.org/", "staff.s-techsolutions.org"));

  assert.equal(portalResponse.status, 307);
  assert.equal(portalResponse.headers.get("location"), "https://portal.s-techsolutions.org/login?next=%2F");
  assert.equal(staffResponse.status, 307);
  assert.equal(staffResponse.headers.get("location"), "https://staff.s-techsolutions.org/login?next=%2F");
});

test("legacy department paths redirect to their canonical subdomain", async () => {
  const shopResponse = await proxy(request("https://www.s-techsolutions.org/shop?query=Apple", "www.s-techsolutions.org"));
  const adminResponse = await proxy(request("https://www.s-techsolutions.org/admin/products", "www.s-techsolutions.org"));

  assert.equal(shopResponse.headers.get("location"), "https://shop.s-techsolutions.org/?query=Apple");
  assert.equal(adminResponse.headers.get("location"), "https://staff.s-techsolutions.org/admin/products");
});

test("localhost retains the original path-based routes", async () => {
  const response = await proxy(request("http://localhost:3000/", "localhost:3000"));
  assert.equal(response.headers.get("x-middleware-next"), "1");
});
