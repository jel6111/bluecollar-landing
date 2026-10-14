import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { validateDemoConnection } from "../lib/supabase/config.ts";
import { retryImageCleanup } from "../lib/storage/record-images.ts";
process.loadEnvFile(".env.local");
const registration = JSON.parse(
  readFileSync("lib/supabase/demo-project.json", "utf8"),
);
const connection = validateDemoConnection(registration, {
  url: process.env.SUPABASE_URL,
  secret: process.env.SUPABASE_SECRET_KEY,
  deployed: Boolean(process.env.VERCEL),
});
const db = createClient(connection.url, connection.secret, {
  auth: { persistSession: false },
});
const { data, error } = await db
  .from("storage_cleanup_tasks")
  .select("*")
  .order("created_at")
  .limit(100);
if (error || !data) throw new Error("과제 파일 정리 내역 조회에 실패했습니다.");
let completed = 0;
for (const task of data) {
  const attempted = await db
    .from("storage_cleanup_tasks")
    .update({ attempts: task.attempts + 1 })
    .eq("id", task.id);
  if (attempted.error) continue;
  if (await retryImageCleanup(db, task.record_id, task.image_path)) completed++;
}
console.log(
  JSON.stringify({
    project: registration.projectName,
    checked: data.length,
    completed,
    pending: data.length - completed,
  }),
);
