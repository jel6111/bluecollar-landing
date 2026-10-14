# 블루칼라 미션 6 · 현장 작업기록 데모

가상의 현장 작업기록을 등록하고 목록·상세에서 다시 확인하는 과제 제출용 MVP입니다. 핵심 데이터는 Supabase Postgres에 저장하며 Mock Data/localStorage를 최종 저장소로 쓰지 않습니다.

## 현재 상태

2026-10-14 기준 2묶음의 코드와 **새 로컬 Supabase의 실제 등록·조회 흐름**을 구현·검증했습니다. 클라우드 Supabase는 아직 생성·연결하지 못했고, Vercel 배포 URL은 아직 없습니다. 수정·삭제·사진 업로드는 3묶음 범위입니다.

- [기능·테이블 명세](docs/mission6-plan.md)
- [과제 자원 분리 기록](docs/mission6-isolation.md)
- [Supabase 로컬·클라우드 준비](docs/mission6-supabase-setup.md)
- [QA 결과](docs/mission6-qa.md)

## 구현된 흐름

랜딩의 내부 CTA → 기록 목록 → 새 기록 등록 → 상세 → 새로고침 후 같은 기록 확인. 목록은 DB에서 10건씩 조회하고 URL의 page로 탐색합니다. 잘못된 페이지는 유효한 번호로 조정합니다. 없는 UUID는 안내 화면, DB 오류는 오류 안내, 연결 미설정은 연결 준비 안내로 구분합니다.

필수 현장 별칭·작업일·제목과 선택 설명을 서버에서 검증합니다. 저장 중 제출을 비활성화하고 같은 제출 UUID의 재전송은 동일 기록으로 처리합니다. HTML은 텍스트로 표시합니다. 실사용 성과를 주장하지 않으며 실제 이름·주소·연락처를 입력하지 않는 공용 데모입니다.

| 화면 | 경로 | 상태 |
|---|---|---|
| 데모 랜딩 | `/` | 구현, 모든 CTA 내부 경로 |
| 목록·10건 페이지네이션 | `/records?page=1` | 실제 DB 검증 |
| 등록 | `/records/new` | Server Action 저장 |
| 상세 | `/records/[id]` | DB 조회·없는 주소 안내 |
| 수정·삭제 | 상세/수정 경로 | 3묶음 예정 |
| 사진 | 상세·폼 | 3묶음 예정 |

## 기술

Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui Button/Card, Supabase JS, Zod, Playwright. Supabase SDK와 비밀 키는 서버 전용입니다. Next.js는 상속한 16.2.10의 보안 문제를 해결하기 위해 이 미션 6 브랜치에서 16.4.0으로 갱신했습니다.

## 테이블

마이그레이션: `supabase/migrations/20261014000100_create_work_records.sql`. 새 로컬 과제 DB에 적용했습니다. 같은 SQL을 다른 기존 프로젝트에 적용하지 않습니다.

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid | PK, 생성 기본값 |
| site_label | varchar(80) | 필수, trim 길이 1~80 |
| work_date | date | 필수, 1900~2100년 |
| title | varchar(120) | 필수, trim 길이 1~120 |
| description | text | 기본 빈 문자열, 최대 2000자 |
| image_path | text | 선택, 3묶음에서 Storage 연결 |
| created_at | timestamptz | DB 생성 시각 |
| updated_at | timestamptz | DB 기본값·수정 트리거 |

RLS 기본 거부, anon/authenticated의 직접 테이블 권한 제거, service_role 권한 명시를 적용했습니다. 로그인/사용자별 권한 정책은 이번 미션에서 구현하지 않습니다. 서버 경유 공용 데모이므로 등록된 내용은 다른 방문자도 볼 수 있습니다.

## 로컬 실행

Node.js 22 이상과 Docker Desktop Linux 엔진이 필요합니다. Supabase CLI는 로컬 시작 도구에서 2.120.0으로 고정합니다.

```bash
npm ci
npm run db:start
npm run check:db
npm run seed:demo
npm run dev -- --hostname 127.0.0.1 --port 3106
```

- 앱: `http://127.0.0.1:3106`
- 새 과제 Supabase API: `http://127.0.0.1:56321`
- 새 과제 Studio: `http://127.0.0.1:56323`
- DB 포트: 56322, 로컬 project_id: `bluecollar-mission6-demo`
- 시작 도구는 새 로컬 키만 비추적 .env.local에 설정하고 키를 출력하지 않습니다. 이미 다른 프로젝트 값이 설정돼 있으면 덮어쓰지 않습니다.
- `seed:demo`는 DB에 개인정보 없는 예시 한 건을 넣으며 기존 기록을 변경하지 않습니다.

```bash
npm run db:stop
```

위 중지는 미션 6 프로젝트만 대상으로 하며 데이터 볼륨을 유지합니다. Docker 전체 중지·전체 프로젝트 중지는 사용하지 않습니다.

## 환경 변수

`.env.example`에는 이름만 있습니다. 값은 Git에 올리지 않습니다.

| 이름 | 목적 |
|---|---|
| SUPABASE_URL | 허용된 과제 Supabase URL |
| SUPABASE_SECRET_KEY | 서버 전용 키. NEXT_PUBLIC 접두사 금지 |
| NEXT_PUBLIC_SITE_URL | 미션 6 사이트 주소 |

`lib/supabase/demo-project.json`은 공개 가능한 프로젝트 식별자만 기록합니다. 로컬은 127.0.0.1:56321만 허용하며 Vercel에서는 로컬 연결을 거절합니다. 클라우드에서는 사용자가 새 과제 프로젝트임을 확인해 등록한 ref와 URL이 같아야 연결합니다. [클라우드 준비 절차](docs/mission6-supabase-setup.md)를 따릅니다.

## 검증

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

입력·연결 경계 테스트 8개와 실제 로컬 DB 브라우저 검사 5개가 통과했습니다. 브라우저 검사는 등록·상세·새로고침·목록, 11건 페이지네이션, 없는 UUID, 필수값 오류, 모바일 320/375px·데스크톱을 포함합니다. 테스트가 만든 UUID만 정리하며 사용자 데이터를 지우지 않습니다. 세부 근거와 아직 확인하지 않은 항목은 QA 문서에 기록합니다.

## 배포·제출 상태

GitHub의 `feature/mission6-crud-20261014` 브랜치에서 작업합니다. 자동 Git 배포는 차단돼 있습니다. 클라우드 Supabase 연결과 새 과제용 Vercel 배포는 아직 없습니다. 기존 미션 5 URL을 미션 6 배포 링크로 사용하지 않습니다.
