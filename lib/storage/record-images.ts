import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, WorkRecord } from "@/lib/supabase/database.types";
import { validImagePath } from "./image-validation";
export const RECORD_IMAGE_BUCKET = "work-record-images";
export type DemoDb = SupabaseClient<Database>;
export type CleanupReason =
  "rollback" | "replaced" | "removed" | "record_deleted";

export async function recordImageUrls(
  db: DemoDb,
  records: Pick<WorkRecord, "id" | "image_path">[],
) {
  const paths = records.flatMap((record) =>
    record.image_path && validImagePath(record.id, record.image_path)
      ? [record.image_path]
      : [],
  );
  const urls: Record<string, string> = {};
  if (!paths.length) return urls;
  try {
    const { data, error } = await db.storage
      .from(RECORD_IMAGE_BUCKET)
      .createSignedUrls(paths, 600);
    if (!error && data)
      for (const image of data) {
        if (image.path && image.signedUrl && !image.error)
          urls[image.path] = image.signedUrl;
      }
  } catch {
    /* 기록은 계속 표시하고 사진에만 재조회 안내를 제공한다. */
  }
  return urls;
}

export async function cleanupImage(
  db: DemoDb,
  recordId: string,
  path: string,
  reason: CleanupReason,
): Promise<boolean> {
  if (!validImagePath(recordId, path)) return false;
  try {
    const queued = await db
      .from("storage_cleanup_tasks")
      .upsert(
        { record_id: recordId, image_path: path, reason },
        { onConflict: "image_path", ignoreDuplicates: true },
      );
    if (queued.error) {
      console.warn("과제 파일 정리 내역 저장 실패", { recordId, path });
      return false;
    }
    return await retryImageCleanup(db, recordId, path);
  } catch {
    console.warn("과제 파일 정리 재시도 필요", { recordId, path });
    return false;
  }
}

export async function retryImageCleanup(
  db: DemoDb,
  recordId: string,
  path: string,
): Promise<boolean> {
  if (!validImagePath(recordId, path)) return false;
  try {
    // 현재 연결된 사진은 지우지 않는다. 경로는 새 UUID로만 생성하며 재사용하지 않는다.
    const referenced = await db
      .from("work_records")
      .select("id")
      .eq("image_path", path)
      .limit(1);
    if (referenced.error || referenced.data?.length) return false;
    const removed = await db.storage.from(RECORD_IMAGE_BUCKET).remove([path]);
    if (removed.error) return false;
    const completed = await db
      .from("storage_cleanup_tasks")
      .delete()
      .eq("image_path", path)
      .eq("record_id", recordId);
    return !completed.error;
  } catch {
    return false;
  }
}
