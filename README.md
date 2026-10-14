# 블루칼라 미션 6 · 현장 작업기록 CRUD 데모

Next.js와 Supabase로 가상의 현장 작업기록을 등록·조회·수정·삭제하는 **과제 제출용 MVP**입니다. 실제 블루칼라의 서비스·데이터·배포·카카오톡 채널을 연결하지 않습니다.

## 현재 진행 상태

2026-10-14 기준 **1묶음: 작업 공간 분리와 기능 명세**입니다. 미션 5 최신 커밋 `1e403c7`을 별도 클론으로 가져와 `feature/mission6-crud-20261014` 브랜치를 준비했습니다. 현재 화면 코드는 미션 5에서 상속한 상태이며 CRUD 구현, Supabase 생성·연결, 파일 업로드, 미션 6 공개 배포는 아직 없습니다.

- [기능·화면·데이터 설계](docs/mission6-plan.md)
- [과제 자원 분리와 연결 확인](docs/mission6-isolation.md)
- [QA 계획·확인 결과](docs/mission6-qa.md)
- `CLAUDE.md`와 `AGENTS.md`: 과제 범위와 데이터 처리 규칙

## 핵심 기능과 화면

가상의 현장 별칭·작업일·제목·설명과 선택 사진 1장을 작업기록으로 저장합니다. 목록은 10건씩 탐색하고, 상세에서 수정하거나 확인 절차를 거쳐 삭제합니다. 로그인 없는 공용 데모이므로 개인정보·실제 주소·고객 사진을 저장하지 않습니다.

| 화면 | 계획된 경로 |
|---|---|
| 과제용 랜딩 | `/` |
| 목록·페이지네이션 | `/records?page=1` |
| 등록 | `/records/new` |
| 상세 | `/records/[id]` |
| 수정 | `/records/[id]/edit` |

## 기술 스택과 인터랙션

- 기존 기반: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui.
- 다음 묶음에서 추가: Supabase Postgres·Storage, 서버 전용 SDK·검증.
- 계획: 페이지 탐색, 등록·수정 폼, 삭제 확인, 저장 중 중복 제출 차단.
- 상태: 로딩·빈 목록·조회 실패·필드 오류·저장 중·없는 상세 주소.
- 사진: private Storage, JPEG/PNG/WebP 1장, 최대 3 MiB, 서버 발급 URL로 표시.

## 테이블 설계

`work_records`는 설계 상태이며 2묶음에서 새 과제용 Supabase에만 생성합니다.

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| `id` | uuid | 기본키, 서버/DB 생성 |
| `site_label` | varchar(80) | 필수, trim 후 1~80자 |
| `work_date` | date | 필수, 유효한 달력 날짜 |
| `title` | varchar(120) | 필수, trim 후 1~120자 |
| `description` | text | 기본값 빈 문자열, 최대 2000자 |
| `image_path` | text | 선택, Storage 경로 |
| `created_at` | timestamptz | DB 기본값 현재 시각 |
| `updated_at` | timestamptz | DB 기본값·수정 트리거 |

## 환경 변수 이름

`.env.example`에는 이름만 있습니다. 실제 값은 새 과제 프로젝트가 준비된 뒤 `.env.local`과 전용 Vercel에 각각 설정합니다. 다른 프로젝트의 비밀 키를 복사하지 않습니다.

| 이름 | 목적 |
|---|---|
| `SUPABASE_URL` | 새 과제용 Supabase URL, 서버 전용 |
| `SUPABASE_SECRET_KEY` | 새 과제용 서버 비밀 키, 서버 전용 |
| `NEXT_PUBLIC_SITE_URL` | 미션 6 URL. 로컬은 `http://127.0.0.1:3106` |

새 Supabase ref와 Vercel project ID는 자원 확인 문서에 기록하고 연결 전 코드의 허용 대상과 대조합니다. 비밀 키 값은 문서·Git·브라우저에 넣지 않습니다.

## 실행 절차

상속 페이지에는 실제 서비스 링크가 있으므로 현재 앱 실행을 보류합니다. 2묶음의 첫 코드 변경으로 외부 서비스 CTA·분석·문의 연동을 제거한 뒤 실행합니다.

```bash
npm ci
```

`.env.example`을 `.env.local`로 복사하고 새 과제용 값만 설정합니다.

```bash
npm run dev -- --hostname 127.0.0.1 --port 3106
npm run lint
npm run build
```

## 배포·제출

- GitHub: `jel6111/bluecollar-landing`의 `feature/mission6-crud-20261014` 브랜치.
- 미션 6 Vercel URL: **아직 없음**.
- 새 Supabase/Vercel 예정 이름: `bluecollar-mission6-demo`.
- `vercel.json`은 미션 6 브랜치의 Git 자동 배포를 차단합니다. 확인된 새 프로젝트에만 배포합니다.
- 미션 5 공개 주소와 실제 서비스 주소는 미션 6의 배포 대상이 아닙니다.

## QA

1묶음은 Git 브랜치·미연결 상태·문서·설정만 검증합니다. CRUD·사진 업로드의 통과 결과는 아직 없습니다. 상세는 [미션 6 QA](docs/mission6-qa.md)에 기록합니다. `docs/mission5-*`는 이전 미션 기록입니다.
