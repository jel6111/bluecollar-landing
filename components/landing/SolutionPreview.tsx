"use client";

import { useState } from "react";
import Image from "next/image";
import CtaButton from "@/components/CtaButton";

const SCREENS = [
  {
    label: "카카오톡 시작",
    title: "카카오톡 채널에서 시작합니다",
    description:
      "처음에는 직종과 지역을 알려주고, 채널의 ‘사진 추가’ 안내에 따라 작업 사진을 보냅니다.",
    src: "/product-chat.jpg",
    width: 582,
    height: 1173,
    alt: "블루칼라 카카오톡 채널에서 직종과 지역을 입력하고 사진 추가를 안내받는 화면",
  },
  {
    label: "작업기록",
    title: "사진을 현장 기록으로 정리합니다",
    description:
      "현장 이름과 사진별 설명을 확인하고 고칠 수 있습니다. 보내기 전에 받는 분의 화면도 미리 볼 수 있습니다.",
    src: "/product-record-mobile.jpg",
    width: 1080,
    height: 2340,
    alt: "현장 이름, 작업 사진, 설명 입력과 받는 분 화면 미리보기가 보이는 모바일 작업기록 화면",
  },
  {
    label: "큰 화면 기록",
    title: "큰 화면에서도 기록을 다듬습니다",
    description:
      "사진별 작업 설명을 수정하고, 받는 분에게 보낼 기록을 미리 확인할 수 있습니다.",
    src: "/product-record-desktop.jpg",
    width: 767,
    height: 1318,
    alt: "사진별 설명 수정과 받는 분 화면 미리보기가 보이는 블루칼라 작업기록 화면",
  },
  {
    label: "보고 링크",
    title: "정리된 기록을 링크로 공유합니다",
    description:
      "받는 분은 현장명과 날짜, 사진, 설명을 링크에서 확인합니다. 보낸 사람은 링크 열람 횟수와 사진에 남긴 피드백을 확인할 수 있습니다.",
    src: "/product-report.jpg",
    width: 1080,
    height: 2340,
    alt: "현장명, 작업 날짜와 사진별 설명이 담긴 블루칼라 보고 링크 화면",
  },
  {
    label: "보관함",
    title: "지난 사진을 보관함에서 다시 찾습니다",
    description:
      "날짜와 현장별로 묶인 사진을 확인하고, 필요한 사진을 다시 열거나 내려받을 수 있습니다.",
    src: "/product-archive.jpg",
    width: 1080,
    height: 2340,
    alt: "날짜와 현장별 작업 사진이 정리된 블루칼라 보관함 화면",
  },
  {
    label: "포트폴리오",
    title: "대표 작업을 골라 보여줄 수 있습니다",
    description:
      "기록에서 사진을 선택해 자신의 작업을 소개하는 포트폴리오를 구성할 수 있습니다.",
    src: "/product-portfolio.jpg",
    width: 1080,
    height: 2340,
    alt: "대표 작업 사진을 추가하고 소개를 고칠 수 있는 블루칼라 포트폴리오 화면",
  },
] as const;

export default function SolutionPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScreen = SCREENS[activeIndex];

  return (
    <section className="bg-navy-950 blueprint-grid text-white" aria-labelledby="product-screens-heading">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-bold text-cobalt-400">블루칼라 실제 서비스 화면</p>
          <h2 id="product-screens-heading" className="text-3xl font-black leading-snug sm:text-4xl">
            사진 한 장부터 보고와 보관까지
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-concrete-300">
            카카오톡에서 시작해 작업기록을 정리하고, 링크로 보고한 뒤 나중에 다시 찾는 흐름을 화면으로 확인해보세요.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:gap-12">
          <div className="rounded-3xl border border-navy-800 bg-navy-900 p-5 sm:p-8">
            <div role="group" aria-label="실제 서비스 화면 선택" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SCREENS.map((screen, index) => (
                <button
                  key={screen.src}
                  type="button"
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  className={`min-h-12 rounded-xl px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt-400 ${
                    index === activeIndex
                      ? "bg-cobalt-500 text-white"
                      : "bg-navy-800 text-concrete-200 hover:bg-navy-800/70"
                  }`}
                >
                  {screen.label}
                </button>
              ))}
            </div>

            <div className="mt-9" aria-live="polite">
              <p className="text-sm font-bold text-cobalt-400">
                화면 {activeIndex + 1} / {SCREENS.length}
              </p>
              <h3 className="mt-3 text-2xl font-black leading-snug sm:text-3xl">
                {activeScreen.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-concrete-200">
                {activeScreen.description}
              </p>
            </div>

            <a
              href={activeScreen.src}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-11 items-center font-bold text-cobalt-400 underline underline-offset-4"
            >
              화면 크게 보기 <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          </div>

          <a
            href={activeScreen.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${activeScreen.label} 화면을 새 창에서 크게 보기`}
            className="mx-auto block w-full max-w-100 rounded-4xl border border-navy-800 bg-white p-2 shadow-2xl shadow-cobalt-500/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt-400 sm:p-3"
          >
            <Image
              key={activeScreen.src}
              src={activeScreen.src}
              alt={activeScreen.alt}
              width={activeScreen.width}
              height={activeScreen.height}
              sizes="(max-width: 640px) calc(100vw - 48px), 380px"
              className="mx-auto h-auto max-h-175 w-auto max-w-full rounded-3xl object-contain"
            />
          </a>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-concrete-200 bg-white p-6 text-navy-950 sm:p-8">
          <h3 className="text-xl font-black leading-snug sm:text-2xl">
            공개할 사진은 직접 고릅니다.
          </h3>
          <p className="mt-3 leading-relaxed text-concrete-500">
            보관함의 기록은 나만 보는 화면에서 관리합니다. 보고 링크를 받은 사람은
            공유한 기록을 볼 수 있고, 포트폴리오에는 직접 선택한 사진만 공개합니다.
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-concrete-300">
          화면 속 이름·날짜·사진 수는 제공된 제품 캡처의 예시 데이터이며 사용자 성과를 뜻하지 않습니다.
        </p>
        <div className="mt-8 flex justify-center">
          <CtaButton location="preview" />
        </div>
      </div>
    </section>
  );
}
