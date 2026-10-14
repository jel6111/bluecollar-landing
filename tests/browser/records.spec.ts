import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { validateDemoConnection } from "../../lib/supabase/config";

process.loadEnvFile(".env.local");
const registration = JSON.parse(
  readFileSync("lib/supabase/demo-project.json", "utf8"),
);
const connection = validateDemoConnection(registration, {
  url: process.env.SUPABASE_URL,
  secret: process.env.SUPABASE_SECRET_KEY,
});
const db = createClient(connection.url, connection.secret, {
  auth: { persistSession: false },
});
const createdIds: string[] = [];
test.afterEach(async () => {
  if (createdIds.length) {
    const { error } = await db
      .from("work_records")
      .delete()
      .in("id", createdIds.splice(0));
    if (error) throw new Error("과제 테스트 기록 정리에 실패했습니다.");
  }
});

test("운영 외부 링크 없이 랜딩과 필수값 오류를 표시한다", async ({ page }) => {
  const forbidden: string[] = [];
  await page.route(
    /parancollar|pf\.kakao|googletagmanager|google-analytics/,
    (route) => {
      forbidden.push(route.request().url());
      return route.abort();
    },
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /오늘의 작업을/, level: 1 }),
  ).toBeVisible();
  const links = await page
    .locator("a")
    .evaluateAll((items) =>
      items.map((item) => (item as HTMLAnchorElement).href),
    );
  expect(links.every((url) => url.startsWith("http://127.0.0.1:3106"))).toBe(
    true,
  );
  await page.getByRole("link", { name: "새 기록 작성", exact: true }).click();
  await page.getByLabel(/현장 별칭/).fill("   ");
  await page.getByLabel(/작업 제목/).fill("   ");
  await page.getByRole("button", { name: "기록 저장" }).click();
  await expect(
    page.getByText("현장 별칭을 입력해주세요.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("작업 제목을 입력해주세요.", { exact: true }),
  ).toBeVisible();
  expect(forbidden).toEqual([]);
});

test("브라우저 등록이 DB·상세·새로고침·목록에 유지된다", async ({ page }) => {
  const title = `QA 가상 작업 ${Date.now()}`;
  await page.goto("/records/new");
  const id = await page.locator('input[name="submission_id"]').inputValue();
  createdIds.push(id);
  await page.getByLabel(/현장 별칭/).fill("QA 가상 A현장");
  await page.getByLabel(/작업일/).fill("2026-10-14");
  await page.getByLabel(/작업 제목/).fill(title);
  await page
    .getByLabel(/작업 설명/)
    .fill("실제 현장과 관계없는 테스트 내용입니다.");
  await page.getByRole("button", { name: "기록 저장" }).dblclick();
  await expect(page).toHaveURL(new RegExp(`/records/${id}\\?page=1$`));
  await expect(
    page.getByRole("heading", { name: title, exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: title, exact: true }),
  ).toBeVisible();
  const stored = await db
    .from("work_records")
    .select("id,title,site_label,image_path")
    .eq("id", id);
  expect(stored.error).toBeNull();
  expect(stored.data).toHaveLength(1);
  expect(stored.data?.[0]).toMatchObject({
    id,
    title,
    site_label: "QA 가상 A현장",
    image_path: null,
  });
  await page.getByRole("link", { name: "목록으로 돌아가기" }).click();
  await expect(
    page.getByRole("heading", { name: title, exact: true }),
  ).toBeVisible();
});

test("실제 DB의 11건을 10건씩 조회하고 페이지 범위를 조정한다", async ({
  page,
}) => {
  const baseline = await db
    .from("work_records")
    .select("id", { count: "exact", head: true });
  expect(baseline.error).toBeNull();
  const total = (baseline.count ?? 0) + 11;
  const lastPage = Math.ceil(total / 10);
  const rows = Array.from({ length: 11 }, (_, n) => ({
    id: randomUUID(),
    site_label: "QA 가상현장",
    work_date: "2026-10-14",
    title: `QA 페이지 기록 ${n + 1}`,
    description: "",
  }));
  createdIds.push(...rows.map((row) => row.id));
  const inserted = await db.from("work_records").insert(rows);
  expect(inserted.error).toBeNull();
  await page.goto("/records?page=1");
  await expect(page.getByRole("link", { name: /상세 보기/ })).toHaveCount(10);
  await page.getByRole("link", { name: "다음 페이지", exact: true }).click();
  await expect(page).toHaveURL(/page=2$/);
  await expect(page.getByRole("link", { name: /상세 보기/ })).toHaveCount(
    Math.min(10, total - 10),
  );
  await page.reload();
  await expect(page).toHaveURL(/page=2$/);
  await page.goto("/records?page=999999");
  await expect(page).toHaveURL(new RegExp(`page=${lastPage}$`));
  await page.goto("/records?page=0");
  await expect(page).toHaveURL(/page=1$/);
});

test("없는 상세 주소에 안내를 보여준다", async ({ page }) => {
  await page.goto(`/records/${randomUUID()}`);
  await expect(
    page.getByRole("heading", { name: "작업기록을 찾을 수 없습니다." }),
  ).toBeVisible();
  await page.goto("/records/not-a-uuid");
  await expect(
    page.getByRole("heading", { name: "작업기록을 찾을 수 없습니다." }),
  ).toBeVisible();
});

test("320px·375px·데스크톱에서 폼과 목록에 가로 넘침과 런타임 오류가 없다", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/records", "/records/new"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
