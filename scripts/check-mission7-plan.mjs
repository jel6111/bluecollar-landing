import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const baseline = "84a7dd703af67bba5d746b9c09caef5d7a0fd9ac";
const read = (path) => readFileSync(resolve(root, path), "utf8").replace(/^\uFEFF/, "");
const json = (path) => JSON.parse(read(path));
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true }).trim();
assert.equal(git("branch", "--show-current"), "feature/mission7-user-20261110");
assert.equal(git("remote", "get-url", "origin"), "https://github.com/jel6111/bluecollar-landing.git");
execFileSync("git", ["merge-base", "--is-ancestor", baseline, "HEAD"], { cwd: root, windowsHide: true });
const registration = json("lib/supabase/demo-project.json");
assert.deepEqual(registration, {
  projectName: "bluecollar-mission7-demo", mode: "unconfigured",
  supabaseProjectRef: null, confirmedNewDemoProject: false,
});
assert.equal(readdirSync(root).filter((p) => p.startsWith(".env") && p !== ".env.example").length, 0);
assert.equal(existsSync(resolve(root, ".vercel")), false);
for (const line of read(".env.example").split(/\r?\n/)) {
  if (!line || line.startsWith("#")) continue;
  assert.match(line, /^[A-Z_]+=$/);
}
const deployment = json("vercel.json").git.deploymentEnabled;
assert.equal(deployment["feature/mission6-*"], false);
assert.equal(deployment["feature/mission7-*"], false);
const launch = json(".claude/launch.json").configurations[0];
assert.equal(launch.port, 3107);
assert.equal(launch.name, "bluecollar-mission7-demo");
assert.equal(launch.cwd.replaceAll("\\", "/").toLowerCase(), root.replaceAll("\\", "/").replace(/\/$/, "").toLowerCase());
const local = read("supabase/config.toml");
assert.ok(local.includes('project_id = "bluecollar-mission7-demo"'));
for (const port of [57321, 57322, 57323]) assert.ok(local.includes(`port = ${port}`));
assert.ok(!local.includes("5632") && !local.includes("3106"));
const pkg = json("package.json");
const lock = json("package-lock.json");
assert.equal(pkg.name, "bluecollar-mission7-demo");
assert.equal(lock.name, pkg.name);
assert.equal(lock.packages[""].name, pkg.name);
const protectedCommands = ["dev", "start", "build", "setup:demo", "check:db", "db:start", "db:stop", "seed:demo", "db:migrate", "cleanup:images", "test:db", "test:e2e", "test:states"];
for (const command of protectedCommands) {
  assert.equal(pkg.scripts[`pre${command}`], `node scripts/mission7-phase-guard.mjs ${command}`);
  const result = spawnSync(process.execPath, [resolve(root, "scripts/mission7-phase-guard.mjs"), command], { cwd: root, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 42);
  assert.ok(result.stderr.includes("MISSION7_DESIGN_ONLY"));
}
const preserved = git("ls-tree", "-r", "--name-only", baseline).split(/\r?\n/).filter((p) => /^docs\/mission[56]-/.test(p) || p.startsWith("supabase/migrations/"));
for (const path of preserved) {
  const original = execFileSync("git", ["show", `${baseline}:${path}`], { cwd: root });
  // Git checkout may convert LF to CRLF; compare normalized text, not bytes.
  assert.equal(read(path).replaceAll("\r\n", "\n"), original.toString("utf8").replaceAll("\r\n", "\n"));
}
const documents = ["README.md", "CLAUDE.md", "AGENTS.md", ...readdirSync(resolve(root, "docs")).filter((p) => p.startsWith("mission7-")).map((p) => `docs/${p}`)];
assert.equal(documents.filter((p) => p.startsWith("docs/mission7-")).length, 5);
let links = 0;
for (const path of documents) {
  const content = read(path);
  assert.ok(!/sb_secret_[A-Za-z0-9_-]{15,}|eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\./.test(content));
  for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1].split("#")[0];
    if (!link || /^[a-z]+:|^\//i.test(link)) continue;
    assert.ok(existsSync(resolve(root, dirname(path), decodeURIComponent(link))), `${path}: missing ${link}`);
    links++;
  }
}
console.log(JSON.stringify({ phase: "mission7-group1-design", documents: documents.length, localLinks: links, guardedCommands: protectedCommands.length, preservedFiles: preserved.length, environmentFiles: 0, connectedCloudProjects: 0, passed: true }));
