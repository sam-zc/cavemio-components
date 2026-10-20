import { defineConfig } from "@playwright/test";

const baseURL = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
if (!/^https?:$/.test(new URL(baseURL).protocol)) {
  throw new Error("STORYBOOK_URL must be an HTTP(S) URL");
}

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 120_000,
  globalTimeout: 15 * 60_000,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    browserName: "chromium",
    channel: process.env.PLAYWRIGHT_CHANNEL,
    viewport: { width: 1000, height: 800 },
    reducedMotion: "no-preference",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  // An explicit URL means the caller owns the server. Otherwise Playwright
  // starts Storybook, or reuses an existing local instance outside CI.
  webServer: process.env.STORYBOOK_URL
    ? undefined
    : {
        command: "bun run storybook",
        url: `${baseURL}/index.json`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
