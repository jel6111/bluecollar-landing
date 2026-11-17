"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/auth/server";
import { authConfiguration } from "@/lib/auth/environment";
import { authErrorMessage } from "@/lib/auth/errors";
import { safeNext } from "@/lib/auth/redirect";
import { loginSchema, signupSchema, type AuthField, type AuthFormState } from "@/lib/auth/validation";

function input(form: FormData) {
  const text = (key: string) => typeof form.get(key) === "string" ? String(form.get(key)) : "";
  return { email: text("email"), password: text("password"), passwordConfirm: text("passwordConfirm"), next: safeNext(text("next")) };
}
function validationState(values: ReturnType<typeof input>, issues: { path: PropertyKey[]; message: string }[]): AuthFormState {
  const fieldErrors: AuthFormState["fieldErrors"] = {};
  for (const issue of issues) {
    const field = String(issue.path[0]) as AuthField;
    if (["email", "password", "passwordConfirm"].includes(field) && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return { next: values.next, email: values.email.trim().slice(0, 254), fieldErrors, message: "입력 내용을 확인해주세요." };
}

export async function signupAction(_previous: AuthFormState, form: FormData): Promise<AuthFormState> {
  const values = input(form);
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) return validationState(values, parsed.error.issues);
  try {
    const config = authConfiguration();
    const supabase = await createAuthClient();
    const callback = new URL("/auth/callback", config.siteUrl);
    callback.searchParams.set("next", values.next);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email, password: parsed.data.password,
      options: { emailRedirectTo: callback.toString() },
    });
    if (error) return { next: values.next, email: parsed.data.email, message: authErrorMessage(error) };
    if (data.session) {
      await supabase.auth.signOut({ scope: "local" });
      return { next: values.next, email: parsed.data.email, message: "이메일 확인 설정을 점검하고 있습니다. 잠시 후 다시 시도해주세요." };
    }
  } catch (error) {
    return { next: values.next, email: parsed.data.email, message: authErrorMessage(error) };
  }
  redirect(`/auth/check-email?next=${encodeURIComponent(values.next)}`);
}

export async function loginAction(_previous: AuthFormState, form: FormData): Promise<AuthFormState> {
  const values = input(form);
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return validationState(values, parsed.error.issues);
  try {
    const { error } = await (await createAuthClient()).auth.signInWithPassword(parsed.data);
    if (error) return { next: values.next, email: parsed.data.email, message: authErrorMessage(error) };
  } catch (error) {
    return { next: values.next, email: parsed.data.email, message: authErrorMessage(error) };
  }
  revalidatePath("/", "layout");
  redirect(values.next);
}

export async function logoutAction(_previous: { message?: string }): Promise<{ message?: string }> {
  void _previous;
  try {
    const { error } = await (await createAuthClient()).auth.signOut({ scope: "local" });
    if (error) return { message: "로그아웃하지 못했습니다. 다시 시도해주세요." };
  } catch { return { message: "로그아웃하지 못했습니다. 연결 상태를 확인해주세요." }; }
  revalidatePath("/", "layout");
  redirect("/");
}
