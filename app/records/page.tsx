import { AnalyticsSignal } from "@/components/analytics/Analytics";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import RecordCard from "@/components/records/RecordCard";
import RecordPagination from "@/components/records/RecordPagination";
import DataUnavailable from "@/components/records/DataUnavailable";
import { getRecordsPage, RecordsQueryError } from "@/lib/records/data";
import { listHref, parsePage } from "@/lib/records/pagination";
import { ownRecords } from "@/lib/supabase/server";
import { recordImageUrls } from "@/lib/storage/record-images";
import { retryRecordPhotos } from "./actions";
import CleanupNotice from "@/components/records/CleanupNotice";
export const metadata: Metadata = { title: "내 기록" };
export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string | string[];
    notice?: string | string[];
  }>;
}) {
  await connection();
  const query = await searchParams;
  const context = await ownRecords(listHref(parsePage(query.page)));
  let result;
  try {
    result = await getRecordsPage(context, parsePage(query.page));
  } catch (error) {
    if (
      error instanceof RecordsQueryError
    )
      return (
        <DataUnavailable
          configuration={false}
          message={error.message}
        />
      );
    throw error;
  }
  if (query.page !== undefined && query.page !== String(result.page))
    redirect(
      listHref(result.page) +
        (query.notice === "cleanup-pending" ? "&notice=cleanup-pending" : ""),
    );
  const [urls, pending] = await Promise.all([
    recordImageUrls(context, result.records),
    context.db.from("storage_cleanup_tasks").select("image_path", { count: "exact", head: true })
      .eq("user_id", context.userId),
  ]);
  return (
    <>
      <AnalyticsSignal event="records_viewed" />
      <CleanupNotice notice={query.notice} />
      {!!pending.count && (
        <form action={retryRecordPhotos} className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <input type="hidden" name="page" value={result.page} />
          <span>정리할 이전 사진이 {pending.count}개 있습니다.</span>
          <Button variant="secondary" type="submit">사진 정리 다시 시도</Button>
        </form>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">내 기록</h1>
          <p className="mt-2 text-slate-500">
            총 {result.total}건 · 최근 등록한 기록부터 표시합니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/records/new">사진 추가</Link>
        </Button>
      </div>
      {result.records.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 px-5 py-14 text-center">
          <h2 className="text-xl font-bold">아직 등록된 기록이 없습니다.</h2>
          <p className="mt-3 text-slate-500">
            가상의 사진과 짧은 설명으로 첫 기록을 남겨보세요.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/records/new">첫 기록 작성</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {result.records.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              page={result.page}
              imageUrl={record.image_path ? urls[record.image_path] : undefined}
            />
          ))}
        </div>
      )}
      <RecordPagination page={result.page} pageCount={result.pageCount} />
    </>
  );
}
