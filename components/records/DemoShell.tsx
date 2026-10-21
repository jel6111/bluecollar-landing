import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

export function DemoHeader() {
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
              미션 6 과제 데모
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
            기록 관리
          </Link>
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
        과제용 공용 공간입니다. 실제 이름·주소·연락처를 입력하지 마세요. 등록한
        데모 기록은 다른 방문자도 조회·수정·삭제할 수 있습니다.
      </p>
    </aside>
  );
}
