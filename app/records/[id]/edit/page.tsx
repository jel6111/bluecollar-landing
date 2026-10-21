import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import RecordForm from "@/components/records/RecordForm";
import DataUnavailable from "@/components/records/DataUnavailable";
import { Card, CardContent } from "@/components/ui/card";
import { getRecord, RecordsQueryError } from "@/lib/records/data";
import { parsePage } from "@/lib/records/pagination";
import { DemoConfigurationError } from "@/lib/supabase/config";
import { createDemoClient } from "@/lib/supabase/server";
import { recordImageUrls } from "@/lib/storage/record-images";
export const metadata: Metadata = { title: "기록 고치기" };
export default async function EditRecordPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  await connection();
  const [{ id }, query] = await Promise.all([params, searchParams]);
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
      <h1 className="text-3xl font-extrabold">기록 고치기</h1>
      <p className="mt-3 text-slate-500">
        사진과 설명을 확인하고 필요한 부분을 고쳐주세요.
      </p>
      <Card className="mt-8 max-w-2xl">
        <CardContent className="p-5 sm:p-8">
          <RecordForm
            key={record.updated_at}
            mode="edit"
            submissionId={record.id}
            version={record.updated_at}
            page={parsePage(query.page)}
            initialValues={{
              site_label: record.site_label,
              work_date: record.work_date,
              title: record.title,
              description: record.description,
            }}
            hasImage={!!record.image_path}
            existingImageUrl={
              record.image_path ? urls[record.image_path] : undefined
            }
          />
        </CardContent>
      </Card>
    </>
  );
}
