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
  deployed: Boolean(process.env.VERCEL),
});
const db = createClient(connection.url, connection.secret, {
  auth: { persistSession: false },
});
const { count, error } = await db
  .from("work_records")
  .select("id", { count: "exact", head: true });
if (error || count === null)
  throw new Error("허용된 과제 DB의 work_records 조회에 실패했습니다.");
console.log(
  JSON.stringify({
    project: registration.projectName,
    mode: registration.mode,
    workRecordsCount: count,
    connected: true,
  }),
);
