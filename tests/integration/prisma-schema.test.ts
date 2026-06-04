import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Prisma schema validates", () => {
  const output = execFileSync("./node_modules/.bin/prisma", ["validate"], {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/omnitech?schema=public"
    },
    encoding: "utf8"
  });

  assert.match(output, /valid/);
});

test("database schema contains core workflow models and indexes", () => {
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  for (const model of ["ServiceRequest", "JobCard", "Diagnosis", "Quotation", "Invoice", "Payment", "Warranty", "AuditLog"]) {
    assert.match(schema, new RegExp(`model ${model} \\{`));
  }
  assert.match(schema, /@@index\(\[customerId, status\]\)/);
  assert.match(schema, /@@index\(\[status, publishedAt\]\)/);
});
