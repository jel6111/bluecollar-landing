import type { Metadata } from "next";
import Link from "next/link";
import { AuthPage } from "@/components/auth/AuthPage";
import { safeNext } from "@/lib/auth/redirect";

export const metadata: Metadata = { title: "이메일 확인 안내" };
export default async function CheckEmail({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  return <AuthPage title="이메일을 확인해주세요" description="가입한 주소의 받은 편지함과 스팸함을 확인해주세요.">
    <p className="leading-relaxed text-slate-700">가입 요청이 처리되면 이메일의 확인 링크를 열어주세요. 확인 후 로그인할 수 있습니다. 같은 이메일로 이미 가입한 경우에는 로그인 화면을 이용해주세요.</p>
    <p className="mt-4 text-sm leading-relaxed text-slate-600">이메일이 오지 않으면 잠시 기다린 뒤 주소와 발송 상태를 확인해주세요. 확인 링크는 가입하던 브라우저에서 열어주세요.</p>
    <Link href={`/login?next=${encodeURIComponent(next)}`} className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-blue-600 px-6 font-bold text-white">로그인으로 이동</Link>
  </AuthPage>;
}
