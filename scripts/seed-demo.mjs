import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { validateDemoConnection } from "../lib/supabase/config.ts";
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
const { error } = await db.from("work_records").upsert(
  {
    id: "00000000-0000-4000-8000-000000000006",
    site_label: "가상 A현장",
    work_date: "2026-10-14",
    title: "욕실 타일 점검 (가상 예시)",
    description:
      "과제용 가상 작업기록입니다. 실제 현장이나 고객의 정보를 포함하지 않습니다.",
    image_path: null,
  },
  { onConflict: "id", ignoreDuplicates: true },
);
if (error) throw new Error("허용된 과제 DB의 예시 등록에 실패했습니다.");
console.log("과제용 가상 예시 1건 준비 완료. 기존 기록은 수정하지 않았습니다.");
