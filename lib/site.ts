/** 과제 데모 내부 경로만 제공한다. 운영 서비스·메시징·분석 주소는 없다. */
const localUrl = "http://127.0.0.1:3106";
const requestedUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteUrl = requestedUrl ? new URL(requestedUrl) : new URL(localUrl);
if (
  !["http:", "https:"].includes(siteUrl.protocol) ||
  siteUrl.hostname === "parancollar.com" ||
  siteUrl.hostname.endsWith(".parancollar.com") ||
  siteUrl.hostname === "bluecollar-landing.vercel.app"
) {
  throw new Error("미션 6 전용 사이트 주소를 설정해주세요.");
}
export const SITE = {
  name: "블루칼라 미션 6 데모",
  title: "블루칼라 미션 6 | 현장 작업기록 데모",
  description:
    "가상의 현장 작업기록을 등록하고 다시 확인하는 과제 제출용 데모입니다.",
  url: siteUrl.origin,
  recordsPath: "/records",
} as const;
