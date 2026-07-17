# 블루칼라 Blue Collar — 미션 2 가설 검증 MVP 랜딩페이지

작업 사진을 카카오톡으로 보고하는 기공이 현재 방식의 불편에 공감하고, 무료 테스트 참여 행동을 보이는지 검증하는 스모크 테스트용 랜딩페이지입니다.

> 이 페이지는 **미션 제출용 가설 검증 MVP**이며, 실제 블루칼라 제품 MVP(사진 정리·포트폴리오 생성 기능)가 아닙니다. 회원가입·DB·업로드 기능은 의도적으로 없습니다.

## 기술 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- Vercel 배포
- Google Analytics (gtag.js) — 방문·CTA 클릭 측정

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기 (아래 참고)
npm run dev                  # http://localhost:3000
```

빌드 확인:

```bash
npm run build
```

## 환경변수 (.env.local / Vercel 환경변수)

| 변수 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_FORM_URL` | ✅ | 구글폼 URL. 미설정/placeholder 상태면 CTA가 이동하지 않고 안내 문구를 표시 |
| `NEXT_PUBLIC_GA_ID` | 선택 | GA4 측정 ID (`G-XXXXXXXXXX`). 미설정 시 GA 스크립트 미삽입 |
| `NEXT_PUBLIC_SITE_URL` | 배포 시 | 배포 URL. 카톡 공유 OG 이미지 절대경로 기준 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 선택 | 푸터 문의 이메일. 미설정 시 문의 줄 자체가 숨겨짐 |

## 구글폼 연결 방법

1. 작업요청서 7번 섹션의 문항으로 구글폼을 생성
2. 보내기 → 링크 복사 (`https://forms.gle/...`)
3. `.env.local`과 Vercel 환경변수의 `NEXT_PUBLIC_GOOGLE_FORM_URL`에 입력
4. 재배포(또는 dev 서버 재시작) 후 CTA 클릭이 폼으로 이동하는지 확인

## 측정 (Analytics)

- **방문 수**: GA4 `page_view` 자동 수집 (유입 채널은 UTM으로 구분)
- **CTA 클릭**: 커스텀 이벤트 `hypothesis_test_apply_click`
  - 속성: `location` (`header | hero | bottom`), `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- **UTM 유지**: 랜딩 URL의 UTM 파라미터가 구글폼 이동 URL에 그대로 이어붙음
- 구글폼 **응답 수**는 폼 응답 시트에서 별도 집계

GA 설정: [analytics.google.com](https://analytics.google.com)에서 GA4 속성 생성 → 웹 스트림 추가 → 측정 ID를 `NEXT_PUBLIC_GA_ID`에 입력. (Vercel Analytics를 쓰려면 대시보드에서 Enable만 해도 방문 수는 잡힘)

## 배포 채널별 URL 예시

```text
/?utm_source=kakao_openchat&utm_medium=community&utm_campaign=mission2
/?utm_source=naver_cafe&utm_medium=community&utm_campaign=mission2
/?utm_source=naver_band&utm_medium=community&utm_campaign=mission2
/?utm_source=direct_dm&utm_medium=direct&utm_campaign=mission2
/?utm_source=tool_shop&utm_medium=offline&utm_campaign=mission2
```

## Vercel 배포

1. GitHub에 푸시 후 [vercel.com](https://vercel.com)에서 Import (또는 `npx vercel`)
2. 프로젝트 설정 → Environment Variables에 위 환경변수 입력
3. 배포 후 `NEXT_PUBLIC_SITE_URL`을 실제 배포 URL로 갱신하고 재배포
4. [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 OG 미리보기 확인 (수정 후엔 캐시 초기화)

## OG 이미지 교체

`public/og-v2.jpg` (1200×630) 파일을 교체하면 됩니다. 카톡이 이미지 URL을 캐싱하므로, 이미지를 바꿀 때는 파일명도 함께 바꾸고(`og-v3.jpg` 등) `app/layout.tsx`의 `openGraph.images.url`을 갱신하세요. 로고는 `public/logo.png`.

## 프로젝트 구조

```text
app/
  layout.tsx        # 메타데이터(OG 포함), 폰트, GA 삽입
  page.tsx          # 랜딩페이지 전체 섹션
  globals.css       # 브랜드 컬러 테마, 기본 글자 크기(고연령 가독성)
components/
  CtaButton.tsx     # 단일 CTA — UTM 유지, GA 이벤트, URL 미설정 방어
  Analytics.tsx     # GA gtag.js (측정 ID 있을 때만)
lib/
  site.ts           # 환경변수 기반 사이트 설정
public/
  og-v2.jpg         # 카톡 공유용 OG 이미지 (1200×630)
  logo.png          # 브랜드 로고
```
