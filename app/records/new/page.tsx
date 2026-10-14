import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import { connection } from "next/server";
import RecordForm from "@/components/records/RecordForm";
import { Card, CardContent } from "@/components/ui/card";
export const metadata: Metadata = { title: "새 작업기록" };
export default async function NewRecordPage() {
  await connection();
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (name: string) =>
    parts.find((p) => p.type === name)?.value ?? "";
  const date = `${part("year")}-${part("month")}-${part("day")}`;
  return (
    <>
      <h1 className="text-3xl font-black">새 작업기록</h1>
      <p className="mt-3 text-slate-500">
        가상의 현장과 작업 내용을 입력해주세요.
      </p>
      <Card className="mt-8 max-w-2xl">
        <CardContent className="p-5 sm:p-8">
          <RecordForm submissionId={randomUUID()} defaultWorkDate={date} />
        </CardContent>
      </Card>
    </>
  );
}
