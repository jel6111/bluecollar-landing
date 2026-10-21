import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function RecordNotFound() {
  return (
    <div className="rounded-2xl border border-slate-200 p-7 text-center">
      <h1 className="text-2xl font-bold">작업기록을 찾을 수 없습니다.</h1>
      <p className="mt-3 text-slate-500">
        주소를 확인하거나 목록에서 기록을 다시 선택해주세요.
      </p>
      <Button asChild className="mt-6">
        <Link href="/records">기록 목록으로</Link>
      </Button>
    </div>
  );
}
