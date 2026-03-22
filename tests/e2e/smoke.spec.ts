import { expect, test } from "@playwright/test";
import { createHmac } from "node:crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const adminUsername = process.env.PLAYWRIGHT_ADMIN_USERNAME ?? "admin";
let adminPassword = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "Playwright!234";
const cronSecret = process.env.PLAYWRIGHT_CRON_SECRET ?? "playwright-cron-secret";

interface AnalyticsOverviewSnapshot {
  stats?: {
    uniqueVisitors?: { value?: number };
    listingViews?: { value?: number };
    inquiries?: { value?: number };
  };
}

function createCurrentTotpCode(secret: string, timestamp = Date.now()) {
  const normalizedSecret = secret.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const character of normalizedSecret) {
    const index = BASE32_ALPHABET.indexOf(character);
    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  const key = Buffer.from(bytes);
  const counter = Math.floor(timestamp / 30_000);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", key).update(buffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 1_000_000).padStart(6, "0");
}

test("public catalog content renders without client JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto(`${baseURL}/`);
  await expect(
    page.getByRole("heading", {
      name: "Featured production-ready projects",
    })
  ).toBeVisible();
  await expect(page.getByText("Nova SaaS Control Plane")).toBeVisible();

  await page.goto(`${baseURL}/store?q=Nova`);
  await expect(page.getByText("Nova SaaS Control Plane")).toBeVisible();
  await expect(page.getByText("CrownBank Fraud Shield")).toHaveCount(0);

  await page.goto(`${baseURL}/listing/st-003`);
  await expect(
    page.getByRole("heading", { name: "Nova SaaS Control Plane" })
  ).toBeVisible();
  await expect(
    page.getByText("Production-ready SaaS starter").first()
  ).toBeVisible();

  await context.close();
});

test("prospect can submit an inquiry from a listing detail page", async ({
  page,
}) => {
  await page.goto("/listing/st-003");

  await page.getByRole("button", { name: "Request this project" }).click();
  await page.getByLabel("Full name").fill("Playwright Prospect");
  await page.getByLabel("Work email").fill("prospect@example.com");
  await page.getByLabel("Preferred timeline").fill("Kickoff next sprint");
  await page
    .getByLabel("Project goals")
    .fill("Validate the production-grade inquiry journey.");
  await page.getByRole("button", { name: "Submit Request" }).click();

  await expect(page.getByText("Request sent", { exact: true })).toBeVisible();
});

test("admin can sign in and manage a listing", async ({ page }) => {
  const listingName = `Playwright Listing ${Date.now()}`;

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin|\/login\?next=\/admin/);

  await page.getByLabel("Username").fill(adminUsername);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Sign in to admin" }).click();

  await expect(page.getByText("Dashboard Overview")).toBeVisible();
  await page.goto("/admin/listings");

  await page.getByRole("button", { name: "Add New Service" }).click();
  const dialog = page.getByRole("dialog");

  await dialog.getByLabel("Name").fill(listingName);
  await dialog.getByLabel("Price ($)").fill("999");
  await dialog.getByLabel("Image URL").fill("/images/dev-project-1.webp");
  await dialog
    .getByLabel("Short Description")
    .fill("Playwright smoke listing");
  await dialog
    .getByLabel("Description", { exact: true })
    .fill("Listing created by the Playwright smoke suite.");
  await dialog
    .getByLabel("Technologies (comma separated)")
    .fill("Next.js, Playwright");
  await dialog
    .getByLabel("Features (comma separated)")
    .fill("Smoke tested");
  const addListingButton = dialog.getByRole("button", { name: "Add Listing" });
  await addListingButton.scrollIntoViewIfNeeded();
  await addListingButton.evaluate((button: HTMLButtonElement) => button.click());

  const row = page.getByRole("row", { name: new RegExp(listingName) });
  await expect(row).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button").click();
  await page.getByRole("menuitem", { name: "Delete Item" }).click();

  await expect(
    page.getByText("Listing removed", { exact: true })
  ).toBeVisible();
  await expect(row).toHaveCount(0);
});

test("login endpoint rate limits repeated invalid attempts", async ({
  baseURL,
  playwright,
}) => {
  const api = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "user-agent": `playwright-login-rate-limit-${Date.now()}`,
      "x-forwarded-for": "203.0.113.10",
    },
  });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await api.post("/api/session", {
      data: {
        username: "admin",
        password: `wrong-password-${attempt}`,
      },
    });

    expect(response.status()).toBe(401);
  }

  const limited = await api.post("/api/session", {
    data: {
      username: "admin",
      password: "still-wrong",
    },
  });

  expect(limited.status()).toBe(429);
  expect(limited.headers()["retry-after"]).toBeTruthy();

  await api.dispose();
});

test("inquiry endpoint rate limits bursts and silently ignores honeypot spam", async ({
  baseURL,
  playwright,
}) => {
  const honeypotApi = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "user-agent": `playwright-inquiry-honeypot-${Date.now()}`,
      "x-forwarded-for": "203.0.113.20",
    },
  });

  const honeypotResponse = await honeypotApi.post("/api/inquiries", {
    data: {
      listingId: "st-003",
      userName: "Spam Bot",
      userEmail: "spam@example.com",
      message: "This should be accepted silently by the honeypot guard.",
      website: "https://spam.example.com",
    },
  });

  expect(honeypotResponse.status()).toBe(202);
  await honeypotApi.dispose();

  const api = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "user-agent": `playwright-inquiry-rate-limit-${Date.now()}`,
      "x-forwarded-for": "203.0.113.21",
    },
  });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await api.post("/api/inquiries", {
      data: {
        listingId: "st-003",
        userName: "Rate Limited Prospect",
        userEmail: `prospect+${attempt}@example.com`,
        message: `This is inquiry attempt ${attempt} for rate limit verification.`,
      },
    });

    expect(response.status()).toBe(201);
  }

  const limited = await api.post("/api/inquiries", {
    data: {
      listingId: "st-003",
      userName: "Rate Limited Prospect",
      userEmail: "prospect+overflow@example.com",
      message: "This should trigger the inquiry rate limiter immediately.",
    },
  });

  expect(limited.status()).toBe(429);
  expect(limited.headers()["retry-after"]).toBeTruthy();

  await api.dispose();
});

test("admin can enroll in MFA and sign back in with an authenticator code", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill(adminUsername);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Sign in to admin" }).click();

  await expect(page.getByText("Dashboard Overview")).toBeVisible();
  await page.goto("/admin/settings");

  await page.getByRole("button", { name: "Set Up MFA" }).click();
  const formattedSecret = await page.getByLabel("Manual setup key").inputValue();
  const secret = formattedSecret.replace(/\s+/g, "");
  const totpCode = createCurrentTotpCode(secret);
  await page.getByLabel("Authenticator code").fill(totpCode);
  await page.getByRole("button", { name: "Confirm MFA" }).click();

  await expect(page.getByText("MFA is enabled")).toBeVisible();

  await page.request.delete("/api/session");
  await page.goto("/login");
  await page.getByLabel("Username").fill(adminUsername);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Sign in to admin" }).click();
  await page.getByLabel("Authentication Code").fill(createCurrentTotpCode(secret));
  await page.getByRole("button", { name: "Verify and continue" }).click();

  await expect(page.getByText("Dashboard Overview")).toBeVisible();
  await page.goto("/admin/settings");
  await page.getByRole("button", { name: "Disable MFA" }).click();
  await expect(page.getByText("MFA is not enabled yet")).toBeVisible();
});

test("notification cron endpoint exposes worker health and processes queued jobs", async ({
  baseURL,
  playwright,
}) => {
  const publicApi = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "user-agent": `playwright-notification-worker-${Date.now()}`,
      "x-forwarded-for": "203.0.113.40",
    },
  });

  const inquiryResponse = await publicApi.post("/api/inquiries", {
    data: {
      listingId: "st-003",
      userName: "Worker Prospect",
      userEmail: `worker-${Date.now()}@example.com`,
      message: "Queue a notification job for the worker smoke test.",
    },
  });
  expect(inquiryResponse.status()).toBe(201);

  const cronApi = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "x-cron-secret": cronSecret,
    },
  });

  const healthResponse = await cronApi.get("/api/internal/cron/notifications");
  expect([200, 207]).toContain(healthResponse.status());
  const healthData = (await healthResponse.json()) as {
    status?: string;
    reasons?: string[];
    thresholds?: { maxDue?: number };
    health?: { dueNow?: number };
  };
  expect(["ok", "degraded"]).toContain(healthData.status);
  expect(Array.isArray(healthData.reasons)).toBeTruthy();
  expect(healthData.thresholds?.maxDue).toBeGreaterThan(0);
  expect(healthData.health?.dueNow).toBeGreaterThan(0);

  const dispatchResponse = await cronApi.post("/api/internal/cron/notifications", {
    data: {
      limit: 10,
    },
  });
  expect(dispatchResponse.status()).toBe(200);
  const dispatchData = (await dispatchResponse.json()) as {
    processedCount?: number;
    status?: string;
    reasons?: string[];
    health?: { deadLetters?: number };
  };
  expect(dispatchData.processedCount).toBeGreaterThan(0);
  expect(dispatchData.status).toBe("ok");
  expect(Array.isArray(dispatchData.reasons)).toBeTruthy();
  expect(dispatchData.health?.deadLetters ?? 0).toBeGreaterThanOrEqual(0);

  await cronApi.dispose();
  await publicApi.dispose();
});

test("admin analytics reflects tracked storefront traffic and inquiry pipeline", async ({
  page,
}) => {
  await page.goto("/");
  await page.goto("/store");
  await page.goto("/listing/st-003");

  await page.getByRole("button", { name: "Request this project" }).click();
  await page.getByLabel("Full name").fill("Analytics Prospect");
  await page
    .getByLabel("Work email")
    .fill(`analytics-${Date.now()}@example.com`);
  await page.getByLabel("Preferred timeline").fill("This quarter");
  await page
    .getByLabel("Project goals")
    .fill("Generate a tracked inquiry for the analytics dashboard.");
  await page.getByRole("button", { name: "Submit Request" }).click();

  await expect(page.getByText("Request sent", { exact: true })).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("Username").fill(adminUsername);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Sign in to admin" }).click();

  await expect(page.getByText("Dashboard Overview")).toBeVisible();

  let overview: AnalyticsOverviewSnapshot | null = null;

  await expect.poll(async () => {
    const response = await page.request.get("/api/admin/analytics");
    if (!response.ok()) {
      return 0;
    }

    const data = (await response.json()) as {
      overview?: AnalyticsOverviewSnapshot | null;
    };
    overview = data.overview ?? null;

    return overview?.stats?.listingViews?.value ?? 0;
  }).toBeGreaterThan(0);

  const recordedOverview = overview as AnalyticsOverviewSnapshot | null;

  expect(recordedOverview?.stats?.uniqueVisitors?.value ?? 0).toBeGreaterThan(0);
  expect(recordedOverview?.stats?.listingViews?.value ?? 0).toBeGreaterThan(0);
  expect(recordedOverview?.stats?.inquiries?.value ?? 0).toBeGreaterThan(0);

  await page.goto("/admin/analytics");
  await expect(page.getByText("Traffic Over The Last 7 Days")).toBeVisible();
  await expect(page.getByText("Top Listings This Period")).toBeVisible();
  await expect(page.getByText("Nova SaaS Control Plane").first()).toBeVisible();
});

test("legacy admin routes redirect to canonical team and leads pages", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill(adminUsername);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Sign in to admin" }).click();

  await expect(page.getByText("Dashboard Overview")).toBeVisible();

  await page.goto("/admin/inquiries");
  await expect(page).toHaveURL(/\/admin\/leads$/);
  await expect(page.getByText("Lead Pipeline")).toBeVisible();

  await page.goto("/admin/customers");
  await expect(page).toHaveURL(/\/admin\/team$/);
  await expect(page.getByText("Team Access")).toBeVisible();
});

test("admin can request and complete a password reset", async ({
  page,
  playwright,
  baseURL,
}) => {
  const api = await playwright.request.newContext({
    baseURL,
  });

  const requestResponse = await api.post("/api/session/reset", {
    data: {
      identifier: adminUsername,
    },
  });
  expect(requestResponse.status()).toBe(200);

  const requestData = (await requestResponse.json()) as {
    resetLink?: string;
  };
  expect(requestData.resetLink).toBeTruthy();

  const nextPassword = "Playwright!567";
  await page.goto(requestData.resetLink!);
  await page.getByLabel("New password").fill(nextPassword);
  await page.getByLabel("Confirm password").fill(nextPassword);
  await page.getByRole("button", { name: "Update password" }).click();

  await expect(page.getByText("Your password has been updated.")).toBeVisible();
  adminPassword = nextPassword;

  await page.goto("/login");
  await page.getByLabel("Username").fill(adminUsername);
  await page.getByLabel("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Sign in to admin" }).click();

  await expect(page.getByText("Dashboard Overview")).toBeVisible();
  await api.dispose();
});

test("public robots and sitemap expose crawlable storefront routes", async ({
  baseURL,
  playwright,
}) => {
  const api = await playwright.request.newContext({ baseURL });

  const robotsResponse = await api.get("/robots.txt");
  expect(robotsResponse.status()).toBe(200);
  const robotsText = await robotsResponse.text();
  expect(robotsText).toContain("Disallow: /admin");
  expect(robotsText).toContain("Disallow: /login");
  expect(robotsText).toContain("/sitemap.xml");

  const sitemapResponse = await api.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemapText = await sitemapResponse.text();
  expect(sitemapText).toContain(`<loc>${new URL("/store", baseURL).toString()}</loc>`);
  expect(sitemapText).toContain(
    `<loc>${new URL("/listing/st-003", baseURL).toString()}</loc>`
  );

  await api.dispose();
});
