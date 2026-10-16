import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataUnavailable from "@/components/records/DataUnavailable";
import { getRecord, RecordsQueryError } from "@/lib/records/data";
import { parsePage, listHref } from "@/lib/records/pagination";
import { DemoConfigurationError } from "@/lib/supabase/config";
import { createDemoClient } from "@/lib/supabase/server";
import { recordImageUrls } from "@/lib/storage/record-images";
import RecordImage from "@/components/records/RecordImage";
import DeleteRecordDialog from "@/components/records/DeleteRecordDialog";
import { registeredDay, registeredTime } from "@/lib/records/dates";
import CleanupNotice from "@/components/records/CleanupNotice";
export const metadata: Metadata = { title: "작업기록 상세" };
export default async function RecordDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string | string[];
    notice?: string | string[];
  }>;
}) {
  await connection();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const page = parsePage(query.page);
  let record;
  try {
    record = await getRecord(id);
  } catch (error) {
    if (
      error instanceof DemoConfigurationError ||
      error instanceof RecordsQueryError
    )
      return (
        <DataUnavailable
          configuration={error instanceof DemoConfigurationError}
          message={error.message}
        />
      );
    throw error;
  }
  if (!record) notFound();
  const urls = await recordImageUrls(createDemoClient(), [record]);
  return (
    <>
      <CleanupNotice notice={query.notice} />
      <Link
        href={listHref(page)}
        className="mb-6 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-bold text-slate-600"
      >
        <ArrowLeft size={16} aria-hidden /> 목록으로
      </Link>
      <div className="max-w-2xl">
        <Card>
          <CardContent className="p-5 sm:p-8">
            <p className="break-words text-sm font-bold text-blue-700">{record.site_label}</p>
            <h1 className="mt-2 break-words text-2xl font-extrabold leading-tight">{record.title}</h1>
            <p className="mt-3 text-sm text-slate-600">기록 등록일 <time dateTime={record.created_at}>{registeredDay(record.created_at)}</time></p>
            <RecordImage src={record.image_path ? urls[record.image_path] : undefined} hasImage={!!record.image_path} alt={`${record.site_label} 작업 사진`} />
            <div className="mt-6">
              <h2 className="font-bold">사진 설명</h2>
              <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-slate-700">{record.description || "설명 없이 남긴 기록입니다. 고치기에서 짧은 설명을 붙여보세요."}</p>
            </div>
            <dl className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <div><dt className="font-semibold">직접 선택한 기록 날짜</dt><dd className="mt-1"><time dateTime={record.work_date}>{record.work_date}</time></dd></div>
              <div><dt className="font-semibold">등록 시각</dt><dd className="mt-1"><time dateTime={record.created_at}>{registeredTime(record.created_at)}</time></dd></div>
              <div><dt className="font-semibold">최종 수정</dt><dd className="mt-1"><time dateTime={record.updated_at}>{registeredTime(record.updated_at)}</time></dd></div>
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">기록 날짜는 직접 선택한 참고 정보입니다. 사진의 촬영일이나 실제 일한 날을 확인한 정보는 아닙니다.</p>
          </CardContent>
        </Card>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild><Link href={`/records/${record.id}/edit?page=${page}`}>고치기</Link></Button>
          <DeleteRecordDialog id={record.id} title={record.title} version={record.updated_at} page={page} />
          <Button asChild variant="secondary"><Link href={listHref(page)}>목록으로 돌아가기</Link></Button>
        </div>
      </div>
    </>
  );
}
