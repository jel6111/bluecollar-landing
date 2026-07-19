"use client";

import { useEffect, useState } from "react";
import { SITE, isFormUrlReady } from "@/lib/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type Props = {
  /** 측정 이벤트에 기록되는 버튼 위치 */
  location: "header" | "hero" | "middle" | "bottom";
  size?: "md" | "lg";
  label?: string;
};

/** 현재 페이지 URL의 UTM 파라미터를 읽는다 */
function readUtm(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

/**
 * 페이지 내 모든 CTA가 공유하는 단일 버튼.
 * - 구글폼으로 이동하며 현재 URL의 UTM 파라미터를 유지한다.
 * - 클릭 시 GA 이벤트 hypothesis_test_apply_click 을 기록한다.
 * - 폼 URL 미설정 시 깨진 링크로 이동하지 않도록 방어한다.
 */
export default function CtaButton({
  location,
  size = "lg",
  label = "무료 체험 신청하기",
}: Props) {
  const [notice, setNotice] = useState(false);
  const formReady = isFormUrlReady(SITE.formUrl);

  useEffect(() => {
    if (!formReady && process.env.NODE_ENV !== "production") {
      console.warn(
        "[블루칼라] NEXT_PUBLIC_GOOGLE_FORM_URL이 설정되지 않았습니다. .env.local에 구글폼 URL을 입력하세요.",
      );
    }
  }, [formReady]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (!formReady) {
      setNotice(true);
      return;
    }
    // 유입 URL의 UTM을 구글폼 URL에 그대로 이어붙인다
    const utm = readUtm();
    const target = new URL(SITE.formUrl as string);
    for (const [key, value] of Object.entries(utm)) {
      target.searchParams.set(key, value);
    }
    window.gtag?.("event", "hypothesis_test_apply_click", {
      location,
      ...utm,
    });
    window.open(target.toString(), "_blank", "noopener,noreferrer");
  };

  const sizeClasses =
    size === "lg"
      ? "px-9 py-5 text-xl sm:text-2xl rounded-2xl w-full sm:w-auto"
      : "px-5 py-3 text-base rounded-xl";

  return (
    <span className="inline-flex flex-col items-center gap-2 max-w-full">
      <a
        href={formReady ? SITE.formUrl : "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={`${label} — 설문 페이지가 새 창으로 열립니다`}
        className={`inline-flex items-center justify-center gap-2 font-bold text-white bg-cobalt-500 hover:bg-cobalt-600 active:bg-cobalt-600 shadow-lg shadow-cobalt-500/30 transition-colors text-center leading-snug ${sizeClasses}`}
      >
        {label}
      </a>
      {notice && (
        <span role="status" className="text-sm text-concrete-500">
          신청 링크를 준비 중입니다. 잠시 후 다시 시도해주세요.
        </span>
      )}
    </span>
  );
}
