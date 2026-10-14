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
      <Card>
        <CardContent className="p-5 sm:p-8">
          <p className="break-words font-bold text-blue-600">{record.site_label}</p>
          <h1 className="mt-3 break-words text-3xl font-black leading-tight">
            {record.title}
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            작업일 <time dateTime={record.work_date}>{record.work_date}</time>
          </p>
          <div className="mt-8 rounded-xl bg-slate-50 p-6">
            <h2 className="font-bold">작업 설명</h2>
            <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-slate-700">
              {record.description || "등록된 설명이 없습니다."}
            </p>
          </div>
          <RecordImage
            src={record.image_path ? urls[record.image_path] : undefined}
            hasImage={!!record.image_path}
            alt={`${record.site_label} 작업 사진`}
          />
          <dl className="mt-6 text-xs text-slate-500">
            <div className="flex flex-wrap gap-2">
              <dt>등록 시각</dt>
              <dd>
                {new Intl.DateTimeFormat("ko-KR", {
                  timeZone: "Asia/Seoul",
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(record.created_at))}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-slate-500">
            최종 수정{" "}
            <time dateTime={record.updated_at}>
              {new Intl.DateTimeFormat("ko-KR", {
                timeZone: "Asia/Seoul",
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(record.updated_at))}
            </time>
          </p>
        </CardContent>
      </Card>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/records/${record.id}/edit?page=${page}`}>
            기록 수정
          </Link>
        </Button>
        <DeleteRecordDialog
          id={record.id}
          title={record.title}
          version={record.updated_at}
          page={page}
        />
        <Button asChild variant="secondary">
          <Link href={listHref(page)}>목록으로 돌아가기</Link>
        </Button>
        <Button asChild>
          <Link href="/records/new">새 기록 작성</Link>
        </Button>
      </div>
    </>
  );
}
