import Link from "next/link";
import { DemoHeader } from "@/components/records/DemoShell";

export function AuthPage({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <>
    <DemoHeader />
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-bold text-blue-700">블루칼라 미션 7 과제 데모</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-4 leading-relaxed text-slate-600">{description}</p>
      <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">{children}</div>
      <Link href="/" className="mt-6 inline-block min-h-12 py-3 text-sm font-semibold text-slate-600 underline underline-offset-4">랜딩으로 돌아가기</Link>
    </main>
  </>;
}
