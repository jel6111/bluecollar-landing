import Link from "next/link";
import { ClipboardList, FilePlus2, ArrowRight, PencilLine } from "lucide-react";
import { DemoHeader, DemoNotice } from "@/components/records/DemoShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: FilePlus2,
    title: "오늘의 작업을 기록하세요",
    description: "현장 별칭, 작업일과 설명을 적고 사진을 함께 저장합니다.",
  },
  {
    icon: ClipboardList,
    title: "목록에서 다시 찾으세요",
    description: "저장한 기록을 목록과 상세 화면에서 확인합니다.",
  },
  {
    icon: PencilLine,
    title: "필요할 때 고치고 정리하세요",
    description: "내용과 사진을 수정하고, 필요 없는 기록은 확인 후 삭제합니다.",
  },
];

export default function Home() {
  return (
    <>
      <DemoHeader />
      <main>
        <section className="blueprint-grid bg-navy-950 px-4 py-16 text-white sm:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="mb-5 text-sm font-bold tracking-wide text-cobalt-400">
              블루칼라 · 미션 6 과제 데모
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              오늘의 작업을
              <br />
              <span className="text-cobalt-400">찾을 수 있는 기록으로.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-concrete-200">
              가상의 현장 작업을 사진과 함께 등록하고, 다시 찾아 수정하거나
              정리해보세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/records">
                  작업기록 체험하기 <ArrowRight size={20} aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/records/new">새 기록 작성</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <DemoNotice />
          <h2 className="mt-12 mb-6 text-2xl font-bold">
            기록을 남기고 다시 확인하는 흐름
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardContent>
                  <Icon className="mb-4 text-blue-600" size={28} aria-hidden />
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t px-4 py-7 text-center text-sm text-slate-500">
        블루칼라 미션 6 · 과제용 공용 데모
      </footer>
    </>
  );
}
