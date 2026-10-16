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
    .min(1, "현장 이름을 입력해주세요.")
    .max(80, "현장 이름은 80자 이내로 입력해주세요."),
  work_date: z
    .string()
    .refine(isCalendarDate, "기록 날짜를 올바른 날짜로 입력해주세요."),
  title: z
    .string()
    .trim()
    .max(120, "기록 제목은 120자 이내로 입력해주세요."),
  description: z
    .string()
    .trim()
    .max(2000, "설명은 2000자 이내로 입력해주세요."),
}).transform((record) => ({
  ...record,
  // 제목은 추가 입력이다. 생략해도 DB에는 설명 첫 줄 또는 현장명을 저장한다.
  title: record.title || record.description.split(/\r?\n/)[0].slice(0, 120) || `${record.site_label} 기록`,
}));

export function extractRecordValues(formData: FormData): RecordValues {
  const result = {} as RecordValues;
  for (const field of recordFields) {
    const value = formData.get(field);
    result[field] = typeof value === "string" ? value : "";
  }
  return result;
}
