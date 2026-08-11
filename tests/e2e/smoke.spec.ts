import { expect, test } from "@playwright/test";

test("shop-first homepage exposes products and service intake", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Top tech, made easy/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Order .* via WhatsApp/i }).first()).toBeVisible();
  await page.getByRole("link", { name: /Request service/i }).first().click();
  await expect(page).toHaveURL(/\/request-service/);
  await expect(page.getByRole("heading", { name: /Tell us what needs/i })).toBeVisible();
});

test("services catalogue is reachable from public navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Services" }).first().click();
  await expect(page.getByRole("heading", { name: /Repair, connectivity, software/i })).toBeVisible();
});

test("protected dashboards redirect anonymous users to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin/);

  await page.goto("/technician");
  await expect(page).toHaveURL(/\/login\?next=%2Ftechnician/);

  await page.goto("/customer");
  await expect(page).toHaveURL(/\/login\?next=%2Fcustomer/);
});
