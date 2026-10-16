import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, FolderOpen, Link2, MessageCircle, Search, Layers, Images, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DemoNotice } from "@/components/records/DemoShell";

export function LandingHero() {
  return (
    <section className="overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <p className="mb-5 text-sm font-bold text-blue-700">현장 기공을 위한 사진 기록 서비스</p>
          <h1 className="text-[2.5rem] font-extrabold leading-[1.18] tracking-[-0.04em] sm:text-5xl">
            현장 사진,<br /><span className="text-blue-600">기록으로 남기세요.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
            카톡으로 보낸 사진에 짧은 설명을 붙여<br className="hidden sm:block" />현장별로 찾고, 소장님·반장님께 전달하세요.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">블루칼라의 서비스 흐름을 소개하고, 아래 과제용 웹 화면에서 사진 기록을 직접 체험합니다.</p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg"><Link href="/records">사진 기록 체험하기 <ArrowRight size={19} aria-hidden /></Link></Button>
            <Link href="#service-flow" className="inline-flex min-h-12 items-center justify-center rounded-xl px-4 font-bold text-slate-700 underline underline-offset-4">사용 흐름 보기</Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">미션 6 과제 데모 · 가상 자료로 체험</p>
        </div>
        <figure className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-6">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <span className="text-sm font-bold">블루칼라 <span className="ml-2 font-normal text-slate-500">기록 관리</span></span>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">가상 예시</span>
            </div>
            <p className="mt-5 text-xl font-extrabold">A현장 욕실</p>
            <div className="mt-4 flex items-start gap-4">
              <Image src="/demo-room.svg" width={120} height={160} alt="타일 벽과 바닥을 그린 과제용 예시 그림" className="w-28 shrink-0 rounded-xl border border-slate-200 sm:w-32" />
              <div className="min-w-0 pt-2">
                <p className="text-sm font-bold text-blue-700">사진에 짧은 설명을 붙이면</p>
                <p className="mt-3 leading-relaxed text-slate-700">욕실 벽타일 점검.<br />마감 확인 부탁드립니다.</p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><PencilLine size={14} aria-hidden />설명 고치기</span>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900">사진과 설명을 함께 남겨<br />어떤 작업이었는지 다시 확인할 수 있습니다.</div>
          </div>
          <figcaption className="mt-3 text-center text-xs text-slate-500">서비스 흐름을 설명하는 가상 화면입니다.</figcaption>
        </figure>
      </div>
    </section>
  );
}
const problems = [
  { icon: Search, title: "사진을 다시 찾기 어렵나요?", description: "여러 현장 사진이 채팅방과 갤러리에 섞이면 필요한 사진을 찾기 위해 다시 훑어봐야 합니다." },
  { icon: MessageCircle, title: "어떤 작업인지 다시 설명하나요?", description: "사진만 전달하면 작업 내용과 확인할 부분을 따로 설명하게 됩니다." },
  { icon: Layers, title: "지난 작업을 보여주고 싶나요?", description: "다음 일을 소개할 때 활용할 사진을 미리 모아두면 작업 이력을 꺼내볼 수 있습니다." },
];
export function LandingProblem() {
  return (
    <section className="border-y border-slate-100 bg-slate-50 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold text-blue-700">현장에서 익숙한 불편</p>
        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">찍어둔 사진, 필요한 순간에 찾을 수 있도록.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {problems.map(({ icon: Icon, title, description }) => (
            <Card key={title}><CardContent><Icon size={26} className="text-blue-600" aria-hidden /><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p></CardContent></Card>
          ))}
        </div>
      </div>
    </section>
  );
}
const flow = [
  { icon: MessageCircle, title: "카톡으로 사진 보내기", text: "익숙한 카카오톡에서 작업 사진을 보냅니다. 블루칼라의 실제 서비스 입력 방식입니다." },
  { icon: Camera, title: "현장별 기록 관리", text: "사진을 받은 날과 현장별로 모으고, 필요한 사진에 짧은 설명을 붙입니다. 웹에서도 사진을 추가할 수 있습니다." },
  { icon: Link2, title: "보고 링크로 전달", text: "소장님·반장님이 사진과 설명을 함께 볼 수 있는 링크로 전달합니다. PDF로 저장하는 흐름도 제공합니다." },
  { icon: FolderOpen, title: "보관함에서 다시 활용", text: "지난 기록을 다시 찾고, 직접 고른 사진으로 포트폴리오를 구성합니다." },
];
export function ProductFlow() {
  return (
    <section id="service-flow" className="px-4 py-14 sm:px-6 sm:py-20" aria-labelledby="service-flow-title">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold text-blue-700">블루칼라 서비스 사용 흐름</p>
        <h2 id="service-flow-title" className="mt-3 text-2xl font-extrabold sm:text-3xl">사진 한 장에서, 다시 꺼내보는 작업 기록까지.</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="rounded-xl border border-slate-200 p-5"><div className="flex items-center justify-between"><Icon size={26} className="text-blue-600" aria-hidden /><span className="text-sm font-bold text-slate-500">0{index + 1}</span></div><h3 className="mt-5 font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p></li>
          ))}
        </ol>
        <p className="mt-5 text-sm leading-relaxed text-slate-600">위 흐름은 제공된 제품 자료를 기준으로 소개합니다. 이 과제에서 직접 체험하는 기능은 웹 사진 기록의 등록·조회·수정·삭제입니다.</p>
      </div>
    </section>
  );
}
const demoTasks = [
  { icon: Images, text: "사진 한 장과 설명 저장하기" },
  { icon: FolderOpen, text: "목록에서 기록 열고 다시 확인하기" },
  { icon: PencilLine, text: "설명 고치고 사진 교체하기" },
  { icon: Trash2, text: "확인 후 필요 없는 기록 삭제하기" },
];
export function DemoInvitation() {
  return (
    <section className="bg-blue-50 px-4 py-14 sm:px-6 sm:py-20" aria-labelledby="demo-title">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold text-blue-700">미션 6 · 사진 기록 체험</p>
            <h2 id="demo-title" className="mt-3 text-2xl font-extrabold sm:text-3xl">가상의 현장으로<br />첫 기록을 남겨보세요.</h2>
            <p className="mt-5 leading-relaxed text-slate-700">사진을 추가하고, 현장 이름과 짧은 설명을 적어보세요. 저장한 기록은 새로고침 후에도 다시 열어 고치거나 삭제할 수 있습니다.</p>
            <Button asChild size="lg" className="mt-7"><Link href="/records/new">사진 추가하기 <ArrowRight size={19} aria-hidden /></Link></Button>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-7">
            <h3 className="font-bold">이 데모에서 해볼 수 있는 일</h3>
            <ul className="mt-5 space-y-4 text-slate-700">{demoTasks.map(({ icon: Icon, text }) => <li key={text} className="flex items-center gap-3"><Icon size={20} className="shrink-0 text-blue-600" aria-hidden /><span>{text}</span></li>)}</ul>
            <div className="mt-6"><DemoNotice /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
