import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  validateImage,
  ImageValidationError,
  validImagePath,
} from "../lib/storage/image-validation.ts";
import {
  imageInputError,
  MAX_IMAGE_BYTES,
} from "../lib/records/image-rules.ts";
test("JPG·PNG·WebP 실제 이미지를 디코딩하고 올바른 확장자로 처리한다", async () => {
  for (const [format, mime, ext] of [
    ["jpeg", "image/jpeg", "jpg"],
    ["png", "image/png", "png"],
    ["webp", "image/webp", "webp"],
  ]) {
    const bytes = await sharp({
      create: { width: 32, height: 24, channels: 3, background: "#2563eb" },
    })
      .toFormat(format)
      .toBuffer();
    const result = await validateImage(
      new File([bytes], `fixture.${ext}`, { type: mime }),
    );
    assert.equal(result.extension, ext);
    assert.equal(result.contentType, mime);
    assert.ok(
      result.bytes.length > 0 && result.bytes.length <= MAX_IMAGE_BYTES,
    );
  }
});
test("0바이트·크기 초과·잘못된 확장자와 MIME를 거절한다", async () => {
  for (const input of [
    { size: 0, type: "image/png", name: "empty.png" },
    { size: MAX_IMAGE_BYTES + 1, type: "image/png", name: "large.png" },
    { size: 20, type: "image/svg+xml", name: "script.svg" },
    { size: 20, type: "image/png", name: "file.jpg" },
  ])
    assert.ok(imageInputError(input));
  assert.equal(
    imageInputError({
      size: MAX_IMAGE_BYTES,
      type: "image/png",
      name: "boundary.PNG",
    }),
    null,
  );
  await assert.rejects(
    validateImage(new File([], "empty.png", { type: "image/png" })),
    ImageValidationError,
  );
});
test("MIME 위조와 손상된 이미지 내용을 거절한다", async () => {
  await assert.rejects(
    validateImage(
      new File(["not an image"], "fake.png", { type: "image/png" }),
    ),
    ImageValidationError,
  );
  const png = await sharp({
    create: { width: 2, height: 2, channels: 3, background: "blue" },
  })
    .png()
    .toBuffer();
  await assert.rejects(
    validateImage(new File([png], "fake.jpg", { type: "image/jpeg" })),
    ImageValidationError,
  );
});
test("연결된 기록 UUID의 새 파일 경로만 정리 대상으로 허용한다", () => {
  const id = "61111111-1111-4111-8111-111111111111";
  const other = "62222222-2222-4222-8222-222222222222";
  const valid = `records/${id}/${other}.png`;
  assert.equal(validImagePath(id, valid), true);
  for (const path of [
    `records/${other}/${other}.png`,
    `records/${id}/../${other}.png`,
    valid + "?token=abc",
    "https://other.test/" + valid,
    valid.replace(".png", ".svg"),
  ])
    assert.equal(validImagePath(id, path), false);
});
