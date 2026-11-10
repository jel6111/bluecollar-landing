import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";

const registration = JSON.parse(readFileSync("lib/supabase/demo-project.json", "utf8"));
const unconfigured = !registration.confirmedNewDemoProject;

test("랜딩과 로그인/가입 화면은 미션 7을 표시하고 비로그인 기록 접근을 제한한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "내 기록 시작하기" })).toBeVisible();
  await page.getByRole("link", { name: "내 기록 시작하기" }).click();
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.getByRole("heading", { name: "로그인", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "회원가입하기" }).click();
  await expect(page.getByLabel("비밀번호 확인", { exact: true })).toBeVisible();
});
test("서버가 빈 값·잘못된 이메일·가입 비밀번호 불일치를 검증한다", async ({ page }) => {
  await page.goto("/signup");
  await page.getByRole("button", { name: "회원가입", exact: true }).click();
  await expect(page.getByText("입력 내용을 확인해주세요.")).toBeVisible();
  await page.getByLabel("이메일", { exact: true }).fill("not-an-email");
  await page.getByLabel("비밀번호", { exact: true }).fill("valid-test-passphrase");
  await page.getByLabel("비밀번호 확인", { exact: true }).fill("different-passphrase");
  await page.getByRole("button", { name: "회원가입", exact: true }).click();
  await expect(page.getByText("이메일 주소를 올바르게 입력해주세요.")).toBeVisible();
  await expect(page.getByText("비밀번호가 일치하지 않습니다.")).toBeVisible();
  await expect(page.getByLabel("이메일", { exact: true })).toHaveValue("not-an-email");
});
test("미연결 상태에서 회원 요청은 기존 Supabase로 전송되지 않는다", async ({ page }) => {
  test.skip(!unconfigured, "새 과제 연결 완료 시 미연결 시나리오는 해당하지 않음");
  const outbound: string[] = [];
  page.on("request", (request) => { if (request.url().includes("supabase.co")) outbound.push(request.url()); });
  await page.goto("/login");
  await page.getByLabel("이메일", { exact: true }).fill("qa@example.invalid");
  await page.getByLabel("비밀번호", { exact: true }).fill("valid-test-passphrase");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByText(/새 미션 7 과제용 Supabase 연결을 준비/)).toBeVisible();
  expect(outbound).toEqual([]);
});

test("새 과제 Auth의 잘못된 로그인은 오류를 안내하고 세션을 만들지 않는다", async ({ page, context }) => {
  test.skip(unconfigured, "새 과제 연결이 필요함");
  await page.goto("/login");
  await page.getByLabel("이메일", { exact: true }).fill("mission7-invalid-login@example.com");
  await page.getByLabel("비밀번호", { exact: true }).fill("invalid-test-passphrase");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByText("이메일과 비밀번호를 확인해주세요.")).toBeVisible();
  expect((await context.cookies()).filter((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"))).toEqual([]);
  await page.goto("/records");
  await expect(page).toHaveURL(/\/login\?next=/);
});
test("보호된 하위 주소와 잘못된 인증 링크, 외부 next를 안전하게 처리한다", async ({ page }) => {
  for (const path of ["/records/new", "/records/61111111-1111-4111-8111-111111111111/edit"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login\?next=/);
  }
  await page.goto("/login?next=https://evil.example");
  await expect(page.locator('input[name="next"]')).toHaveValue("/records");
  await page.goto("/auth/callback?code=bad");
  await expect(page).toHaveURL(/\/auth\/error$/);
  await page.goto("/auth/confirm?type=signup&token_hash=bad");
  await expect(page.getByRole("heading", { name: "확인 링크를 처리하지 못했습니다" })).toBeVisible();
});
test("인증 페이지가 공용 캐시에 저장되지 않고 작은 화면과 키보드에 대응한다", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/login", "/signup", "/auth/check-email", "/auth/error"]) {
      const response = await page.goto(path);
      expect(response?.headers()["cache-control"]).toContain("no-store");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (unconfigured && [320, 1280].includes(width) && ["/login", "/signup"].includes(path)) {
        await page.screenshot({ path: testInfo.outputPath(`${path.slice(1)}-${width}.png`), fullPage: true });
      }
    }
  }
  await page.goto("/login");
  await page.getByLabel("이메일", { exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("비밀번호", { exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

test("새 과제의 실제 계정으로 로그인·새로고침·로그아웃한다", async ({ page, context }) => {
  const fixture = ".env.auth-test.local";
  test.skip(!existsSync(fixture) || unconfigured, "새 과제 연결과 비추적 소유 테스트 계정 준비가 필요함");
  process.loadEnvFile(fixture);
  const email = process.env.MISSION7_TEST_EMAIL;
  const password = process.env.MISSION7_TEST_PASSWORD;
  if (!email || !password) {
    test.skip(true, "소유한 테스트 계정의 로컬 비밀번호 설정이 필요함");
    return;
  }
  await page.goto("/login");
  await page.getByLabel("이메일", { exact: true }).fill(email);
  await page.getByLabel("비밀번호", { exact: true }).fill(password);
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByRole("heading", { name: "로그인되었습니다" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "로그인되었습니다" })).toBeVisible();
  const authCookies = (await context.cookies()).filter((cookie) => cookie.name.startsWith("sb-"));
  expect(authCookies.length > 0 && authCookies.every((cookie) => cookie.httpOnly)).toBe(true);
  await page.goto("/records/new");
  await expect(page).toHaveURL(/\/records\?notice=preparing$/);
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3107/");
  await page.goto("/records");
  await expect(page.getByRole("heading", { name: "로그인", exact: true })).toBeVisible();
});
