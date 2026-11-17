import type { Metadata } from "next";
import Link from "next/link";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "이메일 확인 안내" };
export default function AuthError() {
  return <AuthPage title="확인 링크를 처리하지 못했습니다" description="링크가 만료되었거나 이미 사용되었을 수 있습니다.">
    <p className="leading-relaxed text-slate-700">가입을 진행한 브라우저에서 최신 확인 링크를 다시 열어주세요. 이미 확인했다면 로그인해주세요. 문제가 계속되면 과제 담당자에게 문의해주세요.</p>
    <Link href="/login" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-blue-600 px-6 font-bold text-white">로그인으로 이동</Link>
  </AuthPage>;
}
