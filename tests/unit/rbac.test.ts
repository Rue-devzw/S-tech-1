import assert from "node:assert/strict";
import test from "node:test";
import { roleHasPermission } from "../../src/server/rbac";

test("super admin has wildcard access", () => {
  assert.equal(roleHasPermission("SUPER_ADMIN", "settings:manage"), true);
  assert.equal(roleHasPermission("SUPER_ADMIN", "anything:new"), true);
});

test("technician can update assigned jobs but cannot manage invoices or settings", () => {
  assert.equal(roleHasPermission("TECHNICIAN", "jobs:update_assigned"), true);
  assert.equal(roleHasPermission("TECHNICIAN", "invoices:manage"), false);
  assert.equal(roleHasPermission("TECHNICIAN", "settings:manage"), false);
});

test("sales and marketing can manage content campaigns and approve AI drafts", () => {
  assert.equal(roleHasPermission("SALES_MARKETING", "promotions:manage"), true);
  assert.equal(roleHasPermission("SALES_MARKETING", "content:manage"), true);
  assert.equal(roleHasPermission("SALES_MARKETING", "ai:approve"), true);
});

test("customer is limited to portal and own-record operations", () => {
  assert.equal(roleHasPermission("CUSTOMER", "portal:view"), true);
  assert.equal(roleHasPermission("CUSTOMER", "jobs:manage"), false);
});
