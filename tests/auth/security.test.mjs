import { test } from "node:test";
import assert from "node:assert/strict";
import { validateAuthConfiguration, AuthConfigurationError } from "../../lib/auth/config.ts";
import { safeNext } from "../../lib/auth/redirect.ts";
import { signupSchema, loginSchema } from "../../lib/auth/validation.ts";
import { authErrorMessage } from "../../lib/auth/errors.ts";

const ref = "abcdefghijklmnopqrst";
const cloud = { projectName: "bluecollar-mission7-demo", mode: "cloud", supabaseProjectRef: ref, confirmedNewDemoProject: true };
const values = { url: `https://${ref}.supabase.co`, key: "sb_publishable_" + "a".repeat(30), siteUrl: "http://127.0.0.1:3107" };
test("미등록·미션 6·다른 프로젝트 URL은 인증 요청 전에 거절한다", () => {
  for (const project of [ { ...cloud, confirmedNewDemoProject: false }, { ...cloud, projectName: "bluecollar-mission6-demo" }, { ...cloud, supabaseProjectRef: "uikvezrkmwplbslayene" } ]) assert.throws(() => validateAuthConfiguration(project, values), AuthConfigurationError);
  for (const url of ["https://uikvezrkmwplbslayene.supabase.co", `https://${ref}.supabase.co/path`, `https://user:pass@${ref}.supabase.co`, `https://${ref}.supabase.co?key=value`, "http://127.0.0.1:56321"]) assert.throws(() => validateAuthConfiguration(cloud, { ...values, url }), AuthConfigurationError);
});
test("인증 클라이언트에 관리자 키나 이전 과제 사이트 주소를 허용하지 않는다", () => {
  assert.equal(validateAuthConfiguration(cloud, values).url, values.url);
  assert.throws(() => validateAuthConfiguration(cloud, { ...values, key: "sb_secret_" + "x".repeat(30) }), AuthConfigurationError);
  for (const siteUrl of ["https://parancollar.com", "https://bluecollar-landing.vercel.app", "https://bluecollar-mission6-demo.vercel.app", "http://127.0.0.1:3106", "https://bluecollar-mission7-demo.vercel.app/path"]) assert.throws(() => validateAuthConfiguration(cloud, { ...values, siteUrl }), AuthConfigurationError);
});
test("로컬 Auth는 새 전용 포트만 허용하고 Vercel에서 거절한다", () => {
  const local = { ...cloud, mode: "local", supabaseProjectRef: null, localApiUrl: "http://127.0.0.1:57321" };
  const env = { ...values, url: local.localApiUrl };
  assert.equal(validateAuthConfiguration(local, env).url, env.url);
  assert.throws(() => validateAuthConfiguration(local, { ...env, deployed: true }), AuthConfigurationError);
  const legacy = (role) => "eyJhbGciOiJIUzI1NiJ9." + Buffer.from(JSON.stringify({ role })).toString("base64url") + ".testsignature";
  assert.equal(validateAuthConfiguration(local, { ...env, key: legacy("anon") }).url, env.url);
  assert.throws(() => validateAuthConfiguration(local, { ...env, key: legacy("service_role") }), AuthConfigurationError);
});
test("로그인 복귀는 알려진 기록 경로만 허용하고 외부/인코딩 우회를 거절한다", () => {
  const id = "61111111-1111-4111-8111-111111111111";
  for (const next of ["/records", "/records?page=2", "/records/new", `/records/${id}/edit?page=3`]) assert.equal(safeNext(next), next);
  for (const next of ["https://evil.example", "//evil.example", "/\\evil.example", "/records%2f%2fevil.example", "/records?next=https://evil.example", "/records?page=-1", "/records\r\nLocation:evil", "/records/../login", "/records#token", ["/records"]]) assert.equal(safeNext(next), "/records");
});
test("가입은 이메일·비밀번호 길이와 확인값을 검증하며 비밀번호를 trim하지 않는다", () => {
  const input = { email: " qa@example.invalid ", password: " a-valid-passphrase ", passwordConfirm: " a-valid-passphrase " };
  const parsed = signupSchema.parse(input);
  assert.equal(parsed.email, "qa@example.invalid");
  assert.equal(parsed.password, input.password);
  for (const patch of [{ email: "bad" }, { password: "short", passwordConfirm: "short" }, { passwordConfirm: "different-passphrase" }, { password: " ".repeat(14), passwordConfirm: " ".repeat(14) }, { password: "가".repeat(30), passwordConfirm: "가".repeat(30) }]) assert.equal(signupSchema.safeParse({ ...input, ...patch }).success, false);
  assert.equal(loginSchema.safeParse({ email: "qa@example.invalid", password: "" }).success, false);
});
test("제공자 오류의 원문/토큰을 화면 메시지에 반사하지 않는다", () => {
  const privateMarker = "PRIVATE_TEST_VALUE_DO_NOT_RENDER";
  for (const error of [{ code: "invalid_credentials", message: privateMarker }, { code: "over_request_rate_limit", message: privateMarker }, new Error(privateMarker)]) assert.ok(!authErrorMessage(error).includes(privateMarker));
  assert.match(authErrorMessage({ code: "invalid_credentials" }), /이메일과 비밀번호/);
});
