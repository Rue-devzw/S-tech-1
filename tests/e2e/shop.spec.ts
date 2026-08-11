import { expect, test } from "@playwright/test";

test.describe("OmniTech Import Store E2E", () => {
  test("storefront loads and displays products", async ({ page }) => {
    await page.goto("/shop");

    await expect(page).toHaveTitle(/Shop Gadgets \| OmniTech Solutions/);
    await expect(page.getByRole("heading", { level: 1, name: "OmniTech Import Store" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Popular categories" }).getByRole("link", { name: /Phones \d+ products/ })).toBeVisible();
    await expect(page.getByLabel("Pre-order terms")).toContainText("90% deposit");
    await expect(page.getByLabel("Pre-order terms")).toContainText("$5-$10");
    await expect(page.getByText("Device condition disclosure")).toBeVisible();
    await expect(page.getByLabel("Pre-order terms")).toContainText("Pre-order · 3-14 days");

    const cataloguePhone = page.getByRole("heading", { level: 3, name: "Samsung S26 Ultra 512GB" }).locator("..", { hasText: "$999.31" });
    await expect(cataloguePhone).toContainText("Pre-order · estimated 3-14 days");
    await expect(cataloguePhone).toContainText(/A\+ grade refurbished/i);
    await expect(cataloguePhone).toContainText("90% deposit · 10% on collection");

    const whatsappButtons = page.getByRole("link", { name: /Order .* via WhatsApp/i });
    await expect(whatsappButtons.first()).toBeVisible();
    await expect(whatsappButtons.first()).toHaveAttribute("href", /wa\.me\/263718704505/);
  });
});
