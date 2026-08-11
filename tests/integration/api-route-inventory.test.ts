import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const requiredRoutes = [
  "app/api/auth/login/route.ts",
  "app/api/admin/customers/route.ts",
  "app/api/services/route.ts",
  "app/api/admin/requests/route.ts",
  "app/api/admin/jobs/route.ts",
  "app/api/admin/billing/quotations/route.ts",
  "app/api/admin/billing/invoices/route.ts",
  "app/api/admin/inventory/route.ts",
  "app/api/admin/products/route.ts",
  "app/api/admin/products/[id]/route.ts",
  "app/api/admin/products/images/route.ts",
  "app/api/admin/appointments/route.ts",
  "app/api/admin/communications/logs/route.ts",
  "app/api/admin/promotions/route.ts",
  "app/api/admin/portfolio/projects/route.ts",
  "app/api/admin/blog/posts/route.ts",
  "app/api/ai/assist/route.ts",
  "app/api/admin/reports/operations/route.ts",
  "app/api/admin/settings/route.ts",
  "app/api/docs/route.ts"
];

test("required REST API route modules exist", () => {
  for (const route of requiredRoutes) {
    assert.equal(existsSync(route), true, `${route} should exist`);
  }
});

test("API documentation covers every required platform module", () => {
  const docs = readFileSync("docs/api.md", "utf8");
  for (const module of ["Auth", "Customers", "Services", "Requests", "Jobs", "Quotations", "Invoices", "Inventory", "Products", "Appointments", "Notifications", "Promotions", "Portfolio", "Blog", "AI", "Reports", "Settings"]) {
    assert.match(docs, new RegExp(`\\| ${module} \\|`));
  }
});
