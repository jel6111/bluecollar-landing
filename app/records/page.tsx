import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "내 기록" };
export default async function RecordsPage() {
  await requireUser("/records");
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9">
      <p className="text-sm font-bold text-blue-700">회원 기능 연결</p>
      <h1 className="mt-3 text-3xl font-extrabold">로그인되었습니다</h1>
      <p className="mt-5 leading-relaxed text-slate-700">과제용 계정의 로그인 상태를 확인했습니다. 이 화면은 로그인한 사용자만 볼 수 있습니다.</p>
      <div className="mt-6 rounded-xl bg-slate-50 p-5">
        <h2 className="font-bold">내 기록 관리를 준비하고 있습니다</h2>
        <p className="mt-2 leading-relaxed text-slate-600">현재는 가입·이메일 확인·로그인·로그아웃을 구현한 2묶음입니다. 기록과 사진의 등록·조회·수정·삭제는 사용자별 권한을 연결하는 3묶음에서 열립니다.</p>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-slate-600">이 화면은 실제 블루칼라 서비스와 기존 과제의 기록을 조회하지 않습니다. 로그아웃은 위 메뉴에서 할 수 있습니다.</p>
      <Link href="/" className="mt-6 inline-block min-h-12 py-3 font-semibold text-blue-700 underline underline-offset-4">랜딩으로 돌아가기</Link>
    </section>
  );
}