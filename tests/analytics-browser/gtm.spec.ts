import { test, expect } from "@playwright/test";

test("동의 뒤에만 GTM이 초기화되고 정리한 UTM 랜딩 주소를 보낸다", async ({ page }) => {
  let requests = 0;
  await page.route("https://www.googletagmanager.com/**", async (route) => {
    requests++;
    await route.fulfill({ contentType: "application/javascript", body: "" });
  });
  await page.route("https://www.google-analytics.com/**", (route) => route.abort());
  const campaign = "utm_source=qa&utm_medium=test&utm_campaign=mission8_launch&utm_content=log_check";
  await page.goto("/?" + campaign + "&email=sample%40example.invalid&code=synthetic");
  await expect(page.getByRole("button", { name: "허용", exact: true })).toBeVisible();
  expect(requests).toBe(0);
  await page.getByRole("button", { name: "허용", exact: true }).click();
  await expect(page.getByRole("button", { name: "이용 분석 설정" })).toBeVisible();
  await expect.poll(() => requests).toBe(1);
  const defaults = await page.evaluate(() => {
    const first = (window as Window & { dataLayer?: ArrayLike<unknown>[] }).dataLayer?.[0];
    return first ? Array.from(first) : [];
  });
  expect(defaults).toEqual(["set", {
    send_page_view: false,
    page_location: "http://127.0.0.1:3108/?" + campaign,
    page_title: "블루칼라 미션 8",
    page_referrer: "",
    traffic_type: "qa",
  }]);
  const read = () => page.evaluate(() => (
    (window as Window & { dataLayer?: { event?: string; m8_page_location?: string; m8_traffic_type?: string }[] })
      .dataLayer ?? []
  ).filter((item) => item.event === "gtm.js" || item.event === "m8_landing_view"));
  await expect.poll(async () => (await read()).length).toBe(2);
  const [start, view] = await read();
  expect(start.event).toBe("gtm.js");
  expect(view.event).toBe("m8_landing_view");
  expect(view.m8_page_location).toBe("http://127.0.0.1:3108/?" + campaign);
  expect(view.m8_traffic_type).toBe("qa");

  await page.getByRole("button", { name: "이용 분석 설정" }).click();
  await page.getByRole("button", { name: "거부", exact: true }).click();
  await page.waitForFunction(() => !document.getElementById("mission8-gtm") &&
    window.localStorage.getItem("bluecollar-mission8-analytics") === "no");
  expect(requests).toBe(1);
});
