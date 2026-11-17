import { z } from "zod";

const email = z.string().trim().max(254, "이메일 주소를 확인해주세요.").email("이메일 주소를 올바르게 입력해주세요.");
const password = z.string().max(64, "비밀번호는 64자 이하로 입력해주세요.").refine(
  (value) => new TextEncoder().encode(value).length <= 72,
  "비밀번호가 너무 깁니다. 길이를 줄여주세요.",
);
export const loginSchema = z.object({
  email,
  password: password.refine((value) => value.length > 0, "비밀번호를 입력해주세요."),
});
export const signupSchema = z.object({
  email,
  password: password.refine((value) => value.length >= 12 && value.trim().length > 0, "비밀번호는 12~64자로 입력해주세요."),
  passwordConfirm: z.string(),
}).refine((value) => value.password === value.passwordConfirm, {
  path: ["passwordConfirm"], message: "비밀번호가 일치하지 않습니다.",
});
export type AuthField = "email" | "password" | "passwordConfirm";
export type AuthFormState = {
  message?: string;
  email?: string;
  next: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
};
