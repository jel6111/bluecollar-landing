import { readFileSync } from "node:fs";
import { chromium, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { validateDemoConnection } from "../lib/supabase/config.ts";
const mode = process.argv[2];
if (!["empty","unavailable"].includes(mode)) throw new Error("empty 또는 unavailable 검사를 선택해주세요.");
process.loadEnvFile(".env.local");
const registration = JSON.parse(readFileSync("lib/supabase/demo-project.json","utf8"));
const connection = validateDemoConnection(registration,{url:process.env.SUPABASE_URL,secret:process.env.SUPABASE_SECRET_KEY});
if (registration.mode !== "local") throw new Error("이 검사는 지정된 과제 로컬 DB에서만 수행합니다.");
const db = createClient(connection.url,connection.secret,{auth:{persistSession:false}});
const browser = await chromium.launch({channel:"chrome",headless:true});
const page = await browser.newPage({viewport:{width:375,height:900}});
try {
  if (mode === "empty") {
    const fixtureIds=["00000000-0000-4000-8000-000000000006","00000000-0000-4000-8000-000000000003"];
    const count=await db.from("work_records").select("id",{count:"exact",head:true});
    const records=await db.from("work_records").select("*").in("id",fixtureIds);
    if (count.error || records.error || count.count !== 2 || records.data.length !== 2 ||
      !records.data.every(row=>["가상 A현장","가상 B현장"].includes(row.site_label) && row.title.endsWith("(가상 예시)")))
      throw new Error("기본 가상 예시 2건만 있을 때 빈 상태를 검사합니다. 사용자 기록은 변경하지 않습니다.");
    const removed=await db.from("work_records").delete().in("id",fixtureIds);
    if (removed.error) throw new Error("가상 예시의 임시 분리에 실패했습니다.");
    try {
      await page.goto("http://127.0.0.1:3106/records");
      await expect(page.getByRole("heading",{name:"아직 등록된 기록이 없습니다.",exact:true})).toBeVisible();
      await expect(page.getByRole("link",{name:"첫 기록 작성",exact:true})).toBeVisible();
    } finally {
      // 사진 객체는 건드리지 않는다. 동시 생성된 UUID가 있으면 덮어쓰지 않는다.
      const restored=await db.from("work_records").upsert(records.data,{onConflict:"id",ignoreDuplicates:true});
      if (restored.error) throw new Error("가상 예시 복원 확인이 필요합니다.");
    }
    console.log(JSON.stringify({mode,emptyScreen:true,fixturesRestored:true}));
  } else {
    const before=await db.from("work_records").select("id",{count:"exact",head:true});
    if (before.error) throw new Error("검사용 정상 로컬 DB 연결을 확인해주세요.");
    await page.goto("http://127.0.0.1:3106/records");
    await expect(page.getByText("작업기록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",{exact:true})).toBeVisible();
    await page.goto("http://127.0.0.1:3106/records/new");
    const id=await page.locator('input[name="submission_id"]').inputValue();
    await page.getByLabel(/현장 이름/).fill("QA 오류 검증 현장");
    await page.getByLabel(/기록 제목/).fill("QA 입력 보존");
    const bytes=await sharp({create:{width:8,height:8,channels:3,background:"blue"}}).png().toBuffer();
    await page.getByLabel(/작업 사진/).setInputFiles({name:"fake.png",mimeType:"image/png",buffer:bytes});
    await page.getByRole("button",{name:"기록 저장",exact:true}).click();
    await expect(page.getByText(/기록을 저장하지 못했습니다/)).toBeVisible();
    await expect(page.getByLabel(/기록 제목/)).toHaveValue("QA 입력 보존");
    await expect(page.getByAltText("선택한 작업 사진 미리보기")).toBeVisible();
    const record=await db.from("work_records").select("id").eq("id",id);
    const after=await db.from("work_records").select("id",{count:"exact",head:true});
    if (record.error || after.error || record.data.length !== 0 || after.count !== before.count)
      throw new Error("실패 응답에서 레코드가 생성되지 않았는지 확인이 필요합니다.");
    console.log(JSON.stringify({mode,queryError:true,formValuesPreserved:true,photoPreserved:true,noInsert:true}));
  }
} finally { await browser.close(); }
