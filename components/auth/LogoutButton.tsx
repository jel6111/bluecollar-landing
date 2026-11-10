"use client";
import { useActionState } from "react";
import { logoutAction } from "@/app/auth/actions";

export function LogoutButton() {
  const [state, action, pending] = useActionState(logoutAction, {});
  return <form action={action}>
    <button type="submit" disabled={pending} className="min-h-12 rounded-lg px-2 py-3 text-sm font-bold text-slate-600 hover:text-blue-600 disabled:opacity-50">{pending ? "로그아웃 중…" : "로그아웃"}</button>
    {state.message ? <p role="alert" className="max-w-48 text-xs text-red-700">{state.message}</p> : null}
  </form>;
}
