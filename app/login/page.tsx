import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth/AuthPage";
import { AuthForm } from "@/components/auth/AuthForm";
import { currentUser } from "@/lib/auth/session";
import { isAuthConfigured } from "@/lib/auth/environment";
import { safeNext } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "로그인" };
export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string; reason?: string }> }) {
  const query = await searchParams;
  const next = safeNext(query.next);
  if (await currentUser()) redirect(next);
  return <AuthPage title="로그인" description="과제용 계정으로 로그인하고 내 기록 화면으로 이동하세요.">
    {!isAuthConfigured() ? <p role="status" className="rounded-xl bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">새 과제용 Supabase를 연결하고 있습니다. 연결이 완료되면 회원 기능을 사용할 수 있습니다.</p> : null}
    {query.reason === "session" ? <p role="status" className="text-sm text-slate-700">로그인 상태를 다시 확인해주세요.</p> : null}
    <AuthForm mode="login" next={next} />
  </AuthPage>;
}
