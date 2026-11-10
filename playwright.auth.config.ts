import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/auth-browser", workers: 1, fullyParallel: false,
  reporter: "list", timeout: 45_000,
  use: { ...devices["Desktop Chrome"], channel: "chrome", baseURL: "http://127.0.0.1:3107", trace: "off", screenshot: "off", video: "off" },
  webServer: { command: "npm run start", url: "http://127.0.0.1:3107", reuseExistingServer: false, timeout: 120_000 },
});
