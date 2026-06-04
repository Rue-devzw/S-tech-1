import { expect, test } from "@playwright/test";

test("API docs expose REST endpoint map", async ({ request }) => {
  const response = await request.get("/api/docs");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.name).toContain("OmniTech Solutions REST API");
  expect(body.endpoints.auth).toContain("/api/auth/login");
  expect(body.endpoints.jobs).toContain("/api/admin/jobs");
});

test("protected admin API rejects anonymous requests", async ({ request }) => {
  const response = await request.get("/api/admin/customers");
  expect(response.status()).toBe(401);
  await expect(response.json()).resolves.toMatchObject({ error: "Unauthorized" });
});
