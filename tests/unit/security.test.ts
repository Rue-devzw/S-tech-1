import assert from "node:assert/strict";
import test from "node:test";
import { rateLimit, redactContext, redactSensitiveText } from "../../src/server/security";

test("redactSensitiveText removes direct customer and secret data", () => {
  const redacted = redactSensitiveText("Email user@example.com, phone +263 77 000 0000, password: hunter2, token=sk-1234567890abcdef1234567890abcdef");

  assert(!redacted.includes("user@example.com"));
  assert(!redacted.includes("+263 77"));
  assert(!redacted.includes("hunter2"));
  assert(!redacted.includes("sk-123456"));
});

test("redactContext masks sensitive keys recursively", () => {
  const redacted = redactContext({
    customer: { email: "customer@example.com", phone: "+263770000000" },
    apiKey: "secret-key",
    nested: [{ password: "plain-text" }]
  });

  assert.equal(redacted.apiKey, "[redacted]");
  assert.equal(redacted.nested[0].password, "[redacted]");
  assert.equal(redacted.customer.email, "[redacted-email]");
  assert.equal(redacted.customer.phone, "[redacted-phone]");
});

test("rateLimit blocks after the configured number of attempts", () => {
  const request = new Request("https://omnitech.test/login", { headers: { "x-forwarded-for": "198.51.100.24" } });
  const scope = `unit-${Date.now()}`;

  assert.equal(rateLimit(request, scope, 2, 60_000).ok, true);
  assert.equal(rateLimit(request, scope, 2, 60_000).ok, true);
  assert.equal(rateLimit(request, scope, 2, 60_000).ok, false);
});
