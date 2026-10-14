import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WorkRecord } from "@/lib/supabase/database.types";
export default function RecordCard({
  record,
  page,
}: {
  record: WorkRecord;
  page: number;
}) {
  return (
    <Card className="h-full transition-colors hover:border-blue-400">
      <Link
        href={`/records/${record.id}?page=${page}`}
        className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        <CardContent>
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <ClipboardList size={22} aria-hidden />
            </span>
            <time
              dateTime={record.work_date}
              className="text-sm text-slate-500"
            >
              {record.work_date}
            </time>
          </div>
          <p className="mt-5 text-sm font-bold text-blue-600">
            {record.site_label}
          </p>
          <h2 className="mt-2 break-words text-xl font-bold">{record.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {record.description || "등록된 설명이 없습니다."}
          </p>
          <span className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600">
            상세 보기 <ArrowRight size={16} aria-hidden />
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}
