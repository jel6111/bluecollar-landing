/** 과제 데모 내부 경로만 제공한다. 운영 서비스·메시징·분석 주소는 없다. */
const localUrl = "http://127.0.0.1:3107";
const requestedUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteUrl = requestedUrl ? new URL(requestedUrl) : new URL(localUrl);
if (
  siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash || siteUrl.pathname !== "/" ||
  !["http://127.0.0.1:3107", "http://localhost:3107", "https://bluecollar-mission7-demo.vercel.app"].includes(siteUrl.origin)
) {
  throw new Error("미션 7 전용 사이트 주소를 설정해주세요.");
}
export const SITE = {
  name: "블루칼라 미션 7 데모",
  title: "블루칼라 미션 7 | 회원별 작업기록",
  description:
    "블루칼라의 사진 기록 흐름을 소개하고, 별도 과제 계정의 가입·이메일 확인·로그인·로그아웃을 체험하는 데모입니다.",
  url: siteUrl.origin,
  recordsPath: "/records",
} as const;
