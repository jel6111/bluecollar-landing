# 블루칼라 · 미션 5 랜딩 페이지

현장 기공이 카카오톡으로 보내는 작업 사진을 현장·날짜별 기록으로 정리하고, 보고 링크와 보관함·포트폴리오로 이어주는 **실제 베타 서비스**를 소개하는 랜딩 페이지입니다. 기존 미션 2 설문용 랜딩을 미션 3의 행동 검증 계획과 미션 4 Figma 스타일에 맞춰 갱신했습니다.

- [미션 5 랜딩 배포](https://bluecollar-landing.vercel.app/)
- [실제 서비스](https://parancollar.com)
- [미션 4 Figma](https://www.figma.com/design/b1dSePgftJ6gBZuVJZUlmY/정이레?node-id=85-2)
- [기획·디자인 반영](docs/mission5-plan.md)
- [QA 체크리스트](docs/mission5-qa.md)

## 핵심 흐름

문제 인식 → 카카오톡 사진 전송 → 작업기록·보고 링크 → 로그인 없는 외부 열람 → 보관함·포트폴리오. 보관함의 기록은 나만 보는 화면에서 관리하고, 포트폴리오에 공개할 사진은 직접 고릅니다. 랜딩의 주 CTA는 무료로 시작할 수 있는 [카카오톡 채널](https://pf.kakao.com/_GnafX/chat)로 이어집니다. 별도의 구글폼 신청을 첫 단계로 요구하지 않습니다.

미션 3에서 실제 사용자 응답·베타 온보딩·반복 사용 데이터는 아직 없었습니다. 이 랜딩의 메시지는 구현된 기능과 **검증할 가설**을 구분하며 사용자 성과를 주장하지 않습니다.

## 기술 스택과 인터랙션

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- shadcn/ui 구성(`components.json`, `components/ui/button.tsx`, `components/ui/card.tsx`)
- Vercel, 선택적 Google Analytics 4
- 주요 섹션을 컴포넌트로 나누고 버튼·카드를 재사용
- 제공받은 실제 서비스 화면 6장을 단계별로 선택하고 원본 크기로 열람
- `사용 방법 보기`: JavaScript `scrollIntoView`로 해결 방식 섹션에 이동
- 카카오톡 CTA: 채널로 이동하고 GA4가 설정된 경우 클릭 위치별 `kakao_start_click` 이벤트 기록

## 로컬 실행

Node.js 20 이상을 권장합니다.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`http://localhost:3000`에서 확인합니다. 배포 전에는 다음을 실행합니다.

```bash
npm run lint
npm run build
```

## 환경 변수

| 이름 | 필요 여부 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 배포 시 권장 | 랜딩의 공개 URL. OG 기준. 미설정 시 Vercel 배포 URL 사용 |
| `NEXT_PUBLIC_GA_ID` | 선택 | GA4 측정 ID. 없으면 GA 스크립트 없음 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 선택 | 푸터 공개 문의 이메일 |

환경 변수에는 실제 비밀키를 넣지 않습니다. `.env*`는 Git에서 제외하고 `.env.example`만 예시로 포함합니다. `NEXT_PUBLIC_` 값은 브라우저에서 읽을 수 있는 공개 설정입니다.

## 구조

```text
app/                 페이지 구성, 메타데이터, 스타일
components/          CTA, 섹션 이동, 분석, 아이콘
components/ui/       재사용 버튼·카드
lib/                 사이트 주소·스타일 유틸리티
public/              PDF 원본에서 추출한 로고, OG, 실제 서비스 화면 캡처
docs/                미션 5 기획·QA
```

## 배포와 점검

`jel6111/bluecollar-landing`을 실제 서비스 `jel6111/parancollar`와 별도인 Vercel 프로젝트 `bluecollar-landing`에 연결했습니다. 2026-09-29에는 미션 브랜치 `feature/mission5-landing-20260928`의 커밋 `b39c54e`를 Preview에서 확인한 뒤 위 공개 주소의 Production 배포로 승격했습니다. `main`에는 아직 이전 랜딩이 있으므로, 향후 `main` 푸시는 공개 주소의 내용을 바꿀 수 있습니다. PR을 검토·병합할 때 현재 미션 코드가 `main`에 반영되는지 확인하세요.

[QA 체크리스트](docs/mission5-qa.md)에 완료된 항목과 남은 점검을 구분해 기록했습니다. 현재 저장소는 비공개이므로 평가자에게 저장소 접근 권한을 부여해야 합니다.

2026-09-29에는 제공받은 블루칼라 로고와 실제 서비스 화면으로 랜딩의 예시 목업을 교체하고, 실제 서비스 설명에 맞게 문구를 정리했습니다. 이 화면과 문구는 위 공개 URL에 반영되었습니다.
