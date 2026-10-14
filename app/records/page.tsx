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
import { DemoConfigurationError } from "@/lib/supabase/config";
import { createDemoClient } from "@/lib/supabase/server";
import { recordImageUrls } from "@/lib/storage/record-images";
import CleanupNotice from "@/components/records/CleanupNotice";
export const metadata: Metadata = { title: "작업기록 목록" };
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
  let result;
  try {
    result = await getRecordsPage(parsePage(query.page));
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
  if (query.page !== undefined && query.page !== String(result.page))
    redirect(
      listHref(result.page) +
        (query.notice === "cleanup-pending" ? "&notice=cleanup-pending" : ""),
    );
  const urls = await recordImageUrls(createDemoClient(), result.records);
  return (
    <>
      <CleanupNotice notice={query.notice} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">작업기록</h1>
          <p className="mt-2 text-slate-500">
            총 {result.total}건 · 최신 기록부터 표시합니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/records/new">새 기록 작성</Link>
        </Button>
      </div>
      {result.records.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 px-5 py-14 text-center">
          <h2 className="text-xl font-bold">아직 등록된 기록이 없습니다.</h2>
          <p className="mt-3 text-slate-500">
            가상의 작업을 한 건 작성해보세요.
          </p>
          <Button asChild className="mt-6">
            <Link href="/records/new">첫 기록 작성</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
