import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { currentUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";

export async function DemoHeader() {
  const user = await currentUser();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-20 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-bold">
          <Image
            src={logo}
            width={36}
            height={36}
            alt=""
            className="shrink-0"
          />
          <span className="leading-tight">
            블루칼라
            <span className="block text-xs font-medium text-slate-500">
              미션 7 과제 데모
            </span>
          </span>
        </Link>
        <nav
          aria-label="주요 메뉴"
          className="flex shrink-0 items-center gap-2"
        >
          <Link
            href="/records"
            className="rounded-lg px-2 py-3 text-sm font-bold text-slate-600 hover:text-blue-600"
          >
            내 기록
          </Link>
          {user ? <LogoutButton /> : <Link href="/login" className="min-h-12 rounded-lg px-2 py-3 text-sm font-bold text-blue-700">로그인</Link>}
        </nav>
      </div>
    </header>
  );
}

export function DemoNotice() {
  return (
    <aside className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm leading-relaxed text-blue-900">
      <p className="font-bold">가상의 작업만 기록해주세요.</p>
      <p className="mt-1">
        실제 서비스와 분리된 회원 기능 과제입니다. 실제 현장·연락처·고객 자료를 입력하지 마세요. 기록 관리는 사용자별 권한을 연결하는 다음 묶음에서 준비합니다.
      </p>
    </aside>
  );
}
