// Legacy DB helpers remain blocked in the Mission 8 checkout.
import { readFileSync } from "node:fs";
const operation = process.argv[2];
const project = JSON.parse(readFileSync(new URL("../lib/analytics/mission8-project.json", import.meta.url), "utf8"));
if (["dev", "start", "build"].includes(operation) && project.projectName === "bluecollar-mission8-demo") {
  process.exitCode = 0;
} else {
  console.error("MISSION8_LEGACY_BLOCKED: 이 명령은 미션 6 전용입니다. 미션 8 검증 명령은 README를 확인해주세요.");
  process.exitCode = 42;
}