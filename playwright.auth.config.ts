import { defineConfig, devices } from "@playwright/test";

const publicDemo = process.env.MISSION7_QA_PUBLIC === "1";

export default defineConfig({
  testDir: "./tests/auth-browser", workers: 1, fullyParallel: false,
  reporter: "list", timeout: 45_000,
  use: {
    ...devices["Desktop Chrome"],
    channel: "chrome",
    baseURL: publicDemo ? "https://bluecollar-mission7-demo.vercel.app" : "http://127.0.0.1:3107",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  webServer: publicDemo ? undefined : {
    command: "npm run start",
    url: "http://127.0.0.1:3107",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
