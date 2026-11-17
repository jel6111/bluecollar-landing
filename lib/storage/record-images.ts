import "server-only";
import type { OwnRecords } from "@/lib/supabase/server";
import type { WorkRecord } from "@/lib/supabase/database.types";
import { validImagePath } from "./image-validation";
import { recordIdSchema } from "@/lib/records/validation";

export const RECORD_IMAGE_BUCKET = "mission7-record-images";

export function validOwnedImagePath(userId: string, recordId: string, path: string) {
  const prefix = `users/${userId}/`;
  return recordIdSchema.safeParse(userId).success &&
    path.startsWith(prefix) && validImagePath(recordId, path.slice(prefix.length));
}

export async function recordImageUrls(
  { db, userId }: OwnRecords,
  records: Pick<WorkRecord, "user_id" | "id" | "image_path">[],
) {
  const paths = records.flatMap((record) =>
    record.user_id === userId && record.image_path &&
      validOwnedImagePath(userId, record.id, record.image_path)
      ? [record.image_path]
      : [],
  );
  const urls: Record<string, string> = {};
  if (!paths.length) return urls;
  try {
    const { data, error } = await db.storage
      .from(RECORD_IMAGE_BUCKET)
      .createSignedUrls(paths, 600);
    if (!error && data) {
      for (const image of data) {
        if (image.path && image.signedUrl && !image.error) {
          urls[image.path] = image.signedUrl;
        }
      }
    }
  } catch {
    // Keep the record available while an image cannot be loaded.
  }
  return urls;
}

export async function cleanupImage(context: OwnRecords, id: string, path: string, reason: "rollback") {
  const { db, userId } = context;
  if (!validOwnedImagePath(userId, id, path)) return false;
  try {
    const { error } = await db.from("storage_cleanup_tasks").upsert(
      { user_id: userId, record_id: id, image_path: path, reason },
      { onConflict: "image_path", ignoreDuplicates: true },
    );
    if (error) return false;
    return await retryImageCleanup(context, id, path);
  } catch {
    return false;
  }
}

export async function retryImageCleanup(
  { db, userId }: OwnRecords,
  recordId: string,
  path: string,
): Promise<boolean> {
  if (!validOwnedImagePath(userId, recordId, path)) return false;
  try {
    const referenced = await db.from("work_records").select("id")
      .eq("user_id", userId).eq("id", recordId).eq("image_path", path).maybeSingle();
    if (referenced.error || referenced.data) return false;
    const removed = await db.storage.from(RECORD_IMAGE_BUCKET).remove([path]);
    if (removed.error) return false;
    const completed = await db.from("storage_cleanup_tasks").delete()
      .eq("user_id", userId).eq("image_path", path).eq("record_id", recordId);
    return !completed.error;
  } catch {
    return false;
  }
}

export async function retryPendingImages(context: OwnRecords) {
  const { db, userId } = context;
  const { data, error } = await db.from("storage_cleanup_tasks").select("record_id,image_path")
    .eq("user_id", userId).order("created_at").limit(10);
  if (error) return false;
  const completed = await Promise.all(data.map((item) =>
    retryImageCleanup(context, item.record_id, item.image_path)));
  const remaining = await db.from("storage_cleanup_tasks").select("image_path", { count: "exact", head: true })
    .eq("user_id", userId);
  return completed.every(Boolean) && !remaining.error && remaining.count === 0;
}
