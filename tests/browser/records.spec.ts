import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
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
    for (const id of createdIds) {
      const listed = await db.storage
        .from("work-record-images")
        .list(`records/${id}`);
      expect(listed.error).toBeNull();
      if (listed.data?.length) {
        const removed = await db.storage
          .from("work-record-images")
          .remove(listed.data.map((file) => `records/${id}/${file.name}`));
        expect(removed.error).toBeNull();
      }
    }
    const cleanup = await db
      .from("storage_cleanup_tasks")
      .delete()
      .in("record_id", createdIds);
    expect(cleanup.error).toBeNull();
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

async function photoFile(
  format: "png" | "jpeg" | "webp" = "png",
  color = "#2563eb",
) {
  return {
    name: `qa-photo.${format === "jpeg" ? "jpg" : format}`,
    mimeType: `image/${format}`,
    buffer: await sharp({
      create: { width: 64, height: 48, channels: 3, background: color },
    })
      .toFormat(format)
      .toBuffer(),
  };
}
async function savedRecord(id: string) {
  const result = await db
    .from("work_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  expect(result.error).toBeNull();
  return result.data;
}
async function imageFiles(id: string) {
  const result = await db.storage
    .from("work-record-images")
    .list(`records/${id}`);
  expect(result.error).toBeNull();
  return result.data ?? [];
}
test("사진 등록·유지·교체·제거·추가와 수정·삭제가 브라우저와 실제 DB에 반영된다", async ({
  page,
  context,
}) => {
  await page.goto("/records/new");
  const id = await page.locator('input[name="submission_id"]').inputValue();
  createdIds.push(id);
  await page.getByLabel(/현장 별칭/).fill("QA 사진현장");
  await page.getByLabel(/작업 제목/).fill("QA 사진 CRUD");
  await page.getByLabel(/작업 사진/).setInputFiles(await photoFile());
  await expect(page.getByAltText("선택한 작업 사진 미리보기")).toBeVisible();
  await page.getByRole("button", { name: "기록 저장", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/records/${id}\\?page=1$`));
  await expect(page.getByAltText("QA 사진현장 작업 사진")).toBeVisible();
  await expect
    .poll(() =>
      page
        .getByAltText("QA 사진현장 작업 사진")
        .evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  const original = await savedRecord(id);
  const independent = await context.newPage();
  await independent.goto(`/records/${id}`);
  await expect(
    independent.getByRole("heading", { name: "QA 사진 CRUD", exact: true }),
  ).toBeVisible();
  await independent.close();

  await page.getByRole("link", { name: "기록 수정", exact: true }).click();
  await page.getByLabel(/작업 제목/).fill("QA 사진 CRUD 수정");
  await page.getByRole("button", { name: "수정 내용 저장" }).click();
  await expect(
    page.getByRole("heading", { name: "QA 사진 CRUD 수정", exact: true }),
  ).toBeVisible();
  const kept = await savedRecord(id);
  expect(kept.image_path).toBe(original.image_path);
  expect(kept.updated_at).not.toBe(original.updated_at);
  await page.getByRole("link", { name: "목록으로 돌아가기", exact: true }).click();
  await expect(page.getByRole("heading", { name: "QA 사진 CRUD 수정", exact: true })).toBeVisible();
  await page.locator(`a[href="/records/${id}?page=1"]`).click();

  await page.getByRole("link", { name: "기록 수정", exact: true }).click();
  await page
    .getByLabel(/작업 사진/)
    .setInputFiles(await photoFile("webp", "#dc2626"));
  await page.getByRole("button", { name: "수정 내용 저장" }).click();
  await expect(
    page.getByRole("link", { name: "기록 수정", exact: true }),
  ).toBeVisible();
  const replaced = await savedRecord(id);
  expect(replaced.image_path).not.toBe(original.image_path);
  expect(replaced.image_path.endsWith(".webp")).toBe(true);
  expect(await imageFiles(id)).toHaveLength(1);

  await page.getByRole("link", { name: "기록 수정", exact: true }).click();
  await page.getByLabel("저장할 때 기존 사진 제거").check();
  await page.getByRole("button", { name: "수정 내용 저장" }).click();
  await expect(
    page.getByText("등록된 사진이 없습니다.", { exact: true }),
  ).toBeVisible();
  expect((await savedRecord(id)).image_path).toBeNull();
  expect(await imageFiles(id)).toHaveLength(0);
  await page.getByRole("link", { name: "기록 수정", exact: true }).click();
  await page
    .getByLabel(/작업 사진/)
    .setInputFiles(await photoFile("jpeg", "#16a34a"));
  await page.getByRole("button", { name: "수정 내용 저장" }).click();
  await expect(page.getByAltText("QA 사진현장 작업 사진")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "QA 사진 CRUD 수정", exact: true }),
  ).toBeVisible();

  const trigger = page.getByRole("button", { name: "기록 삭제", exact: true });
  await trigger.click();
  const dialog = page.getByRole("alertdialog");
  await expect(
    dialog.getByRole("button", { name: "취소", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("button", { name: "취소", exact: true }).click();
  expect(await savedRecord(id)).not.toBeNull();
  await trigger.click();
  await dialog.getByRole("button", { name: "삭제하기", exact: true }).click();
  await expect(page).toHaveURL(/\/records\?page=1$/);
  expect(await savedRecord(id)).toBeNull();
  expect(await imageFiles(id)).toHaveLength(0);
  await page.goto(`/records/${id}`);
  await expect(
    page.getByRole("heading", { name: "작업기록을 찾을 수 없습니다." }),
  ).toBeVisible();
  await page.goto(`/records/${id}/edit`);
  await expect(
    page.getByRole("heading", { name: "작업기록을 찾을 수 없습니다." }),
  ).toBeVisible();
});

test("큰 파일·손상된 사진을 거절하고 실패한 폼의 텍스트·사진 선택을 유지한다", async ({
  page,
}) => {
  await page.goto("/records/new");
  const id = await page.locator('input[name="submission_id"]').inputValue();
  createdIds.push(id);
  await page.getByLabel(/현장 별칭/).fill("QA 검증현장");
  await page.getByLabel(/작업 제목/).fill("QA 입력 유지");
  await page.getByLabel(/작업 사진/).setInputFiles({
    name: "large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(3 * 1024 * 1024 + 1),
  });
  await expect(
    page.getByText("사진은 3MB 이하로 올려주세요.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "기록 저장", exact: true }).click();
  expect(await savedRecord(id)).toBeNull();

  await page.getByLabel(/작업 사진/).setInputFiles({
    name: "broken.png",
    mimeType: "image/png",
    buffer: Buffer.from("not a real image"),
  });
  await page.getByRole("button", { name: "기록 저장", exact: true }).click();
  await expect(page.getByText(/사진을 읽을 수 없습니다/)).toBeVisible();
  await expect(page.getByLabel(/작업 제목/)).toHaveValue("QA 입력 유지");
  expect(await savedRecord(id)).toBeNull();

  await page.getByLabel(/작업 사진/).setInputFiles(await photoFile());
  await page.getByLabel(/작업 제목/).fill("   ");
  await page.getByRole("button", { name: "기록 저장", exact: true }).click();
  await expect(
    page.getByText("작업 제목을 입력해주세요.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByAltText("선택한 작업 사진 미리보기")).toBeVisible();
  await page.getByLabel(/작업 제목/).fill("QA 입력 유지 재저장");
  await page.getByRole("button", { name: "기록 저장", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "QA 입력 유지 재저장", exact: true }),
  ).toBeVisible();
  expect((await savedRecord(id)).image_path).not.toBeNull();
});

test("동시에 열린 오래된 수정·삭제 폼은 최신 기록을 덮어쓰거나 삭제하지 않는다", async ({
  page,
  context,
}) => {
  const id = randomUUID();
  createdIds.push(id);
  expect(
    (
      await db.from("work_records").insert({
        id,
        site_label: "QA 동시현장",
        work_date: "2026-10-14",
        title: "QA 원본",
        description: "",
      })
    ).error,
  ).toBeNull();
  await page.goto(`/records/${id}/edit`);
  const stale = await context.newPage();
  await stale.goto(`/records/${id}/edit`);
  await page.getByLabel(/작업 제목/).fill("QA 최신 내용");
  await page.getByRole("button", { name: "수정 내용 저장" }).click();
  await expect(
    page.getByRole("heading", { name: "QA 최신 내용", exact: true }),
  ).toBeVisible();
  await stale.getByLabel(/작업 제목/).fill("QA 오래된 덮어쓰기");
  await stale.getByRole("button", { name: "수정 내용 저장" }).click();
  await expect(
    stale.getByText(/다른 화면에서 기록이 변경되었습니다/),
  ).toBeVisible();
  await expect(stale.getByLabel(/작업 제목/)).toHaveValue("QA 오래된 덮어쓰기");
  expect((await savedRecord(id)).title).toBe("QA 최신 내용");
  await stale.close();

  await page.getByRole("button", { name: "기록 삭제", exact: true }).click();
  expect(
    (
      await db
        .from("work_records")
        .update({ description: "QA 나중 변경" })
        .eq("id", id)
    ).error,
  ).toBeNull();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "삭제하기", exact: true })
    .click();
  await expect(
    page
      .getByRole("alertdialog")
      .getByText(/다른 화면에서 기록이 변경되었습니다/),
  ).toBeVisible();
  expect(await savedRecord(id)).not.toBeNull();
});

test("마지막 페이지의 기록을 삭제하면 남은 마지막 유효 페이지로 이동한다", async ({
  page,
}) => {
  const baseline = await db
    .from("work_records")
    .select("id", { count: "exact", head: true });
  expect(baseline.error).toBeNull();
  const count = 10 - ((baseline.count ?? 0) % 10) + 1;
  const rows = Array.from({ length: count }, (_, index) => ({
    id: randomUUID(),
    site_label: "QA 삭제 페이지",
    work_date: "2026-10-14",
    title: `QA 삭제 탐색 ${index}`,
    description: "",
    created_at: index === 0 ? "1900-01-01T00:00:00Z" : new Date().toISOString(),
  }));
  createdIds.push(...rows.map((row) => row.id));
  expect((await db.from("work_records").insert(rows)).error).toBeNull();
  const lastPage = Math.ceil(((baseline.count ?? 0) + count) / 10);
  await page.goto(`/records?page=${lastPage}`);
  await page
    .locator(`a[href="/records/${rows[0].id}?page=${lastPage}"]`)
    .click();
  await page.getByRole("button", { name: "기록 삭제", exact: true }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "삭제하기", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`/records\\?page=${lastPage - 1}$`));
  await expect(page.getByRole("link", { name: /상세 보기/ })).toHaveCount(10);
});

test("사진 응답 실패 후 재조회하고 긴 입력도 상세·수정·삭제 화면을 넘치지 않는다", async ({
  page,
}) => {
  const id = randomUUID();
  createdIds.push(id);
  const file = await photoFile();
  const path = `records/${id}/${randomUUID()}.png`;
  expect(
    (
      await db.storage
        .from("work-record-images")
        .upload(path, file.buffer, { contentType: "image/png" })
    ).error,
  ).toBeNull();
  expect(
    (
      await db
        .from("work_records")
        .insert({
          id,
          site_label: "A".repeat(80),
          work_date: "2026-10-14",
          title: "B".repeat(120),
          description: "C".repeat(2000),
          image_path: path,
        })
    ).error,
  ).toBeNull();
  const route = `**/storage/v1/object/sign/work-record-images/records/${id}/*`;
  await page.route(route, (request) =>
    request.fulfill({ status: 403, body: "QA expired response" }),
  );
  await page.goto(`/records/${id}`);
  await expect(
    page.getByText("사진을 불러오지 못했습니다.", { exact: true }),
  ).toBeVisible();
  await page.unroute(route);
  await page.getByRole("button", { name: "사진 다시 불러오기" }).click();
  await expect
    .poll(() =>
      page
        .getByAltText("A".repeat(80) + " 작업 사진")
        .evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  for (const width of [320, 375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/records/${id}`);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "기록 삭제", exact: true }).click();
    const bounds = await page.getByRole("alertdialog").boundingBox();
    if (!bounds) throw new Error("삭제 확인창이 보이지 않습니다.");
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "취소", exact: true })
      .click();
    await page.getByRole("link", { name: "기록 수정", exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
