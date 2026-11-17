"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { loginAction, signupAction } from "@/app/auth/actions";
import type { AuthField } from "@/lib/auth/validation";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next: string }) {
  const signup = mode === "signup";
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState(signup ? signupAction : loginAction, { next });
  const error = (field: AuthField) => state.fieldErrors?.[field];
  const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100";
  return (
    <form action={action} className="mt-7 space-y-5" aria-busy={pending} noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="font-semibold">이메일</label>
        <input id="email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} disabled={pending} className={inputClass} aria-invalid={Boolean(error("email"))} aria-describedby={error("email") ? "email-error" : undefined} />
        {error("email") ? <p id="email-error" className="mt-2 text-sm text-red-700">{error("email")}</p> : null}
      </div>
      <div>
        <label htmlFor="password" className="font-semibold">비밀번호</label>
        <input id="password" name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} required maxLength={64} disabled={pending} className={inputClass} aria-invalid={Boolean(error("password"))} aria-describedby={signup ? "password-hint password-error" : error("password") ? "password-error" : undefined} />
        {signup ? <p id="password-hint" className="mt-2 text-sm text-slate-600">12~64자로 입력해주세요.</p> : null}
        <p id="password-error" className="mt-2 text-sm text-red-700">{error("password")}</p>
      </div>
      {signup ? <div>
        <label htmlFor="passwordConfirm" className="font-semibold">비밀번호 확인</label>
        <input id="passwordConfirm" name="passwordConfirm" type="password" autoComplete="new-password" required maxLength={64} disabled={pending} className={inputClass} aria-invalid={Boolean(error("passwordConfirm"))} aria-describedby={error("passwordConfirm") ? "confirm-error" : undefined} />
        {error("passwordConfirm") ? <p id="confirm-error" className="mt-2 text-sm text-red-700">{error("passwordConfirm")}</p> : null}
      </div> : null}
      <div role="status" aria-live="polite">{state.message ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">{state.message}</p> : null}</div>
      <Button type="submit" disabled={pending} className="w-full">{pending ? "처리 중…" : signup ? "회원가입" : "로그인"}</Button>
      <p className="text-center text-sm text-slate-600">{signup ? "이미 계정이 있나요? " : "처음 이용하시나요? "}<Link href={`${signup ? "/login" : "/signup"}?next=${encodeURIComponent(next)}`} className="inline-block py-2 font-bold text-blue-700 underline underline-offset-4">{signup ? "로그인하기" : "회원가입하기"}</Link></p>
    </form>
  );
}
