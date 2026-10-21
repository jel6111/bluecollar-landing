"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createDemoClient } from "@/lib/supabase/server";
import { DemoConfigurationError } from "@/lib/supabase/config";
import {
  createRecordSchema,
  extractRecordValues,
  recordFields,
  recordIdSchema,
  type RecordFieldErrors,
} from "@/lib/records/validation";
import {
  ImageValidationError,
  validateImage,
  type ValidatedImage,
} from "@/lib/storage/image-validation";
import {
  createWorkRecord,
  updateWorkRecord,
  deleteWorkRecord,
  RecordMutationError,
} from "@/lib/records/service";
import { listHref, parsePage } from "@/lib/records/pagination";
import type {
  RecordFormState,
  DeleteFormState,
} from "@/lib/records/form-state";
async function parseForm(formData: FormData, editing: boolean) {
  const values = extractRecordValues(formData);
  const submissionId =
    typeof formData.get("submission_id") === "string"
      ? String(formData.get("submission_id"))
      : "";
  const failed = (message: string, fieldErrors: RecordFieldErrors = {}) => ({
    ok: false as const,
    state: {
      status: "error" as const,
      message,
      values,
      submissionId,
      fieldErrors,
    },
  });
  if (
    ![
      ...recordFields,
      "submission_id",
      "expected_updated_at",
      "page",
      "remove_image",
    ].every(
      (field) =>
        formData.getAll(field).length <= 1 &&
        formData.getAll(field).every((value) => typeof value === "string"),
    )
  )
    return failed("입력 형식을 확인하고 다시 저장해주세요.");
  const parsed = createRecordSchema.safeParse({
    ...values,
    submission_id: submissionId,
  });
  if (!parsed.success)
    return failed(
      "입력한 내용을 확인해주세요.",
      parsed.error.flatten().fieldErrors,
    );
  const version = String(formData.get("expected_updated_at") ?? "");
  if (
    editing &&
    (!version || version.length > 80 || Number.isNaN(Date.parse(version)))
  )
    return failed("수정 화면을 다시 열고 저장해주세요.", {
      expected_updated_at: ["기록의 수정 시각을 확인할 수 없습니다."],
    });
  const entries = formData.getAll("image");
  if (entries.length > 1 || entries.some((entry) => !(entry instanceof File)))
    return failed("사진 한 장을 선택해주세요.", {
      image: ["사진 한 장만 올릴 수 있습니다."],
    });
  const file = entries[0] as File | undefined;
  const imageFile =
    file && !(file.size === 0 && file.name === "") ? file : null;
  const removeImage = formData.get("remove_image") === "on";
  if (removeImage && imageFile)
    return failed("사진 교체와 제거 중 하나를 선택해주세요.", {
      image: ["새 사진을 올릴 때 사진 제거를 해제해주세요."],
    });
  let image: ValidatedImage | null = null;
  try {
    if (imageFile) image = await validateImage(imageFile);
  } catch (error) {
    return failed("사진을 확인해주세요.", {
      image: [
        error instanceof ImageValidationError
          ? error.message
          : "사진을 처리하지 못했습니다. 다시 선택해주세요.",
      ],
    });
  }
  const { submission_id: id, ...input } = parsed.data;
  return {
    ok: true as const,
    id,
    input,
    image,
    removeImage,
    version,
    page: parsePage(String(formData.get("page") ?? "1")),
    failed,
  };
}
function mutationMessage(error: unknown) {
  return error instanceof DemoConfigurationError ||
    error instanceof RecordMutationError
    ? error.message
    : "처리하지 못했습니다. 입력한 내용은 유지됩니다. 잠시 후 다시 시도해주세요.";
}
function refreshRecord(id: string) {
  revalidatePath("/records");
  revalidatePath(`/records/${id}`);
  revalidatePath(`/records/${id}/edit`);
}
export async function createRecord(
  _previous: RecordFormState,
  formData: FormData,
): Promise<RecordFormState> {
  const parsed = await parseForm(formData, false);
  if (!parsed.ok) return parsed.state;
  let result;
  try {
    result = await createWorkRecord(
      createDemoClient(),
      parsed.id,
      parsed.input,
      parsed.image,
    );
  } catch (error) {
    return parsed.failed(mutationMessage(error)).state;
  }
  refreshRecord(result.id);
  redirect(`/records/${result.id}?page=1`);
}
export async function updateRecord(
  _previous: RecordFormState,
  formData: FormData,
): Promise<RecordFormState> {
  const parsed = await parseForm(formData, true);
  if (!parsed.ok) return parsed.state;
  let result;
  try {
    result = await updateWorkRecord(
      createDemoClient(),
      parsed.id,
      parsed.version,
      parsed.input,
      parsed.image,
      parsed.removeImage,
    );
  } catch (error) {
    return parsed.failed(mutationMessage(error)).state;
  }
  refreshRecord(result.id);
  redirect(
    `/records/${result.id}?page=${parsed.page}${result.cleanupPending ? "&notice=cleanup-pending" : ""}`,
  );
}
export async function deleteRecord(
  _previous: DeleteFormState,
  formData: FormData,
): Promise<DeleteFormState> {
  const id = formData.get("record_id");
  const version = formData.get("expected_updated_at");
  if (
    !["record_id", "expected_updated_at", "page", "confirm_delete"].every(
      (field) =>
        formData.getAll(field).length === 1 &&
        formData.getAll(field).every((value) => typeof value === "string"),
    ) ||
    !recordIdSchema.safeParse(id).success ||
    typeof version !== "string" ||
    !version ||
    version.length > 80 ||
    Number.isNaN(Date.parse(version)) ||
    formData.get("confirm_delete") !== "yes"
  )
    return {
      message:
        "삭제 확인 정보를 읽을 수 없습니다. 상세 화면을 새로고침해주세요.",
    };
  let result;
  try {
    result = await deleteWorkRecord(createDemoClient(), String(id), version);
  } catch (error) {
    return { message: mutationMessage(error) };
  }
  refreshRecord(String(id));
  const page = parsePage(String(formData.get("page")));
  redirect(
    listHref(page) + (result.cleanupPending ? "&notice=cleanup-pending" : ""),
  );
}
