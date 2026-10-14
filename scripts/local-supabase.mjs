import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const action = process.argv[2] ?? "start";
if (!["start", "stop"].includes(action))
  throw new Error("start 또는 stop만 사용할 수 있습니다.");
const config = readFileSync(
  new URL("../supabase/config.toml", import.meta.url),
  "utf8",
);
if (
  !config.includes('project_id = "bluecollar-mission6-demo"') ||
  !/\[api\][\s\S]*?port = 56321/.test(config)
) {
  throw new Error("미션 6 전용 로컬 설정을 확인해주세요.");
}
function cli(args) {
  const command = "npx --yes supabase@2.120.0 " + args.join(" ");
  try {
    return process.platform === "win32"
      ? execFileSync(
          "C:\\Windows\\System32\\cmd.exe",
          ["/d", "/s", "/c", command],
          {
            cwd: root,
            encoding: "utf8",
            windowsHide: true,
            stdio: ["ignore", "pipe", "pipe"],
            maxBuffer: 10 * 1024 * 1024,
          },
        )
      : execFileSync("npx", ["--yes", "supabase@2.120.0", ...args], {
          cwd: root,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
          maxBuffer: 10 * 1024 * 1024,
        });
  } catch {
    throw new Error(
      "과제 로컬 Supabase 명령이 실패했습니다. Docker와 전용 포트를 확인해주세요. 비밀값이 포함될 수 있는 원문 출력은 표시하지 않았습니다.",
    );
  }
}
if (action === "stop") {
  cli(["stop", "--project-id", "bluecollar-mission6-demo"]);
  console.log("미션 6 로컬 스택만 중지했습니다. 데이터 볼륨은 유지됩니다.");
} else {
  const envPath = new URL("../.env.local", import.meta.url);
  const previous = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  const previousUrl = previous.match(/^SUPABASE_URL=(.*)$/m)?.[1]?.trim();
  if (previousUrl && previousUrl !== "http://127.0.0.1:56321") {
    throw new Error("이미 설정된 다른 프로젝트 환경 변수를 덮어쓰지 않습니다.");
  }
  cli([
    "start",
    "--exclude",
    "realtime,imgproxy,mailpit,edge-runtime,logflare,vector,supavisor",
  ]);
  const values = Object.fromEntries(
    cli(["status", "--output", "env"])
      .split(/\r?\n/)
      .flatMap((line) => {
        const match = line.match(/^([A-Z_]+)="(.*)"$/);
        return match ? [[match[1], match[2]]] : [];
      }),
  );
  const secret = values.SECRET_KEY || values.SERVICE_ROLE_KEY;
  if (values.API_URL !== "http://127.0.0.1:56321" || !secret)
    throw new Error("새 로컬 스택의 연결 항목을 확인할 수 없습니다.");
  writeFileSync(
    envPath,
    "SUPABASE_URL=http://127.0.0.1:56321\nSUPABASE_SECRET_KEY=" +
      secret +
      "\nNEXT_PUBLIC_SITE_URL=http://127.0.0.1:3106\n",
  );
  writeFileSync(
    new URL("../lib/supabase/demo-project.json", import.meta.url),
    JSON.stringify(
      {
        projectName: "bluecollar-mission6-demo",
        mode: "local",
        supabaseProjectRef: null,
        localApiUrl: values.API_URL,
        confirmedNewDemoProject: true,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "미션 6 로컬 Supabase와 비추적 환경 파일을 준비했습니다. 키 값은 출력하지 않았습니다.",
  );
}
