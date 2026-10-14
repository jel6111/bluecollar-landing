import type { RecordFieldErrors, RecordValues } from "./validation";

export type RecordFormState = {
  status: "idle" | "error";
  message: string;
  values: RecordValues;
  submissionId: string;
  fieldErrors: RecordFieldErrors;
};
