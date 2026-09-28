import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import Icon from "@/components/Icon";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_PHOTOS = [
  { label: "타일 시공 기록", src: "/pf-1.jpg" },
  { label: "현장 작업 사진", src: "/pf-2.jpg" },
  { label: "마감 작업 기록", src: "/pf-3.jpg" },
  { label: "현장 작업 사진", src: "/pf-4.jpg" },
  { label: "시공 과정 기록", src: "/pf-5.jpg" },
  { label: "완료 사진", src: "/pf-6.jpg" },
];

const TODAY_PHOTOS = [
  { src: "/site-1.jpg", alt: "욕실 벽면 타일 현장 사진" },
  { src: "/site-2.jpg", alt: "욕실 타일 시공 현장 사진" },
  { src: "/site-3.jpg", alt: "욕실 바닥 타일 현장 사진" },
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
                {TODAY_PHOTOS.map((photo) => (
                  <div key={photo.src} className="w-13 h-13 rounded-md relative overflow-hidden">
                    <Image src={photo.src} alt={photo.alt} fill sizes="52px" className="object-cover" />
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
          {TODAY_PHOTOS.map((photo) => (
            <div key={photo.src} className="aspect-square rounded-lg relative overflow-hidden">
              <Image src={photo.src} alt={photo.alt} fill sizes="72px" className="object-cover" />
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
                  현장별 기록
                </span>
                <span className="bg-concrete-100 rounded-full px-3 py-1.5">
                  대표 작업
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
                <div key={photo.src} className="aspect-square rounded-lg relative overflow-hidden">
                  <Image src={photo.src} alt={photo.label} fill sizes="150px" className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-5 pb-2">
                    <p className="text-white text-xs font-bold leading-tight">
                      {photo.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 공유 링크 바 */}
            <div className="mx-3 mb-4 mt-1.5 flex items-center gap-2 bg-concrete-100 rounded-xl px-4 py-3">
              <Icon name="link" className="w-4 h-4 text-cobalt-600 shrink-0" />
              <span className="text-sm font-bold text-navy-900 truncate">
                parancollar.com/@example
              </span>
              <span className="ml-auto bg-cobalt-500 text-white text-xs font-bold rounded-lg px-3 py-1.5 shrink-0">
                공유
              </span>
            </div>
    </PhoneFrame>
  );
}

/** 미션 4 Hi-Fi의 세 번째 화면: 수신자는 가입 없이 기록을 확인한다. */
function ReceiverPreview() {
  return (
    <Card className="mt-12 w-full max-w-3xl overflow-hidden text-navy-950">
      <div className="h-1 bg-blue-600" />
      <CardContent className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src="/site-1.jpg"
            alt="욕실 벽면 타일 시공 사진 예시"
            fill
            sizes="(max-width: 640px) 100vw, 180px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-blue-600">받는 사람의 화면</p>
          <h3 className="mt-2 text-2xl font-black">링크를 열면 바로 보입니다.</h3>
          <p className="mt-3 text-slate-600 leading-relaxed">
            현장명·날짜·작업 사진과 설명을 한곳에서 확인하고, 사진마다 한마디를 남길 수 있습니다.
          </p>
          <p className="mt-4 text-sm font-bold text-blue-600">소장·거래처는 로그인 없이 열람</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SolutionPreview() {
  return (
    <section className="bg-navy-950 blueprint-grid text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-black text-center leading-snug mb-4">
          보고는 쉬워지고,
          <br className="sm:hidden" /> 기록은 저절로 쌓입니다.
        </h2>
        <p className="text-center text-lg text-concrete-300 mb-12 max-w-xl">
          작업자의 기록부터 소장·거래처의 열람까지 한 흐름으로 이어집니다.
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
              기록이 쌓인 뒤 ② 경력 자료
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-center leading-snug mb-6">
              보고만 했는데
              <br />
              포트폴리오가 쌓입니다
            </h3>
            <PortfolioMockup />
          </div>
        </div>

        <ReceiverPreview />
        <p className="mt-10 text-sm text-concrete-500 text-center">
          ※ 기능 설명을 위한 예시 화면입니다. 현장 사진은 블루칼라 제품의 시연 자료를 사용했습니다.
        </p>
        <div className="mt-8">
          <CtaButton location="preview" />
        </div>
      </div>
    </section>
  );
}

