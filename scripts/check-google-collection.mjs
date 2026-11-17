// Sends clearly labeled QA traffic to the Mission 8 deployment. No login or tokens.
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const origin = "https://bluecollar-mission8-demo.vercel.app";
const campaign = "utm_source=qa&utm_medium=test&utm_campaign=mission8_launch&utm_content=log_check";
const expected = `${origin}/?${campaign}`;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const requests = [];
const hits = [];
const errors = [];
page.on("pageerror", error => errors.push(error.message));
page.on("request", request => {
  const url = new URL(request.url());
  if (url.hostname.endsWith("googletagmanager.com") || url.hostname.endsWith("google-analytics.com")) {
    requests.push({ host: url.hostname, path: url.pathname, id: url.searchParams.get("id") });
  }
});
page.on("response", response => {
  const request = response.request();
  const url = new URL(request.url());
  if (!url.hostname.endsWith("google-analytics.com") || !url.pathname.endsWith("/collect")) return;
  for (const row of (request.postData() || "").split("\n")) {
    const parameters = new URLSearchParams(url.search);
    for (const [key, value] of new URLSearchParams(row)) parameters.set(key, value);
    hits.push({
      status: response.status(),
      measurementId: parameters.get("tid"),
      event: parameters.get("en"),
      pageLocation: parameters.get("dl"),
      pageTitle: parameters.get("dt"),
      // GA4 serializes the built-in traffic_type field as tt, not ep.traffic_type.
      trafficType: parameters.get("tt") ?? parameters.get("ep.traffic_type"),
    });
  }
});

try {
  const response = await page.goto(`${expected}&code=synthetic-check&email=synthetic%40example.invalid`, {
    waitUntil: "domcontentloaded", timeout: 45_000,
  });
  assert.equal(response.status(), 200);
  await page.getByRole("button", { name: "허용", exact: true }).waitFor();
  await page.waitForTimeout(750);
  assert.equal(requests.length, 0, "Google must not load before consent");
  await page.getByRole("button", { name: "허용", exact: true }).click();
  for (let attempt = 0; attempt < 45 && !hits.length; attempt++) await page.waitForTimeout(500);
  // Check the later batched event as well, so an initial automatic page_view cannot hide a duplicate.
  await page.waitForTimeout(12_000);
  const pageViews = hits.filter(hit => hit.event === "page_view");
  assert.equal(pageViews.length, 1, "Exactly one page_view after consent");
  assert.deepEqual(pageViews[0], {
    status: 204, measurementId: "G-1YTGH76MPW", event: "page_view",
    pageLocation: expected, pageTitle: "블루칼라 미션 8", trafficType: "qa",
  });
  assert.equal(requests.filter(row => row.path === "/gtm.js" && row.id === "GTM-KTCNM9VL").length, 1);
  const beforeWithdraw = requests.length;
  await page.getByRole("button", { name: "이용 분석 설정" }).click();
  await page.getByRole("button", { name: "거부", exact: true }).click();
  await page.waitForFunction(() => !document.getElementById("mission8-gtm") &&
    localStorage.getItem("bluecollar-mission8-analytics") === "no");
  await page.waitForTimeout(3_000);
  assert.equal(requests.length, beforeWithdraw, "No Google reload after withdrawing consent");
  assert.deepEqual(errors, []);
  const result = {
    checkedAt: new Date().toISOString(), origin, automatedQa: true,
    checks: { beforeConsentBlocked: true, singlePageView: true, sensitiveQueryRemoved: true, qaMarked: true, withdrawBlocked: true, noPageErrors: true },
    requests, hits,
    scope: "Actual browser requests and collector HTTP responses; vendor report ingestion is verified separately.",
  };
  writeFileSync("node_modules/mission8-ga4-browser.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
