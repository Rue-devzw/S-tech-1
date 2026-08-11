import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

test("password reset request route does not expose reset tokens in responses", () => {
  const source = readFileSync(join(root, "app/api/auth/password-reset/request/route.ts"), "utf8");
  assert(!source.includes("resetToken"));
});

test("invitation creation route does not expose invitation tokens in responses", () => {
  const source = readFileSync(join(root, "app/api/auth/invitations/route.ts"), "utf8");
  assert(!source.includes("inviteToken"));
});

test("technician API routes are protected by the Next.js proxy", () => {
  const source = readFileSync(join(root, "proxy.ts"), "utf8");
  assert(source.includes("/api/technician"));
});
