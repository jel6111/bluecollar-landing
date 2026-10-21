import "server-only";
import { randomUUID } from "node:crypto";
import type { RecordValues } from "./validation";
import type { WorkRecord } from "@/lib/supabase/database.types";
import type { ValidatedImage } from "@/lib/storage/image-validation";
import { validImagePath } from "@/lib/storage/image-validation";
import {
  cleanupImage,
  RECORD_IMAGE_BUCKET,
  type DemoDb,
} from "@/lib/storage/record-images";

export class RecordMutationError extends Error {}
const fields =
  "id,site_label,work_date,title,description,image_path,created_at,updated_at";
const failure = () =>
  new RecordMutationError(
    "기록을 저장하지 못했습니다. 입력한 내용은 유지됩니다. 잠시 후 다시 시도해주세요.",
  );
async function find(db: DemoDb, id: string) {
  const { data, error } = await db
    .from("work_records")
    .select(fields)
    .eq("id", id)
    .maybeSingle();
  if (error) throw failure();
  return data;
}
function sameText(existing: WorkRecord, input: RecordValues) {
  return (
    existing.site_label === input.site_label &&
    existing.work_date === input.work_date &&
    existing.title === input.title &&
    existing.description === input.description
  );
}
async function matches(
  db: DemoDb,
  existing: WorkRecord,
  input: RecordValues,
  image: ValidatedImage | null,
) {
  if (!sameText(existing, input)) return false;
  if (!image) return existing.image_path === null;
  if (!existing.image_path || !validImagePath(existing.id, existing.image_path))
    return false;
  const downloaded = await db.storage
    .from(RECORD_IMAGE_BUCKET)
    .download(existing.image_path);
  return (
    !downloaded.error &&
    !!downloaded.data &&
    Buffer.from(await downloaded.data.arrayBuffer()).equals(image.bytes)
  );
}
async function upload(db: DemoDb, id: string, image: ValidatedImage) {
  const path = `records/${id}/${randomUUID()}.${image.extension}`;
  try {
    const { error } = await db.storage
      .from(RECORD_IMAGE_BUCKET)
      .upload(path, image.bytes, {
        contentType: image.contentType,
        upsert: false,
      });
    if (!error) return path;
  } catch {
    /* 실패/타임아웃 뒤 존재할 수 있는 해당 파일만 정리한다. */
  }
  await cleanupImage(db, id, path, "rollback");
  throw new RecordMutationError(
    "사진을 올리지 못했습니다. 입력한 내용은 유지됩니다. 사진을 다시 선택하고 저장해주세요.",
  );
}
export async function createWorkRecord(
  db: DemoDb,
  id: string,
  input: RecordValues,
  image: ValidatedImage | null,
) {
  const existing = await find(db, id);
  if (existing) {
    if (await matches(db, existing, input, image))
      return { id, cleanupPending: false };
    throw new RecordMutationError(
      "이 등록 화면은 이미 사용되었습니다. 새 기록 작성 화면을 다시 열어주세요.",
    );
  }
  let newPath: string | null = null;
  try {
    if (image) newPath = await upload(db, id, image);
    const { data, error } = await db
      .from("work_records")
      .insert({ id, ...input, image_path: newPath })
      .select("id")
      .single();
    if (!error && data) return { id: data.id, cleanupPending: false };
    if (error?.code === "23505") {
      const saved = await find(db, id);
      if (newPath) await cleanupImage(db, id, newPath, "rollback");
      newPath = null;
      if (saved && (await matches(db, saved, input, image)))
        return { id: saved.id, cleanupPending: false };
      throw new RecordMutationError(
        "이 등록 화면은 이미 사용되었습니다. 새 기록 작성 화면을 다시 열어주세요.",
      );
    }
    // 응답이 실패했더라도 insert가 저장됐을 수 있다. 연결된 경로는 보상 삭제하지 않는다.
    const saved = await find(db, id);
    if (
      saved &&
      saved.image_path === newPath &&
      (await matches(db, saved, input, image))
    )
      return { id: saved.id, cleanupPending: false };
    throw failure();
  } catch (error) {
    if (newPath) await cleanupImage(db, id, newPath, "rollback");
    if (error instanceof RecordMutationError) throw error;
    throw failure();
  }
}
export async function updateWorkRecord(
  db: DemoDb,
  id: string,
  version: string,
  input: RecordValues,
  image: ValidatedImage | null,
  removeImage: boolean,
) {
  const existing = await find(db, id);
  if (!existing)
    throw new RecordMutationError(
      "이 기록은 이미 삭제되었습니다. 목록에서 다시 확인해주세요.",
    );
  if (existing.updated_at !== version)
    throw new RecordMutationError(
      "다른 화면에서 기록이 변경되었습니다. 수정 화면을 다시 열어 최신 내용을 확인해주세요.",
    );
  let newPath: string | null = null;
  let committed = false;
  try {
    if (image) newPath = await upload(db, id, image);
    const nextPath = newPath ?? (removeImage ? null : existing.image_path);
    const { data, error } = await db
      .from("work_records")
      .update({ ...input, image_path: nextPath })
      .eq("id", id)
      .eq("updated_at", version)
      .select("id")
      .maybeSingle();
    if (error || !data) {
      // 네트워크 응답 유실 시 새 파일이 연결됐는지 다시 확인한다.
      const saved = error ? await find(db, id) : null;
      if (!saved || saved.image_path !== nextPath || !sameText(saved, input)) {
        if (!error)
          throw new RecordMutationError(
            "다른 화면에서 기록이 변경되거나 삭제되었습니다. 목록에서 다시 확인해주세요.",
          );
        throw failure();
      }
    }
    committed = true;
    const cleanupPending =
      !!existing.image_path &&
      existing.image_path !== nextPath &&
      !(await cleanupImage(
        db,
        id,
        existing.image_path,
        removeImage ? "removed" : "replaced",
      ));
    return { id, cleanupPending };
  } catch (error) {
    if (!committed && newPath) await cleanupImage(db, id, newPath, "rollback");
    if (error instanceof RecordMutationError) throw error;
    throw failure();
  }
}
export async function deleteWorkRecord(
  db: DemoDb,
  id: string,
  version: string,
) {
  const existing = await find(db, id);
  if (!existing) return { cleanupPending: false };
  if (existing.updated_at !== version)
    throw new RecordMutationError(
      "다른 화면에서 기록이 변경되었습니다. 상세 화면을 새로고침하고 다시 확인해주세요.",
    );
  const { data, error } = await db
    .from("work_records")
    .delete()
    .eq("id", id)
    .eq("updated_at", version)
    .select("id")
    .maybeSingle();
  if (error && (await find(db, id)))
    throw new RecordMutationError(
      "기록을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  if (!error && !data)
    throw new RecordMutationError(
      "다른 화면에서 기록이 변경되었습니다. 상세 화면을 다시 확인해주세요.",
    );
  const cleanupPending =
    !!existing.image_path &&
    !(await cleanupImage(db, id, existing.image_path, "record_deleted"));
  return { cleanupPending };
}
