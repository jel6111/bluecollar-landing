// Only the isolated auth UI/build may run in group 2. Legacy DB helpers stay blocked.
import { readFileSync } from "node:fs";
const operation = process.argv[2];
const project = JSON.parse(readFileSync(new URL("../lib/supabase/demo-project.json", import.meta.url), "utf8"));
if (["dev", "start", "build"].includes(operation) && project.projectName === "bluecollar-mission7-demo") {
  process.exitCode = 0;
} else {
  console.error("MISSION7_RECORDS_BLOCKED: 회원 기능 2묶음에서는 기존 DB·파일·CRUD 검사 명령을 실행하지 않습니다. 새 인증 검사만 사용해주세요.");
  process.exitCode = 42;
}