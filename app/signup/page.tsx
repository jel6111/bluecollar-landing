import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth/AuthPage";
import { AuthForm } from "@/components/auth/AuthForm";
import { currentUser } from "@/lib/auth/session";
import { isAuthConfigured } from "@/lib/auth/environment";
import { safeNext } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "회원가입" };
export default async function Signup({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await currentUser()) redirect(next);
  return <AuthPage title="회원가입" description="직접 확인할 수 있는 이메일로 가입해주세요. 실제 서비스와 분리된 과제 계정입니다.">
    {!isAuthConfigured() ? <p role="status" className="rounded-xl bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">새 과제용 Supabase를 연결하고 있습니다. 아직 확인 이메일을 발송하지 않습니다.</p> : null}
    <AuthForm mode="signup" next={next} />
  </AuthPage>;
}
