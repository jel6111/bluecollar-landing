import "server-only";
import type { OwnRecords } from "@/lib/supabase/server";
import { PAGE_SIZE } from "./pagination";
import { recordIdSchema } from "./validation";

const columns =
  "user_id,id,site_label,work_date,title,description,image_path,created_at,updated_at" as const;

export class RecordsQueryError extends Error {
  constructor() {
    super("작업기록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    this.name = "RecordsQueryError";
  }
}

export async function getRecordsPage({ db, userId }: OwnRecords, requestedPage: number) {
  const { count, error: countError } = await db
    .from("work_records")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (countError || count === null) throw new RecordsQueryError();
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const offset = (page - 1) * PAGE_SIZE;
  const { data, error } = await db
    .from("work_records")
    .select(columns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);
  if (error || !data) throw new RecordsQueryError();
  return { records: data, total: count, page, pageCount };
}

export async function getRecord({ db, userId }: OwnRecords, id: string) {
  if (!recordIdSchema.safeParse(id).success) return null;
  const { data, error } = await db
    .from("work_records")
    .select(columns)
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new RecordsQueryError();
  return data;
}
