import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import Icon, { type IconName } from "@/components/Icon";
import { SITE } from "@/lib/site";
import logo from "@/public/logo.png";

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
            width={34}
            height={34}
            className="rounded-lg shrink-0"
            priority
          />
          <span className="text-white font-bold text-lg truncate">
            블루칼라 <span className="text-cobalt-400">Blue Collar</span>
          </span>
        </div>
        <CtaButton location="header" size="md" label="무료 예약" />
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
          오늘 작업 사진,
          <br />
          보내고 나면 <span className="text-cobalt-400">어디에 남나요?</span>
        </h1>
        <p className="text-xl sm:text-2xl text-concrete-200 leading-relaxed mb-4 max-w-2xl">
          현장관리자에게 전달할 작업 사진을 깔끔하고 체계적으로 정리해드립니다.
          <br className="hidden sm:block" /> 정리된 작업 기록은 나만의 시공
          포트폴리오로 안전하게 쌓아갈 수 있습니다.
        </p>
        <p className="text-base sm:text-lg text-concrete-300 mb-10 max-w-xl">
          별도 앱 설치 없이 카톡으로만 사용할 수 있습니다.
        </p>
        <CtaButton location="hero" />
        <FlowVisual />
      </div>
    </section>
  );
}

const FLOW_STEPS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "camera",
    title: "카카오톡 사진 전송",
    desc: "하던 대로 사진만 보내면",
  },
  {
    icon: "folder",
    title: "현장별·날짜별 정리",
    desc: "깔끔히 사진이 정리되고",
  },
  { icon: "link", title: "보고 링크", desc: "링크 하나로 보고 끝" },
  { icon: "award", title: "포트폴리오", desc: "작업 자료가 저절로 쌓입니다" },
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
      <p className="mt-4 text-sm text-concrete-500">
        ※ 서비스 방식을 설명하는 컨셉 이미지입니다.
      </p>
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
            <li
              key={p.title}
              className="bg-concrete-100 border border-concrete-200 rounded-2xl p-6 flex flex-col gap-2"
            >
              <Icon name={p.icon} className="w-8 h-8 text-cobalt-600" />
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="text-concrete-500 leading-relaxed">{p.desc}</p>
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
    desc: "평소 현장 담당자에게 보고하듯 작업 사진을 카톡으로 보냅니다.",
  },
  {
    no: "2",
    title: "기록 정리",
    desc: "사진이 현장별·날짜별 기록으로 정리됩니다. 현장 이름과 설명은 나중에 직접 고칠 수 있습니다.",
  },
  {
    no: "3",
    title: "결과 활용",
    desc: "정리된 링크를 보고에 쓰고, 대표 작업은 포트폴리오로 남깁니다.",
  },
];

function Solution() {
  return (
    <section className="bg-concrete-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-black text-center leading-snug mb-4">
          하던 대로 카톡으로
          <br className="sm:hidden" /> 보내면 됩니다.
        </h2>
        <p className="text-center text-lg text-concrete-500 mb-2">
          평소 문자로 보고하시던 분도 카톡으로 사진만 보내주시면 됩니다.
        </p>
        <p className="text-center text-lg text-concrete-500 mb-12">
          새로 배울 것도, 설치할 앱도 없습니다.
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

/* --------------------- 솔루션 미리보기 — ① 보고(핵심) ② 포트폴리오(덤) --------------------- */

const MOCK_PHOTOS = [
  { label: "욕실 벽타일 600각", date: "7.14", tone: "from-slate-500 to-slate-700" },
  { label: "주방 벽타일 마감", date: "7.11", tone: "from-zinc-500 to-slate-800" },
  { label: "거실 바닥 폴리싱", date: "7.8", tone: "from-slate-400 to-zinc-600" },
  { label: "현관 디딤석 시공", date: "7.3", tone: "from-gray-500 to-slate-700" },
  { label: "베란다 벽타일", date: "6.27", tone: "from-slate-600 to-zinc-800" },
  { label: "욕실 바닥 구배", date: "6.24", tone: "from-zinc-400 to-slate-600" },
];

const TODAY_PHOTOS = [
  "from-slate-500 to-slate-700",
  "from-zinc-500 to-slate-800",
  "from-slate-400 to-zinc-600",
  "from-gray-500 to-slate-700",
];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-85 bg-navy-900 border border-navy-800 rounded-[2.5rem] p-3 shadow-2xl shadow-cobalt-500/10">
      <div className="bg-white rounded-4xl overflow-hidden text-navy-950">
        {children}
      </div>
    </div>
  );
}

/** 핵심 목업 — 카톡 전송 한 번으로 보고가 끝나는 화면 */
function ReportMockup() {
  return (
    <PhoneFrame>
      {/* 카톡 채팅방 — 하던 대로 사진만 전송 */}
      <div className="bg-[#bacee0]">
        {/* 채팅방 상단 바 */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/10">
          <span className="text-navy-900 text-xl leading-none font-light" aria-hidden>
            ‹
          </span>
          <span className="font-bold text-[15px]">블루칼라</span>
          <span className="bg-[#fee500] text-navy-950 text-[10px] font-black rounded px-1.5 py-0.5">
            채널
          </span>
        </div>

        <div className="px-3 py-3 flex flex-col gap-2">
          {/* 날짜 구분선 */}
          <span className="self-center bg-black/10 text-navy-900/70 text-[10px] font-bold rounded-full px-3 py-1">
            2026년 7월 17일 금요일
          </span>

          {/* 기공: 사진 전송 */}
          <span className="self-end bg-navy-900 text-white text-[11px] font-bold rounded-full px-2.5 py-1 mt-1">
            기공은 사진만 보내면 끝
          </span>
          <div className="flex justify-end items-end gap-1.5">
            <span className="text-[10px] text-navy-900/60 font-medium shrink-0">
              오후 5:01
            </span>
            <div className="bg-[#fee500] rounded-2xl rounded-tr-sm p-1.5 shadow-sm">
              <div className="grid grid-cols-2 gap-1">
                {TODAY_PHOTOS.map((tone) => (
                  <div
                    key={tone}
                    className={`w-13 h-13 rounded-md bg-gradient-to-br ${tone} relative`}
                  >
                    <Icon
                      name="camera"
                      className="w-4 h-4 text-white/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 블루칼라: 자동 정리 답장 */}
          <span className="self-start bg-cobalt-500 text-white text-[11px] font-bold rounded-full px-2.5 py-1 mt-1">
            블루칼라가 알아서 정리
          </span>
          <div className="flex justify-start items-start gap-1.5">
            <span className="w-8 h-8 rounded-2xl bg-cobalt-500 text-white text-[11px] font-black flex items-center justify-center shrink-0">
              B
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] text-navy-900/60 font-medium">
                블루칼라
              </span>
              <div className="flex items-end gap-1.5">
                <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-[13px] leading-relaxed shadow-sm">
                  사진 4장 받았습니다 ✓
                  <br />
                  오늘의 작업 사진들 깔끔하게
                  <br />
                  정리하고 기록했어요.
                </div>
                <span className="text-[10px] text-navy-900/60 font-medium shrink-0">
                  오후 5:01
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 전환 안내 배너 */}
      <div className="bg-cobalt-500/10 text-cobalt-600 text-xs font-bold text-center py-2.5">
        방금 보낸 사진이 아래처럼 자동 정리됩니다 ↓
      </div>

      {/* 자동 정리된 오늘 기록 */}
      <div className="px-4 pt-4 pb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-black">오늘의 작업</p>
          <span className="text-xs font-bold text-concrete-500">
            7월 17일 (금)
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-concrete-100 border border-concrete-200 rounded-full px-3 py-1 text-xs font-bold text-navy-900 mb-3">
          <span className="text-concrete-500 font-medium">ex)</span>
          OO아파트 욕실
          <Icon name="pencil" className="w-3 h-3 text-concrete-500" />
        </span>
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {TODAY_PHOTOS.map((tone) => (
            <div
              key={tone}
              className={`aspect-square rounded-lg bg-gradient-to-br ${tone} relative`}
            >
              <Icon
                name="camera"
                className="w-5 h-5 text-white/25 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          ))}
        </div>
        <div className="bg-concrete-100 border border-dashed border-concrete-300 rounded-xl px-3.5 py-3 mb-3 flex items-start gap-2">
          <p className="min-w-0 flex-1 text-[13px] text-concrete-500 leading-relaxed">
            작업 내용을 간단히 적어주세요.
            <br />
            ex) 욕실 벽타일 600각 시공, 3면 완료
          </p>
          <span className="shrink-0 flex items-center gap-1 bg-white border border-concrete-200 rounded-lg px-2 py-1 text-[11px] font-bold text-cobalt-600">
            <Icon name="pencil" className="w-3 h-3" />
            수정
          </span>
        </div>
        <div className="text-xs font-bold text-cobalt-600 mb-3 flex flex-col gap-1">
          <p>✓ 소장님이 링크를 확인하면 기공님도 알 수 있어요</p>
          <p>✓ 사진에 남긴 소장님 피드백도 바로 받아볼 수 있어요</p>
        </div>
        <div className="bg-cobalt-500 text-white text-center text-sm font-bold rounded-xl py-3">
          보고 링크 보내기
        </div>
      </div>
    </PhoneFrame>
  );
}

/** 덤 목업 — 보고만 했는데 쌓여 있는 포트폴리오 */
function PortfolioMockup() {
  return (
    <PhoneFrame>
            {/* 프로필 헤더 */}
            <div className="px-5 pt-6 pb-4 border-b border-concrete-200">
              <div className="flex items-center gap-3">
                <span className="w-13 h-13 rounded-full bg-cobalt-500 text-white text-xl font-black flex items-center justify-center shrink-0">
                  김
                </span>
                <div className="min-w-0">
                  <p className="font-black text-lg leading-tight">김OO 반장</p>
                  <p className="text-sm text-concrete-500">
                    타일 · 대전 · 경력 15년
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 text-xs font-bold">
                <span className="bg-concrete-100 rounded-full px-3 py-1.5">
                  기록 사진 128장
                </span>
                <span className="bg-concrete-100 rounded-full px-3 py-1.5">
                  현장 9곳
                </span>
                <span className="bg-cobalt-500/10 text-cobalt-600 rounded-full px-3 py-1.5">
                  ✓ 촬영정보 확인
                </span>
              </div>
            </div>

            {/* 탭 */}
            <div className="flex text-center text-sm font-bold border-b border-concrete-200">
              <span className="flex-1 py-3 text-concrete-500">현장 기록</span>
              <span className="flex-1 py-3 text-cobalt-600 border-b-2 border-cobalt-500">
                대표 작업
              </span>
            </div>

            {/* 사진 그리드 (플레이스홀더) */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5">
              {MOCK_PHOTOS.map((photo) => (
                <div
                  key={photo.label}
                  className={`aspect-square rounded-lg bg-gradient-to-br ${photo.tone} relative overflow-hidden`}
                >
                  <Icon
                    name="camera"
                    className="w-7 h-7 text-white/25 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-5 pb-2">
                    <p className="text-white text-xs font-bold leading-tight">
                      {photo.label}
                    </p>
                    <p className="text-white/70 text-[10px] mt-0.5">
                      2026.{photo.date} · OO아파트
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 공유 링크 바 */}
            <div className="mx-3 mb-4 mt-1.5 flex items-center gap-2 bg-concrete-100 rounded-xl px-4 py-3">
              <Icon name="link" className="w-4 h-4 text-cobalt-600 shrink-0" />
              <span className="text-sm font-bold text-navy-900 truncate">
                bluecollar.kr/@kim-tile
              </span>
              <span className="ml-auto bg-cobalt-500 text-white text-xs font-bold rounded-lg px-3 py-1.5 shrink-0">
                공유
              </span>
            </div>
    </PhoneFrame>
  );
}

function SolutionPreview() {
  return (
    <section className="bg-navy-950 blueprint-grid text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-black text-center leading-snug mb-4">
          보고는 쉬워지고,
          <br className="sm:hidden" /> 기록은 저절로 쌓입니다.
        </h2>
        <p className="text-center text-lg text-concrete-300 mb-12 max-w-xl">
          사진 한 번의 전송으로 두 가지가 함께 해결됩니다.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 w-full justify-items-center items-start">
          <div className="flex flex-col items-center w-full">
            <span className="bg-cobalt-500 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              핵심 ① 매일의 보고
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-center leading-snug mb-6">
              사진 찾고, 설명 쓰고,
              <br />
              되묻는 일이 줄어듭니다
            </h3>
            <ReportMockup />
          </div>

          <div className="flex flex-col items-center w-full">
            <span className="bg-navy-800 text-cobalt-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              덤 ② 경력 자료
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-center leading-snug mb-6">
              보고만 했는데
              <br />
              포트폴리오가 쌓입니다
            </h3>
            <PortfolioMockup />
          </div>
        </div>

        <p className="mt-10 text-sm text-concrete-500 text-center">
          ※ 이해를 돕기 위한 컨셉 화면입니다. 실제 서비스 화면과 다를 수
          있습니다.
        </p>
        <div className="mt-8">
          <CtaButton location="middle" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- 검증 단계 안내 ------------------------------ */

function ValidationNotice() {
  return (
    <section className="bg-navy-900 text-white border-t border-navy-800">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-black mb-6">
          아직 정식 출시 전입니다.
        </h2>
        <p className="text-lg sm:text-xl text-concrete-200 leading-relaxed">
          블루칼라는 작업 사진을 자주 전송하는 기공분들이 이 솔루션을 실제로
          편하게 사용할지 검증하고 있습니다. 이번 예약 설문은 현장의 실제
          불편과 사용 가능성을 확인하기 위한 조사입니다.
        </p>
        <p className="mt-6 text-base text-concrete-300 leading-relaxed">
          지금 예약하시면 솔루션이 준비되는 대로 무료로 체험하실 수 있는 링크를
          보내드립니다.
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
          이런 분의 경험을
          <br className="sm:hidden" /> 듣고 싶습니다.
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
          1분이면 예약할 수 있습니다.
        </h2>
        <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-10 max-w-xl">
          현장에서 실제로 겪은 경험을 알려주시고 연락처를 남겨주세요. 서비스가
          준비되는 대로 카카오톡으로 무료 체험 링크를 보내드립니다.
        </p>
        <CtaButton location="bottom" />
        <p className="mt-6 text-sm text-white/80 leading-relaxed">
          연락처 입력은 선택 사항이며, 무료 체험 링크 전송 목적으로만
          사용됩니다.
        </p>
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
        <p>
          연락처 입력은 선택 사항이며, 무료 체험 링크 전송 목적으로만
          사용됩니다. 수집된 정보는 전송 후 폐기됩니다.
        </p>
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
