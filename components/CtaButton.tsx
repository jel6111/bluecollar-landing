"use client";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type Props = {
  location: "header" | "hero" | "preview" | "bottom";
  size?: "default" | "lg";
  className?: string;
  label?: string;
};

/** 실제 카카오톡 채널로 이동한다. 브라우저의 기본 링크 동작을 유지한다. */
export default function CtaButton({ location, size = "lg", className, label = "카카오톡으로 시작하기" }: Props) {
  return (
    <Button asChild size={size} className={className}>
      <a
        href={SITE.kakaoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 채널에서 블루칼라 시작하기 (새 창)"
        onClick={() => window.gtag?.("event", "kakao_start_click", { location })}
      >
        {label} <span aria-hidden="true">↗</span>
      </a>
    </Button>
  );
}
