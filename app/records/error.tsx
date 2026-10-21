"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border bg-white p-6">
      <h1 className="text-2xl font-bold">
        기록을 불러오는 중 문제가 생겼습니다.
      </h1>
      <p className="mt-3 text-slate-500">잠시 후 다시 시도해주세요.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>다시 시도</Button>
        <Button asChild variant="secondary">
          <Link href="/records">목록으로</Link>
        </Button>
      </div>
    </div>
  );
}
