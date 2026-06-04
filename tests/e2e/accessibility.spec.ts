import { expect, test } from "@playwright/test";

test("request service form has accessible labels and validation", async ({ page }) => {
  await page.goto("/request-service");

  await expect(page.getByRole("heading", { name: /Tell us what needs/i })).toBeVisible();
  await expect(page.getByLabel(/Full name/i)).toBeVisible();
  await expect(page.getByLabel(/Phone/i)).toBeVisible();
  await expect(page.getByLabel(/Service needed/i)).toBeVisible();
  await expect(page.getByLabel(/Tell us what you need/i)).toBeVisible();

  const submit = page.getByRole("button", { name: /Submit service request/i });
  await expect(submit).toBeVisible();
});

test("mobile navigation exposes primary conversion path", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByLabel("Open request service")).toBeVisible();
});
