"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { createRecord } from "@/app/records/actions";
import { Button } from "@/components/ui/button";
import type { RecordFormState } from "@/lib/records/form-state";
import type { RecordValues, RecordField } from "@/lib/records/validation";
type Props = { submissionId: string; defaultWorkDate: string };
const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-offset-2 focus-visible:outline-blue-600 aria-invalid:border-red-500 disabled:bg-slate-50";
export default function RecordForm({ submissionId, defaultWorkDate }: Props) {
  const [values, setValues] = useState<RecordValues>({
    site_label: "",
    work_date: defaultWorkDate,
    title: "",
    description: "",
  });
  const initialState: RecordFormState = {
    status: "idle",
    message: "",
    values,
    submissionId,
    fieldErrors: {},
  };
  const [state, action, pending] = useActionState(createRecord, initialState);
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
  return (
    <form action={action} aria-busy={pending} className="space-y-6">
      <input type="hidden" name="submission_id" value={submissionId} />
      <div>
        <label htmlFor="site_label" className="font-bold">
          현장 별칭 <span className="text-blue-600">(필수)</span>
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
        <label htmlFor="work_date" className="font-bold">
          작업일 <span className="text-blue-600">(필수)</span>
        </label>
        <input
          {...propsFor("work_date")}
          className={inputClass}
          type="date"
          required
          min="1900-01-01"
          max="2100-12-31"
        />
        {errorFor("work_date")}
      </div>
      <div>
        <label htmlFor="title" className="font-bold">
          작업 제목 <span className="text-blue-600">(필수)</span>
        </label>
        <input
          {...propsFor("title")}
          className={inputClass}
          required
          maxLength={120}
          placeholder="예: 욕실 타일 점검"
          autoComplete="off"
        />
        {errorFor("title")}
      </div>
      <div>
        <label htmlFor="description" className="font-bold">
          작업 설명 <span className="font-normal text-slate-500">(선택)</span>
        </label>
        <textarea
          {...propsFor("description")}
          className={inputClass}
          rows={5}
          maxLength={2000}
          placeholder="가상의 작업 내용을 적어주세요."
        />
        {errorFor("description")}
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
        {state.fieldErrors.submission_id && (
          <p className="mt-2 text-sm text-red-700">
            {state.fieldErrors.submission_id[0]}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중…" : "기록 저장"}
        </Button>
        {pending ? (
          <span className="flex min-h-12 items-center px-4 text-slate-400">
            취소
          </span>
        ) : (
          <Button asChild variant="secondary">
            <Link href="/records">취소하고 목록으로</Link>
          </Button>
        )}
      </div>
    </form>
  );
}
