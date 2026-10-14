import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createRecordSchema,
  isCalendarDate,
  recordIdSchema,
} from "../lib/records/validation.ts";
import { parsePage, pageWindow } from "../lib/records/pagination.ts";
import {
  validateDemoConnection,
  DemoConfigurationError,
} from "../lib/supabase/config.ts";

const valid = {
  submission_id: "61111111-1111-4111-8111-111111111111",
  site_label: " A현장 ",
  work_date: "2026-10-14",
  title: " 타일 점검 ",
  description: "",
};

test("공백을 정리하고 사진 없는 유효한 텍스트 기록을 허용한다", () => {
  const result = createRecordSchema.parse(valid);
  assert.equal(result.site_label, "A현장");
  assert.equal(result.title, "타일 점검");
});
test("달력에 없는 날짜와 지원 범위 밖 날짜를 거절한다", () => {
  for (const date of [
    "2026-02-30",
    "2025-02-29",
    "1900-02-29",
    "2026-13-01",
    "2026-00-12",
    "2101-01-01",
    "1899-12-31",
    "2026-1-1",
    "",
  ])
    assert.equal(isCalendarDate(date), false, date);
  for (const date of ["2000-02-29", "2024-02-29", "1900-01-01", "2100-12-31"])
    assert.equal(isCalendarDate(date), true, date);
});
test("공백만인 필수값과 길이 초과를 거절한다", () => {
  for (const [field, value] of [
    ["site_label", " "],
    ["title", "\t"],
    ["site_label", "가".repeat(81)],
    ["title", "가".repeat(121)],
    ["description", "가".repeat(2001)],
  ])
    assert.equal(
      createRecordSchema.safeParse({ ...valid, [field]: value }).success,
      false,
    );
});
test("서버 제출 ID와 상세 ID에 유효한 UUID를 요구한다", () => {
  assert.equal(
    createRecordSchema.safeParse({ ...valid, submission_id: "existing-row" })
      .success,
    false,
  );
  assert.equal(recordIdSchema.safeParse("not-an-id").success, false);
  assert.equal(recordIdSchema.safeParse(valid.submission_id).success, true);
});
test("잘못된 페이지를 기본값으로 정규화한다", () => {
  for (const page of [
    undefined,
    "0",
    "-1",
    "1.5",
    "NaN",
    "1e3",
    ["1", "2"],
    "999999999999999999999",
  ])
    assert.equal(parsePage(page), 1);
  assert.equal(parsePage("2"), 2);
  assert.deepEqual(pageWindow(5, 10), [1, 3, 4, 5, 6, 7, 10]);
});
const cloud = {
  projectName: "bluecollar-mission6-demo",
  mode: "cloud",
  supabaseProjectRef: "abcdefghijklmnopqrst",
  confirmedNewDemoProject: true,
};
test("허용된 과제 ref와 일치하는 HTTPS 주소만 연결한다", () => {
  assert.equal(
    validateDemoConnection(cloud, {
      url: "https://abcdefghijklmnopqrst.supabase.co",
      secret: "test-only",
    }).url,
    "https://abcdefghijklmnopqrst.supabase.co",
  );
  for (const url of [
    "https://aaaaaaaaaaaaaaaaaaaa.supabase.co",
    "http://abcdefghijklmnopqrst.supabase.co",
    "https://abcdefghijklmnopqrst.supabase.co.evil.test",
    "https://abcdefghijklmnopqrst.supabase.co/rest/v1",
    "https://user:pass@abcdefghijklmnopqrst.supabase.co",
  ])
    assert.throws(
      () => validateDemoConnection(cloud, { url, secret: "test-only" }),
      DemoConfigurationError,
    );
});
test("미등록 프로젝트와 비어 있는 키는 네트워크 호출 전에 거절한다", () => {
  assert.throws(
    () =>
      validateDemoConnection(
        { ...cloud, mode: "unregistered" },
        {
          url: "https://abcdefghijklmnopqrst.supabase.co",
          secret: "test-only",
        },
      ),
    DemoConfigurationError,
  );
  assert.throws(
    () =>
      validateDemoConnection(
        { ...cloud, confirmedNewDemoProject: false },
        {
          url: "https://abcdefghijklmnopqrst.supabase.co",
          secret: "test-only",
        },
      ),
    DemoConfigurationError,
  );
  assert.throws(
    () =>
      validateDemoConnection(cloud, {
        url: "https://abcdefghijklmnopqrst.supabase.co",
        secret: "",
      }),
    DemoConfigurationError,
  );
});
test("로컬 과제는 지정된 포트만 허용하고 Vercel에서는 거절한다", () => {
  const local = {
    projectName: "bluecollar-mission6-demo",
    mode: "local",
    localApiUrl: "http://127.0.0.1:56321",
    supabaseProjectRef: null,
    confirmedNewDemoProject: true,
  };
  assert.equal(
    validateDemoConnection(local, {
      url: local.localApiUrl,
      secret: "test-only",
    }).url,
    local.localApiUrl,
  );
  assert.throws(
    () =>
      validateDemoConnection(local, {
        url: "http://127.0.0.1:54321",
        secret: "test-only",
      }),
    DemoConfigurationError,
  );
  assert.throws(
    () =>
      validateDemoConnection(local, {
        url: local.localApiUrl,
        secret: "test-only",
        deployed: true,
      }),
    DemoConfigurationError,
  );
});
