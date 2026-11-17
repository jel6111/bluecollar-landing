import { test, expect, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { existsSync } from "node:fs";
import sharp from "sharp";
import registration from "../../lib/analytics/mission8-project.json";
import { validateAuthConfiguration } from "../../lib/auth/config";

const fixture = ".env.mission8-test.local";
if (existsSync(fixture)) process.loadEnvFile(fixture);
const a = { email: process.env.MISSION8_TEST_EMAIL, password: process.env.MISSION8_TEST_PASSWORD };
const b = { email: process.env.MISSION8_TEST_EMAIL_B, password: process.env.MISSION8_TEST_PASSWORD_B };

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("이메일", { exact: true }).fill(email);
  await page.getByLabel("비밀번호", { exact: true }).fill(password);
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByRole("heading", { name: "내 기록", exact: true })).toBeVisible();
}

for (const crossAccount of [false, true]) {
  const name = crossAccount
    ? "두 계정의 기록과 사진이 분리된다"
    : "내 기록과 사진을 등록·상세 조회·수정·삭제한다";
  test(name, async ({ page, browser, baseURL }) => {
    if (!a.email || !a.password || (crossAccount && (!b.email || !b.password))) {
      test.skip(true, crossAccount ? "미션 8 테스트 계정 A·B가 필요함" : "미션 8 테스트 계정 A가 필요함");
      return;
    }
    if (crossAccount && a.email.toLowerCase() === b.email?.toLowerCase()) {
      throw new Error("서로 다른 테스트 계정이 필요합니다.");
    }
    process.loadEnvFile(".env.local");
    const config = validateAuthConfiguration({ ...registration, supabaseProjectRef: process.env.MISSION8_SUPABASE_REF ?? null, confirmedNewDemoProject: Boolean(process.env.MISSION8_SUPABASE_REF) }, {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    });
    const auth = { persistSession: false, autoRefreshToken: false };
    const clientA = createClient(config.url, config.key, { auth });
    const clientB = crossAccount ? createClient(config.url, config.key, { auth }) : null;
    const { data: sessionA, error: errorA } = await clientA.auth.signInWithPassword({ email: a.email, password: a.password });
    if (errorA || !sessionA.user) throw new Error("새 과제 검증 계정 A의 로그인 정보를 확인해주세요.");
    if (clientB && b.email && b.password) {
      const { data, error } = await clientB.auth.signInWithPassword({ email: b.email, password: b.password });
      if (error || !data.user || data.user.id === sessionA.user.id) {
        throw new Error("새 과제 검증 계정 B의 로그인 정보를 확인해주세요.");
      }
    }
    const bucket = "mission7-record-images";
    const contextB = clientB ? await browser.newContext({ baseURL }) : null;
    let id: string | undefined;
    try {
      const countB = await clientB?.from("work_records").select("id", { count: "exact", head: true });
      if (countB) expect(countB.error === null).toBe(true);
      await login(page, a.email, a.password);
      await page.goto("/records/new");
      id = await page.locator('[name="submission_id"]').inputValue();
      const title = "QA 가상 기록 " + id.slice(0, 8);
      await page.getByLabel(/현장 이름/).fill("QA 가상 현장");
      await page.getByLabel(/기록 제목/).fill(title);
      await page.getByLabel(/사진 설명/).fill("과제 검증용 사진과 설명");
      const png = await sharp({ create: { width: 24, height: 24, channels: 3, background: "#125bd5" } }).png().toBuffer();
      await page.locator('input[type="file"]').setInputFiles({ name: "qa.png", mimeType: "image/png", buffer: png });
      await page.getByRole("button", { name: "기록 저장" }).click();
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
      await page.reload();
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
      await expect(page.getByRole("img", { name: "QA 가상 현장 작업 사진" })).toBeVisible();
      const aRecord = await clientA.from("work_records").select("image_path").eq("id", id).single();
      const path = aRecord.data?.image_path;
      if (aRecord.error || typeof path !== "string") throw new Error("A 사진 경로를 확인할 수 없습니다.");
      expect((await clientA.storage.from(bucket).download(path)).error === null).toBe(true);
      if (clientB && contextB && b.email && b.password) {
        const bTotal = await clientB.from("work_records").select("id", { count: "exact", head: true });
        expect(bTotal.error === null && bTotal.count === countB?.count).toBe(true);
        expect((await clientB.from("work_records").select("id").eq("id", id)).data).toEqual([]);
        expect((await clientB.from("work_records").update({ title: "B 검증" }).eq("id", id).select("id")).data).toEqual([]);
        expect((await clientB.from("work_records").delete().eq("id", id).select("id")).data).toEqual([]);
        expect(Boolean((await clientB.storage.from(bucket).createSignedUrl(path, 60)).error)).toBe(true);
        const crossDelete = await clientB.storage.from(bucket).remove([path]);
        expect(Boolean(crossDelete.error) || !crossDelete.data?.length).toBe(true);
        expect((await clientA.storage.from(bucket).download(path)).error === null).toBe(true);

        const pageB = await contextB.newPage();
        await login(pageB, b.email, b.password);
        for (const suffix of ["", "/edit"]) {
          await pageB.goto("/records/" + id + suffix);
          await expect(pageB.getByRole("heading", { name: "작업기록을 찾을 수 없습니다." })).toBeVisible();
        }
        return;
      }

      await page.getByRole("link", { name: "고치기" }).click();
      await page.getByLabel(/기록 제목/).fill(title + " 수정");
      await page.getByRole("button", { name: "수정 내용 저장" }).click();
      await expect(page.getByRole("heading", { name: title + " 수정", exact: true })).toBeVisible();
      await page.getByRole("button", { name: "기록 삭제", exact: true }).click();
      await page.getByRole("alertdialog").getByRole("button", { name: "삭제하기" }).click();
      await expect(page.getByRole("heading", { name: "내 기록", exact: true })).toBeVisible();
      expect((await clientA.from("work_records").select("id").eq("id", id)).data).toEqual([]);
      expect(Boolean((await clientA.storage.from(bucket).download(path)).error)).toBe(true);
      await page.goto("/records/" + id);
      await expect(page.getByRole("heading", { name: "작업기록을 찾을 수 없습니다." })).toBeVisible();
    } finally {
      await contextB?.close();
      if (id) {
        const folder = ["users", sessionA.user.id, "records", id].join("/");
        const removed = await clientA.from("work_records").delete().eq("user_id", sessionA.user.id).eq("id", id);
        if (removed.error) throw new Error("검증 기록을 정리하지 못했습니다.");
        const files = await clientA.storage.from(bucket).list(folder);
        if (files.error) throw new Error("검증 사진 목록을 불러오지 못했습니다.");
        if (files.data.length) {
          const cleared = await clientA.storage.from(bucket).remove(files.data.map((file) => folder + "/" + file.name));
          if (cleared.error) throw new Error("검증 사진을 정리하지 못했습니다.");
        }
        const tasks = await clientA.from("storage_cleanup_tasks").delete().eq("user_id", sessionA.user.id).eq("record_id", id);
        if (tasks.error) throw new Error("검증 정리 내역을 지우지 못했습니다.");
      }
    }
  });
}
