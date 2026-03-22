import { defineConfig, devices } from "@playwright/test";

const port = 9002;
const defaultBaseURL = `http://127.0.0.1:${port}`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? defaultBaseURL;
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: skipWebServer
    ? undefined
    : {
        command:
          'node -e "require(\'fs\').rmSync(\'.data/playwright.sqlite\', { force: true })" && E2E_TEST_MODE=1 DEPLOYMENT_ENV=local NEXT_PUBLIC_SITE_URL=http://127.0.0.1:9002 SQLITE_DB_PATH=.data/playwright.sqlite ADMIN_USERNAME=admin ADMIN_PASSWORD=Playwright!234 ADMIN_SESSION_SECRET=playwright-secret-12345 INTERNAL_CRON_SECRET=playwright-cron-secret npm run dev',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
