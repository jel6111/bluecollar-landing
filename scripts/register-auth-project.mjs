import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validateAuthConfiguration } from "../lib/auth/config.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const [ref, confirmation] = process.argv.slice(2);
if (!/^[a-z]{20}$/.test(ref || "") || ref === "uikvezrkmwplbslayene" || confirmation !== "--confirmed-new-mission7") {
  throw new Error("확인한 새 미션 7 project ref와 --confirmed-new-mission7 확인이 필요합니다. 키는 인수로 넣지 마세요.");
}
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true }).trim();
if (git("branch", "--show-current") !== "feature/mission7-user-20261110" || git("remote", "get-url", "origin") !== "https://github.com/jel6111/bluecollar-landing.git") {
  throw new Error("미션 7 전용 체크아웃을 확인해주세요.");
}
const existing = JSON.parse(readFileSync(new URL("../lib/supabase/demo-project.json", import.meta.url), "utf8"));
if (existing.projectName !== "bluecollar-mission7-demo" || (existing.supabaseProjectRef && existing.supabaseProjectRef !== ref)) {
  throw new Error("등록된 대상이 다릅니다. 자동으로 프로젝트를 변경하지 않습니다.");
}
const record = readFileSync(new URL("../docs/mission7-isolation.md", import.meta.url), "utf8");
if (!record.includes(ref)) throw new Error("새 프로젝트 이름과 ref를 분리 문서에서 먼저 확인·기록해주세요.");
process.loadEnvFile(fileURLToPath(new URL("../.env.local", import.meta.url)));
const registration = { projectName: "bluecollar-mission7-demo", mode: "cloud", supabaseProjectRef: ref, confirmedNewDemoProject: true };
validateAuthConfiguration(registration, {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
});
writeFileSync(new URL("../lib/supabase/demo-project.json", import.meta.url), JSON.stringify(registration, null, 2) + "\n");
console.log("새 미션 7 Auth 대상 등록 완료. 키 값은 출력하지 않았습니다. 환경 변경 후 앱을 다시 빌드해주세요.");
