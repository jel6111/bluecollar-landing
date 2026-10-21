import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WorkRecord } from "@/lib/supabase/database.types";
import { registeredDay } from "@/lib/records/dates";
import RecordImage from "./RecordImage";

export default function RecordCard({ record, page, imageUrl }: {
  record: WorkRecord; page: number; imageUrl?: string;
}) {
  return (
    <Card className="h-full transition-colors hover:border-blue-400">
      <Link href={`/records/${record.id}?page=${page}`} className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        <CardContent className="flex gap-4 p-4 sm:p-5">
          <div className="w-24 shrink-0 sm:w-28">
            <RecordImage compact src={imageUrl} hasImage={!!record.image_path} alt={`${record.site_label} 작업 사진`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="break-words text-sm font-bold text-blue-700">{record.site_label}</p>
            <h2 className="mt-1 break-words text-lg font-bold leading-snug">{record.title}</h2>
            <p className="mt-2 line-clamp-2 break-words text-sm leading-relaxed text-slate-600">{record.description || "설명 없이 남긴 기록입니다."}</p>
            <p className="mt-3 text-xs text-slate-500">등록일 <time dateTime={record.created_at}>{registeredDay(record.created_at)}</time></p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-blue-700">기록 열기 <ArrowRight size={15} aria-hidden /></span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
