import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { validateDemoConnection } from "../../lib/supabase/config.ts";
import { validateImage } from "../../lib/storage/image-validation.ts";
import {
  createWorkRecord,
  updateWorkRecord,
  deleteWorkRecord,
  RecordMutationError,
} from "../../lib/records/service.ts";
import {
  cleanupImage,
  retryImageCleanup,
  RECORD_IMAGE_BUCKET,
} from "../../lib/storage/record-images.ts";
process.loadEnvFile(".env.local");
const registration = JSON.parse(
  readFileSync("lib/supabase/demo-project.json", "utf8"),
);
const connection = validateDemoConnection(registration, {
  url: process.env.SUPABASE_URL,
  secret: process.env.SUPABASE_SECRET_KEY,
});
const client = (fetcher) =>
  createClient(connection.url, connection.secret, {
    auth: { persistSession: false },
    global: fetcher ? { fetch: fetcher } : {},
  });
const db = client();
const ids = [];
const allocate = () => {
  const id = randomUUID();
  ids.push(id);
  return id;
};
const input = {
  site_label: "QA 가상현장",
  work_date: "2026-10-14",
  title: "QA 가상 사진 기록",
  description: "실제 자료가 아닌 테스트입니다.",
};
async function picture(color = "#2563eb") {
  const buffer = await sharp({
    create: { width: 32, height: 24, channels: 3, background: color },
  })
    .png()
    .toBuffer();
  return validateImage(
    new File([buffer], "fake-fixture.png", { type: "image/png" }),
  );
}
async function get(id) {
  const result = await db
    .from("work_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  assert.equal(result.error, null);
  return result.data;
}
async function files(id) {
  const result = await db.storage
    .from(RECORD_IMAGE_BUCKET)
    .list("records/" + id);
  assert.equal(result.error, null);
  return result.data ?? [];
}
function failRequests(match, afterCommit = false) {
  return async (request, init) => {
    const url = new URL(
      typeof request === "string"
        ? request
        : request instanceof URL
          ? request.href
          : request.url,
    );
    const method = (
      init?.method ?? (request instanceof Request ? request.method : "GET")
    ).toUpperCase();
    if (match(url.pathname, method)) {
      if (afterCommit) await fetch(request, init);
      return new Response(
        JSON.stringify({
          message: "QA controlled failure",
          error: "QA",
          statusCode: "503",
        }),
        { status: 503, headers: { "content-type": "application/json" } },
      );
    }
    return fetch(request, init);
  };
}
afterEach(async () => {
  for (const id of ids.splice(0)) {
    const found = await files(id);
    if (found.length) {
      const removed = await db.storage
        .from(RECORD_IMAGE_BUCKET)
        .remove(found.map((file) => "records/" + id + "/" + file.name));
      assert.equal(removed.error, null);
    }
    assert.equal(
      (await db.from("work_records").delete().eq("id", id)).error,
      null,
    );
    assert.equal(
      (await db.from("storage_cleanup_tasks").delete().eq("record_id", id))
        .error,
      null,
    );
  }
});
test("과제 Storage는 비공개이고 3MiB·3가지 형식만 허용한다", async () => {
  const result = await db.storage.getBucket(RECORD_IMAGE_BUCKET);
  assert.equal(result.error, null);
  assert.equal(result.data.public, false);
  assert.equal(Number(result.data.file_size_limit), 3145728);
  assert.deepEqual(
    [...result.data.allowed_mime_types].sort(),
    ["image/jpeg", "image/png", "image/webp"].sort(),
  );
});
test("사진 등록 재전송은 같은 레코드와 파일 1개를 유지한다", async () => {
  const id = allocate(),
    image = await picture();
  await createWorkRecord(db, id, input, image);
  await createWorkRecord(db, id, input, image);
  assert.equal((await files(id)).length, 1);
  await assert.rejects(
    createWorkRecord(db, id, { ...input, title: "다른 내용" }, image),
    RecordMutationError,
  );
  const record = await get(id);
  assert.equal(record.title, input.title);
  const publicUrl = db.storage
    .from(RECORD_IMAGE_BUCKET)
    .getPublicUrl(record.image_path).data.publicUrl;
  assert.ok((await fetch(publicUrl)).status >= 400);
});
test("업로드 실패·업로드 뒤 DB 등록 실패는 성공으로 처리하지 않고 새 파일을 정리한다", async () => {
  const image = await picture();
  for (const match of [
    (path, method) => path.includes("/storage/v1/object/") && method === "POST",
    (path, method) => path === "/rest/v1/work_records" && method === "POST",
  ]) {
    const id = allocate();
    await assert.rejects(
      createWorkRecord(client(failRequests(match)), id, input, image),
      RecordMutationError,
    );
    assert.equal(await get(id), null);
    assert.equal((await files(id)).length, 0);
  }
});
test("사진 교체 뒤 DB 수정 실패는 이전 레코드·사진을 유지하고 새 파일을 정리한다", async () => {
  const id = allocate();
  await createWorkRecord(db, id, input, await picture());
  const before = await get(id);
  const broken = client(
    failRequests(
      (path, method) => path === "/rest/v1/work_records" && method === "PATCH",
    ),
  );
  await assert.rejects(
    updateWorkRecord(
      broken,
      id,
      before.updated_at,
      { ...input, title: "실패한 변경" },
      await picture("#dc2626"),
      false,
    ),
    RecordMutationError,
  );
  const after = await get(id);
  assert.equal(after.image_path, before.image_path);
  assert.equal(after.title, before.title);
  assert.equal((await files(id)).length, 1);
});
test("파일 삭제 실패는 DB에 재시도 내역을 남기고 재시도하면 파일·내역을 정리한다", async () => {
  const id = allocate();
  await createWorkRecord(db, id, input, await picture());
  const before = await get(id);
  const broken = client(
    failRequests(
      (path, method) =>
        path.includes("/storage/v1/object/") && method === "DELETE",
    ),
  );
  const result = await deleteWorkRecord(broken, id, before.updated_at);
  assert.equal(result.cleanupPending, true);
  assert.equal(await get(id), null);
  assert.equal((await files(id)).length, 1);
  const queued = await db
    .from("storage_cleanup_tasks")
    .select("*")
    .eq("record_id", id);
  assert.equal(queued.error, null);
  assert.equal(queued.data.length, 1);
  assert.equal(await retryImageCleanup(db, id, before.image_path), true);
  assert.equal((await files(id)).length, 0);
  assert.equal(
    (await db.from("storage_cleanup_tasks").select("id").eq("record_id", id))
      .data.length,
    0,
  );
});
test("최신 기록과 연결된 파일은 정리하지 않고 오래된 수정·삭제 요청은 거절한다", async () => {
  const id = allocate();
  await createWorkRecord(db, id, input, await picture());
  const before = await get(id);
  assert.equal(
    await cleanupImage(db, id, before.image_path, "rollback"),
    false,
  );
  assert.equal((await files(id)).length, 1);
  await updateWorkRecord(
    db,
    id,
    before.updated_at,
    { ...input, title: "최신 변경" },
    null,
    false,
  );
  const after = await get(id);
  assert.notEqual(after.updated_at, before.updated_at);
  await assert.rejects(
    updateWorkRecord(
      db,
      id,
      before.updated_at,
      input,
      await picture("red"),
      false,
    ),
    RecordMutationError,
  );
  await assert.rejects(
    deleteWorkRecord(db, id, before.updated_at),
    RecordMutationError,
  );
  assert.equal((await get(id)).title, "최신 변경");
  assert.equal((await files(id)).length, 1);
});
test("DB 저장 응답이 유실돼도 연결된 사진을 지우지 않고 실제 저장 결과를 확인한다", async () => {
  const id = allocate();
  const broken = client(
    failRequests(
      (path, method) =>
        path === "/rest/v1/work_records" &&
        ["POST", "PATCH", "DELETE"].includes(method),
      true,
    ),
  );
  await createWorkRecord(broken, id, input, await picture());
  const before = await get(id);
  assert.equal((await files(id)).length, 1);
  await updateWorkRecord(
    broken,
    id,
    before.updated_at,
    { ...input, title: "응답 유실 수정" },
    await picture("green"),
    false,
  );
  const after = await get(id);
  assert.equal(after.title, "응답 유실 수정");
  assert.notEqual(after.image_path, before.image_path);
  assert.equal((await files(id)).length, 1);
  await deleteWorkRecord(broken, id, after.updated_at);
  assert.equal(await get(id), null);
  assert.equal((await files(id)).length, 0);
});
