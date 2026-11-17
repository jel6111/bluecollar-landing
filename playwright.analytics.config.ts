import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/analytics-browser",
  use: { channel: "chrome", baseURL: "http://127.0.0.1:3108", trace: "off" },
  workers: 1,
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3108",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3108", NEXT_PUBLIC_GTM_ID: "GTM-QATESTM8", AMPLITUDE_API_KEY: "" },
  },
});
