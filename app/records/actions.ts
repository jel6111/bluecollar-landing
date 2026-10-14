"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createDemoClient } from "@/lib/supabase/server";
import { DemoConfigurationError } from "@/lib/supabase/config";
import {
  createRecordSchema,
  extractRecordValues,
  recordFields,
  type RecordFieldErrors,
} from "@/lib/records/validation";
import type { RecordFormState } from "@/lib/records/form-state";
export async function createRecord(
  _previousState: RecordFormState,
  formData: FormData,
): Promise<RecordFormState> {
  const values = extractRecordValues(formData);
  const submissionId =
    typeof formData.get("submission_id") === "string"
      ? String(formData.get("submission_id"))
      : "";
  const failed = (
    message: string,
    fieldErrors: RecordFieldErrors = {},
  ): RecordFormState => ({
    status: "error",
    message,
    values,
    submissionId,
    fieldErrors,
  });
  const validShape = [...recordFields, "submission_id"].every((field) => {
    const entries = formData.getAll(field);
    return (
      entries.length <= 1 && entries.every((value) => typeof value === "string")
    );
  });
  if (!validShape) return failed("입력 형식을 확인하고 다시 저장해주세요.");
  const parsed = createRecordSchema.safeParse({
    ...values,
    submission_id: submissionId,
  });
  if (!parsed.success)
    return failed(
      "입력한 내용을 확인해주세요.",
      parsed.error.flatten().fieldErrors,
    );
  const { submission_id: id, ...input } = parsed.data;
  let savedId: string;
  try {
    const db = createDemoClient();
    const { data, error } = await db
      .from("work_records")
      .insert({ id, ...input, image_path: null })
      .select("id")
      .single();
    if (error?.code === "23505") {
      // 같은 제출 ID가 재전송되면 같은 기록으로 이동해 중복 생성을 막는다.
      const existing = await db
        .from("work_records")
        .select("id,site_label,work_date,title,description")
        .eq("id", id)
        .maybeSingle();
      if (
        existing.error ||
        !existing.data ||
        existing.data.site_label !== input.site_label ||
        existing.data.work_date !== input.work_date ||
        existing.data.title !== input.title ||
        existing.data.description !== input.description
      )
        return failed(
          "이 등록 화면은 이미 사용되었습니다. 새 기록 작성 화면을 다시 열어주세요.",
        );
      savedId = existing.data.id;
    } else {
      if (error || !data)
        return failed(
          "기록을 저장하지 못했습니다. 입력한 내용은 유지됩니다. 잠시 후 다시 시도해주세요.",
        );
      savedId = data.id;
    }
  } catch (error) {
    if (error instanceof DemoConfigurationError) return failed(error.message);
    return failed(
      "기록을 저장하지 못했습니다. 입력한 내용은 유지됩니다. 잠시 후 다시 시도해주세요.",
    );
  }
  revalidatePath("/records");
  redirect(`/records/${savedId}?page=1`);
}
