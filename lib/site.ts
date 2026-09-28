/** 랜딩에서 안내하는 실제 제품과 카카오톡 채널의 주소를 한곳에서 관리한다. */
export const SITE = {
  name: "블루칼라 Blue Collar",
  title: "블루칼라 | 오늘 찍은 사진이 보고가 되고 포트폴리오가 됩니다",
  description:
    "작업 사진을 카카오톡으로 보내면 현장·날짜별로 정리하고 보고 링크와 포트폴리오로 이어줍니다. 앱 설치와 회원가입 없이 시작하세요.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  kakaoUrl: "https://pf.kakao.com/_GnafX/chat",
  productUrl: "https://parancollar.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
} as const;
