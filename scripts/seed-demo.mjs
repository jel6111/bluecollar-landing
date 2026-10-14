import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { validateDemoConnection } from "../lib/supabase/config.ts";
import sharp from "sharp";
import { validateImage } from "../lib/storage/image-validation.ts";
import { createWorkRecord } from "../lib/records/service.ts";
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
const photoId = "00000000-0000-4000-8000-000000000003";
const existing = await db
  .from("work_records")
  .select("id")
  .eq("id", photoId)
  .maybeSingle();
if (existing.error) throw new Error("과제 예시 확인에 실패했습니다.");
if (!existing.data) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320"><rect width="480" height="320" fill="#eff6ff"/><g fill="#2563eb"><rect x="32" y="32" width="124" height="100" rx="8"/><rect x="178" y="32" width="124" height="100" rx="8"/><rect x="324" y="32" width="124" height="100" rx="8"/></g><g fill="#93c5fd"><rect x="32" y="148" width="124" height="100" rx="8"/><rect x="178" y="148" width="124" height="100" rx="8"/><rect x="324" y="148" width="124" height="100" rx="8"/></g><text x="240" y="292" text-anchor="middle" fill="#1e3a8a" font-family="sans-serif" font-size="22">DEMO IMAGE</text></svg>';
  const bytes = await sharp(Buffer.from(svg)).png().toBuffer();
  const image = await validateImage(
    new File([bytes], "demo.png", { type: "image/png" }),
  );
  await createWorkRecord(
    db,
    photoId,
    {
      site_label: "가상 B현장",
      work_date: "2026-10-14",
      title: "사진 포함 작업기록 (가상 예시)",
      description:
        "사진 업로드·교체·제거를 체험하는 과제용 예시입니다. 이미지는 코드로 만든 가상 자료이며 실제 현장 사진이 아닙니다.",
    },
    image,
  );
}
console.log("과제용 가상 예시 2건 준비 완료. 기존 기록은 수정하지 않았습니다.");
