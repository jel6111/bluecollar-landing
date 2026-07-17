/**
 * 사이트 전역 설정.
 * 값은 전부 환경변수에서 읽는다 — .env.example 참고.
 */
export const SITE = {
  name: "블루칼라 Blue Collar",
  title: "블루칼라 | 작업 사진이 기록과 포트폴리오가 됩니다",
  description:
    "카톡·문자로 작업 사진을 전송하는 기공들을 위한 간편 솔루션",
  /** Vercel 배포 URL (OG 메타데이터 절대경로 기준) */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** 설문(구글폼) URL — 미설정 시 CTA가 방어 동작한다 */
  formUrl: process.env.NEXT_PUBLIC_GOOGLE_FORM_URL,
  /** Google Analytics 측정 ID (G-XXXXXXXXXX) — 미설정 시 GA 스크립트를 넣지 않는다 */
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  /** 푸터 문의 이메일 (선택) */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
} as const;

/** 구글폼 URL이 실제로 사용 가능한 상태인지 (placeholder 방어) */
export function isFormUrlReady(url: string | undefined): url is string {
  return Boolean(url && !url.includes("REPLACE_ME"));
}
