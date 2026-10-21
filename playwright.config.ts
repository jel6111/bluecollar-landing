import { defineConfig, devices } from "@playwright/test";
const baseURL = process.env.MISSION6_E2E_BASE_URL || "http://127.0.0.1:3106";
if (!["http://127.0.0.1:3106", "https://bluecollar-mission6-demo.vercel.app"].includes(baseURL)) {
  throw new Error("확인된 미션 6 과제 주소만 브라우저 검사에 사용할 수 있습니다.");
}
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  timeout: 45_000,
  use: {
    ...devices["Desktop Chrome"],
    channel: "chrome",
    baseURL,
    trace: "off",
  },
  webServer: baseURL === "http://127.0.0.1:3106" ? {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3106",
    url: "http://127.0.0.1:3106",
    reuseExistingServer: true,
    timeout: 120_000,
  } : undefined,
});
