import { z } from "zod";

export const recordFields = [
  "site_label",
  "work_date",
  "title",
  "description",
] as const;
export type RecordField = (typeof recordFields)[number];
export type RecordValues = Record<RecordField, string>;
export type RecordFieldErrors = Partial<
  Record<
    RecordField | "submission_id" | "image" | "expected_updated_at",
    string[]
  >
>;

export function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1900 || year > 2100) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const recordIdSchema = z.uuid();
export const createRecordSchema = z.object({
  submission_id: z.uuid("등록 화면을 새로 열고 다시 저장해주세요."),
  site_label: z
    .string()
    .trim()
    .min(1, "현장 별칭을 입력해주세요.")
    .max(80, "현장 별칭은 80자 이내로 입력해주세요."),
  work_date: z
    .string()
    .refine(isCalendarDate, "작업일을 올바른 날짜로 입력해주세요."),
  title: z
    .string()
    .trim()
    .min(1, "작업 제목을 입력해주세요.")
    .max(120, "작업 제목은 120자 이내로 입력해주세요."),
  description: z
    .string()
    .trim()
    .max(2000, "설명은 2000자 이내로 입력해주세요."),
});

export function extractRecordValues(formData: FormData): RecordValues {
  const result = {} as RecordValues;
  for (const field of recordFields) {
    const value = formData.get(field);
    result[field] = typeof value === "string" ? value : "";
  }
  return result;
}
