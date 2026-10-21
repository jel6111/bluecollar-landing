import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const [ref, confirmation] = process.argv.slice(2);
if (!/^[a-z]{20}$/.test(ref ?? "") || confirmation !== "--new-demo-project") {
  throw new Error(
    "새 과제 project ref와 --new-demo-project 확인이 필요합니다. 비밀 키는 인수로 넣지 마세요.",
  );
}
const branch = execFileSync("git", ["branch", "--show-current"], {
  cwd: root,
  encoding: "utf8",
}).trim();
const remote = execFileSync("git", ["remote", "get-url", "origin"], {
  cwd: root,
  encoding: "utf8",
}).trim();
if (
  branch !== "feature/mission6-crud-20261014" ||
  remote !== "https://github.com/jel6111/bluecollar-landing.git"
) {
  throw new Error("미션 6 전용 체크아웃에서 실행해주세요.");
}
const file = new URL("../lib/supabase/demo-project.json", import.meta.url);
const current = JSON.parse(readFileSync(file, "utf8"));
if (current.supabaseProjectRef && current.supabaseProjectRef !== ref) {
  throw new Error(
    "이미 다른 과제 ref가 등록되어 있습니다. 프로젝트 변경을 먼저 검토해주세요.",
  );
}
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env
  .match(/^SUPABASE_URL=(.*)$/m)?.[1]
  ?.trim()
  .replace(/^["']|["']$/g, "");
if (
  url !== `https://${ref}.supabase.co` &&
  url !== `https://${ref}.supabase.co/`
) {
  throw new Error(
    ".env.local의 Supabase URL이 새 과제 ref와 일치하지 않습니다.",
  );
}
writeFileSync(
  file,
  JSON.stringify(
    {
      projectName: "bluecollar-mission6-demo",
      mode: "cloud",
      supabaseProjectRef: ref,
      confirmedNewDemoProject: true,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "새 과제 project ref 등록 완료. 비밀 키는 기록하거나 출력하지 않았습니다.",
);
