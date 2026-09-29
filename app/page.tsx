import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import SectionJump from "@/components/SectionJump";
import Icon, { type IconName } from "@/components/Icon";
import { Card, CardContent } from "@/components/ui/card";
import { SITE } from "@/lib/site";
import logo from "@/public/logo.png";
import SolutionPreview from "@/components/landing/SolutionPreview";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problems />
        <Solution />
        <SolutionPreview />
        <ValidationNotice />
        <Audience />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/* ---------------------------------- 헤더 ---------------------------------- */

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur border-b border-navy-800">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src={logo}
            alt="블루칼라 로고"
            width={42}
            height={42}
            className="shrink-0 rounded-lg bg-white p-1"
            priority
          />
          <span className="text-white font-bold text-lg truncate">
            블루칼라 <span className="text-cobalt-400">Blue Collar</span>
          </span>
        </div>
        <CtaButton location="header" size="default" label="카톡 시작" className="shrink-0 px-3 text-sm sm:px-5 sm:text-base" />
      </div>
    </header>
  );
}

/* --------------------------------- 히어로 ---------------------------------- */

function Hero() {
  return (
    <section className="bg-navy-950 blueprint-grid text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">
        <p className="text-cobalt-400 font-bold mb-4 text-lg">
          기공을 위한 사진 기록 서비스
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.25] mb-6">
          오늘 찍은 사진이,
          <br />
          <span className="text-cobalt-400">보고가 되고 포트폴리오가 됩니다.</span>
        </h1>
        <p className="text-xl sm:text-2xl text-concrete-200 leading-relaxed mb-4 max-w-2xl">
          평소처럼 카카오톡으로 작업 사진을 보내세요. 현장·날짜별 기록으로
          정리하고, 링크 하나로 보고할 수 있습니다.
        </p>
        <p className="text-base sm:text-lg text-concrete-300 mb-10 max-w-xl">
          별도 앱 설치나 회원가입 없이 카카오톡 채널에서 무료로 시작합니다.
        </p>
        <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
          <CtaButton location="hero" className="w-full sm:w-auto" />
          <SectionJump />
        </div>
        <FlowVisual />
      </div>
    </section>
  );
}

const FLOW_STEPS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "camera",
    title: "카카오톡 사진 전송",
    desc: "채널에서 현장을 정하고 사진을 보내면",
  },
  {
    icon: "folder",
    title: "현장별·날짜별 정리",
    desc: "깔끔히 사진이 정리되고",
  },
  { icon: "link", title: "보고 링크", desc: "정리한 기록을 링크로 공유합니다" },
  { icon: "award", title: "포트폴리오", desc: "대표 사진은 직접 골라 공개합니다" },
];

function FlowVisual() {
  return (
    <div className="mt-14 w-full max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-2">
        {FLOW_STEPS.map((step, i) => (
          <div
            key={step.title}
            className="flex flex-col items-center gap-3 sm:gap-2"
          >
            <div className="w-full bg-navy-900 border border-navy-800 rounded-2xl px-4 py-5 flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
              <Icon
                name={step.icon}
                className="w-8 h-8 text-cobalt-400 shrink-0"
              />
              <div>
                <p className="font-bold text-white leading-snug">
                  {step.title}
                </p>
                <p className="text-sm text-concrete-300 mt-1">{step.desc}</p>
              </div>
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <span
                className="text-cobalt-400 text-2xl font-bold sm:hidden"
                aria-hidden
              >
                ↓
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-concrete-300">작업보고가 먼저, 보관함과 포트폴리오는 기록이 쌓인 다음에.</p>
    </div>
  );
}

/* -------------------------------- 문제 상황 -------------------------------- */

const PROBLEMS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "search",
    title: "사진 찾기",
    desc: "갤러리에서 현장 작업 사진을 찾는 것이 귀찮고 불편하신가요?",
  },
  {
    icon: "building",
    title: "현장 구분",
    desc: "여러 현장을 병행해 어느 사진이 어느 현장인지 헷갈리시나요?",
  },
  {
    icon: "pencil",
    title: "설명 반복",
    desc: "사진마다 현장과 공정 설명을 매번 적는 게 귀찮으신가요?",
  },
  {
    icon: "chat",
    title: "기록 소실",
    desc: "예전 작업 사진이 필요할 때 오랜 시간 카톡 대화방이나 문자함을 뒤적거리시나요?",
  },
  {
    icon: "folder-x",
    title: "경력 자료 부재",
    desc: "매일 사진을 찍어도 정리된 작업 포트폴리오로 남지 않는 것이 아쉬우신가요?",
  },
];

function Problems() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-black text-center leading-snug mb-12">
          이런 불편, 현장에서
          <br className="sm:hidden" /> 자주 겪지 않으시나요?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PROBLEMS.map((p) => (
            <li key={p.title}>
              <Card className="h-full bg-slate-50">
                <CardContent className="flex flex-col gap-2">
                  <Icon name={p.icon} className="w-8 h-8 text-blue-600" />
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------- 해결 방식 -------------------------------- */

const STEPS = [
  {
    no: "1",
    title: "사진 전송",
    desc: "카카오톡 채널에서 직종·지역을 알려주고, 현장을 정해 작업 사진을 보냅니다.",
  },
  {
    no: "2",
    title: "기록 정리",
    desc: "사진이 현장별·날짜별 기록으로 정리됩니다. 현장 이름과 설명은 나중에 직접 고칠 수 있습니다.",
  },
  {
    no: "3",
    title: "결과 활용",
    desc: "정리된 링크를 보고에 쓰고, 대표 작업은 직접 골라 포트폴리오에 공개할 수 있습니다.",
  },
];

function Solution() {
  return (
    <section id="how-it-works" className="bg-concrete-100 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-black text-center leading-snug mb-4">
          하던 대로 카톡으로
          <br className="sm:hidden" /> 보내면 됩니다.
        </h2>
        <p className="text-center text-lg text-concrete-500 mb-2">
          현장을 정하고 작업 사진을 카카오톡으로 보내면 됩니다.
        </p>
        <p className="text-center text-lg text-concrete-500 mb-12">
          정리된 기록을 확인한 뒤 보고 링크를 공유하세요.
        </p>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {STEPS.map((s) => (
            <li
              key={s.no}
              className="bg-white rounded-2xl p-7 border border-concrete-200 flex flex-col gap-3"
            >
              <span className="w-11 h-11 rounded-full bg-cobalt-500 text-white text-xl font-black flex items-center justify-center">
                {s.no}
              </span>
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="text-concrete-500 leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 text-center text-2xl sm:text-3xl font-black leading-snug">
          오늘 찍은 사진이, <span className="text-cobalt-600">보고가 되고</span>{" "}
          <span className="text-cobalt-600">포트폴리오가 됩니다.</span>
        </p>
      </div>
    </section>
  );
}

/* -------------------------- 실제 서비스 화면 갤러리 -------------------------- */

/* ------------------------------- 검증 단계 안내 ------------------------------ */

function ValidationNotice() {
  return (
    <section className="bg-navy-900 text-white border-t border-navy-800">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-black mb-6">
          지금은 베타로 운영 중입니다.
        </h2>
        <p className="text-lg sm:text-xl text-concrete-200 leading-relaxed">
          블루칼라는 카카오톡 사진 전송, 작업기록, 보고 링크, 보관함과
          포트폴리오가 구현된 베타 서비스입니다. 현장에서 실제 사용과 반복 사용이
          이어지는지는 앞으로 검증할 예정입니다.
        </p>
        <p className="mt-6 text-base text-concrete-300 leading-relaxed">
          카카오톡 채널에서 시작할 수 있습니다. 사용하면서 불편한 점을 알려주시면
          다음 개선에 반영하겠습니다.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- 참여 대상 -------------------------------- */

const AUDIENCE = [
  "작업 사진을 카카오톡이나 문자로 보고해본 기공",
  "여러 현장을 오가며 사진이 뒤섞인 경험이 있는 기공",
  "예전 작업 사진을 다시 찾느라 시간을 쓴 기공",
  "작업 기록이나 포트폴리오가 필요했던 기공",
];

function Audience() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-black text-center leading-snug mb-10">
          이런 분께 필요합니다.
        </h2>
        <ul className="flex flex-col gap-4">
          {AUDIENCE.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 bg-concrete-100 border border-concrete-200 rounded-2xl px-6 py-5"
            >
              <span
                className="text-cobalt-600 font-black text-xl leading-relaxed"
                aria-hidden
              >
                ✓
              </span>
              <span className="text-lg font-medium leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-concrete-500 text-sm leading-relaxed">
          철거·현장보조, 설비·배관, 전기, 목공, 철근, 형틀·거푸집, 도장, 타일,
          미장, 방수, 도배, 경량철골·석고보드·천장, 냉난방·에어컨, 금속·용접,
          창호·샷시, 조적, 콘크리트·타설 등 현장 작업 사진을 찍는 기공이라면
          누구든지 사용할 수 있습니다.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- 최종 CTA -------------------------------- */

function FinalCta() {
  return (
    <section className="bg-cobalt-600 text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-black mb-4">
          오늘 찍은 사진부터 시작해보세요.
        </h2>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-10 max-w-xl">
          카카오톡으로 사진을 보내고 정리된 작업기록을 확인하세요.
          필요할 때 링크 하나로 보고할 수 있습니다.
        </p>
        <CtaButton location="bottom" />
        <p className="mt-6 text-sm text-white/80">별도 앱 설치나 회원가입 없이 카카오톡 채널에서 무료로 시작합니다.</p>
      </div>
    </section>
  );
}

/* ---------------------------------- 푸터 ---------------------------------- */

function Footer() {
  return (
    <footer className="bg-navy-950 text-concrete-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 flex flex-col gap-2 text-sm sm:text-base">
        <p className="font-bold text-white text-lg">블루칼라 Blue Collar</p>
        <p>현장 사진을 기록, 보고, 포트폴리오로 연결합니다.</p>
        <a href={SITE.productUrl} className="w-fit text-cobalt-400 underline underline-offset-2">
          블루칼라 서비스 보기
        </a>
        {SITE.contactEmail && (
          <p>
            문의:{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-cobalt-400 underline underline-offset-2"
            >
              {SITE.contactEmail}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
