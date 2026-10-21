"use client";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { createRecord, updateRecord } from "@/app/records/actions";
import { Button } from "@/components/ui/button";
import RecordImage from "./RecordImage";
import { IMAGE_ACCEPT, imageInputError } from "@/lib/records/image-rules";
import type { RecordFormState } from "@/lib/records/form-state";
import type { RecordValues, RecordField } from "@/lib/records/validation";
type Props = {
  submissionId: string;
  defaultWorkDate?: string;
  mode?: "create" | "edit";
  initialValues?: RecordValues;
  version?: string;
  page?: number;
  hasImage?: boolean;
  existingImageUrl?: string;
};
const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-offset-2 focus-visible:outline-blue-600 aria-invalid:border-red-500 disabled:bg-slate-50";
export default function RecordForm({
  submissionId,
  defaultWorkDate = "",
  mode = "create",
  initialValues,
  version = "",
  page = 1,
  hasImage = false,
  existingImageUrl,
}: Props) {
  const [values, setValues] = useState<RecordValues>(
    initialValues ?? {
      site_label: "",
      work_date: defaultWorkDate,
      title: "",
      description: "",
    },
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const initialState: RecordFormState = {
    status: "idle",
    message: "",
    values,
    submissionId,
    fieldErrors: {},
  };
  const [state, action, pending] = useActionState(
    async (previous: RecordFormState, formData: FormData) => {
      // React가 실패 응답 뒤 파일 입력을 비워도 선택한 파일을 재전송할 수 있다.
      if (file) formData.set("image", file);
      else formData.delete("image");
      return (mode === "edit" ? updateRecord : createRecord)(
        previous,
        formData,
      );
    },
    initialState,
  );
  const propsFor = (field: RecordField) => ({
    id: field,
    name: field,
    value: values[field],
    disabled: pending,
    "aria-invalid": !!state.fieldErrors[field],
    "aria-describedby": state.fieldErrors[field] ? `${field}-error` : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setValues((current) => ({ ...current, [field]: event.target.value })),
  });
  const errorFor = (field: RecordField) =>
    state.fieldErrors[field] ? (
      <p id={`${field}-error`} className="mt-2 text-sm text-red-700">
        {state.fieldErrors[field]?.[0]}
      </p>
    ) : null;
  const clearFile = () => {
    setFile(null);
    setPreview(undefined);
    setImageError(null);
    if (fileInput.current) fileInput.current.value = "";
  };
  const photoError = imageError ?? state.fieldErrors.image?.[0];
  const cancelHref =
    mode === "edit" ? `/records/${submissionId}?page=${page}` : "/records";
  return (
    <form
      action={action}
      aria-busy={pending}
      className="space-y-6"
      onSubmit={(event) => {
        if (imageError) {
          event.preventDefault();
          fileInput.current?.focus();
        }
      }}
    >
      <input type="hidden" name="submission_id" value={submissionId} />
      <input type="hidden" name="expected_updated_at" value={version} />
      <input type="hidden" name="page" value={page} />
      <div>
        <label htmlFor="image" className="font-bold">
          작업 사진 <span className="font-normal text-slate-500">(선택)</span>
        </label>
        <p
          id="image-help"
          className="mt-2 text-sm leading-relaxed text-slate-500"
        >
          JPG·PNG·WebP 사진 한 장, 최대 3MB. 가상의 자료만 올려주세요.
        </p>
        {mode === "edit" && hasImage && !file && (
          <RecordImage
            src={existingImageUrl}
            hasImage
            alt="현재 등록된 작업 사진"
          />
        )}
        <input
          ref={fileInput}
          id="image"
          name="image"
          type="file"
          accept={IMAGE_ACCEPT}
          disabled={pending}
          aria-invalid={!!photoError}
          aria-describedby={`image-help${photoError ? " image-error" : ""}`}
          className={
            inputClass +
            " file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-bold file:text-blue-700"
          }
          onChange={(event) => {
            const selected = event.target.files?.[0];
            clearFile();
            if (!selected) return;
            const error = imageInputError(selected);
            if (error) {
              setImageError(error);
              return;
            }
            // clearFile가 입력을 비웠으므로 File 객체를 상태에 보관한다.
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setRemoveImage(false);
          }}
        />
        {preview && file && (
          <div className="mt-4">
            <Image
              src={preview}
              alt="선택한 작업 사진 미리보기"
              width={800}
              height={600}
              unoptimized
              className="max-h-64 w-full rounded-xl object-contain"
            />
            <p className="mt-2 break-all text-sm text-slate-600">{file.name}</p>
            <button
              type="button"
              disabled={pending}
              onClick={clearFile}
              className="min-h-11 rounded-lg px-2 text-sm font-bold text-blue-600 underline"
            >
              사진 선택 취소
            </button>
          </div>
        )}
        {mode === "edit" && hasImage && (
          <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="remove_image"
              checked={removeImage}
              disabled={pending}
              className="size-5 accent-blue-600"
              onChange={(event) => {
                if (event.target.checked) clearFile();
                setRemoveImage(event.target.checked);
              }}
            />
            저장할 때 기존 사진 제거
          </label>
        )}
        {photoError && (
          <p
            id="image-error"
            role="alert"
            className="mt-2 text-sm text-red-700"
          >
            {photoError}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="site_label" className="font-bold">
          현장 이름 <span className="text-blue-600">(필수)</span>
        </label>
        <input
          {...propsFor("site_label")}
          className={inputClass}
          required
          maxLength={80}
          placeholder="예: A현장"
          autoComplete="off"
        />
        {errorFor("site_label")}
      </div>
      <div>
        <label htmlFor="description" className="font-bold">
          사진 설명 <span className="font-normal text-slate-500">(선택)</span>
        </label>
        <textarea
          {...propsFor("description")}
          className={inputClass}
          rows={3}
          maxLength={2000}
          placeholder="무슨 작업이었나요? 짧아도 됩니다."
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {["작업 완료했습니다", "확인 부탁드립니다", "작업 전 상태입니다"].map((phrase) => (
            <button key={phrase} type="button" disabled={pending}
              onClick={() => setValues((current) => ({ ...current, description: phrase }))}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              <Plus size={14} aria-hidden />{phrase}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-600">문구를 누르면 설명칸에 들어갑니다. 아래 저장 버튼으로 기록을 남겨주세요.</p>
        {errorFor("description")}
      </div>
      <div>
        <label htmlFor="work_date" className="font-bold">
          기록 날짜 <span className="text-blue-600">(필수)</span>
        </label>
        <input
          {...propsFor("work_date")}
          aria-describedby={"work-date-help" + (state.fieldErrors.work_date ? " work_date-error" : "")}
          className={inputClass}
          type="date"
          required
          min="1900-01-01"
          max="2100-12-31"
        />
        <p id="work-date-help" className="mt-2 text-sm leading-relaxed text-slate-600">직접 선택하는 참고 날짜입니다. 기록 등록일은 저장할 때 따로 남습니다.</p>
        {errorFor("work_date")}
      </div>
      <div>
        <label htmlFor="title" className="font-bold">
          기록 제목 <span className="font-normal text-slate-500">(선택)</span>
        </label>
        <input
          {...propsFor("title")}
          className={inputClass}
          maxLength={120}
          placeholder="비우면 설명이나 현장 이름으로 제목을 만듭니다."
          autoComplete="off"
        />
        {errorFor("title")}
      </div>
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {state.message}
          </p>
        )}
        {(state.fieldErrors.submission_id ||
          state.fieldErrors.expected_updated_at) && (
          <p className="mt-2 text-sm text-red-700">
            {state.fieldErrors.submission_id?.[0] ??
              state.fieldErrors.expected_updated_at?.[0]}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={pending}>
          {pending
            ? "저장 중…"
            : mode === "edit"
              ? "수정 내용 저장"
              : "기록 저장"}
        </Button>
        {pending ? (
          <span className="flex min-h-12 items-center px-4 text-slate-400">
            취소
          </span>
        ) : (
          <Button asChild variant="secondary">
            <Link href={cancelHref}>
              {mode === "edit" ? "취소하고 상세로" : "취소하고 목록으로"}
            </Link>
          </Button>
        )}
      </div>
    </form>
  );
}
