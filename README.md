# 블루칼라 미션 6 · 현장 사진 기록 체험

가상의 현장 작업기록을 등록하고 목록·상세에서 조회한 뒤 수정·삭제하는 과제 제출용 MVP입니다. 핵심 데이터는 Supabase Postgres, 사진은 Supabase Storage에 저장합니다. Mock Data와 localStorage를 최종 저장소로 쓰지 않습니다.

## 현재 상태

2026-10-16 문서 갱신 기준, **전체 CRUD·사진 연동과 사진 중심 랜딩/기록 화면 보정**을 구현했습니다. 로컬 DB/Storage·브라우저 검증은 2026-10-14에 통과했고, 이번에는 Supabase 연결/데이터 작업을 제외하고 코드 검증과 GitHub 반영을 진행합니다. 클라우드 Supabase와 Vercel 배포는 아직 없습니다. 실제 블루칼라 서비스와 미션 5 배포는 변경하지 않았습니다.

- [기능·테이블 명세](docs/mission6-plan.md)
- [과제 자원 분리](docs/mission6-isolation.md)
- [Supabase 준비](docs/mission6-supabase-setup.md)
- [QA 결과](docs/mission6-qa.md)
- [제품 자료 반영 기준](docs/mission6-reference-alignment.md)
- [남은 제출 작업](docs/mission6-submission-status.md)

## 핵심 기능과 사용자 흐름

랜딩 → 목록 → 등록 → 상세 → 수정/삭제 → 목록. 목록은 DB에서 10건씩 조회하며 URL의 page를 유지합니다. 마지막 페이지의 기록이 삭제되면 남은 마지막 페이지로 조정합니다.

| 화면 | 경로 | 동작 |
|---|---|---|
| 데모 랜딩 | `/` | 문제 → 제품 흐름 → 과제 내부 체험 CTA |
| 목록 | `/records?page=1` | DB 조회·사진·10건 페이지네이션·빈 상태 |
| 등록 | `/records/new` | 텍스트·사진 저장, 상세 이동 |
| 상세 | `/records/[id]` | 저장값·사진·수정/삭제 진입·없는 기록 안내 |
| 수정 | `/records/[id]/edit?page=1` | 기존 값, 사진 유지/교체/제거 |
| 삭제 | 상세의 확인창 | 취소·확정, DB와 연결 파일 정리 |

- 사진 → 현장 이름 → 짧은 설명 순으로 입력합니다. 설명 문구 버튼은 입력칸을 채우고, 저장 버튼으로 DB에 반영합니다.
- 현장 이름과 유효한 기록 날짜를 서버에서 검증합니다. 기록 날짜는 한국 기준 오늘로 미리 채우며 직접 고르는 참고 정보입니다.
- 제목은 선택입니다. 생략하면 서버가 설명 첫 줄(최대 120자) 또는 현장 이름으로 저장 제목을 만듭니다. 기존 제목은 수정 화면에 불러옵니다.
- 목록의 등록일은 DB created_at의 한국 날짜입니다. 직접 선택한 work_date와 구분하며 촬영일·실제 일한 날을 추정하지 않습니다.
- 저장 중 중복 제출을 막고 같은 등록 UUID의 재전송은 동일 기록으로 처리합니다.
- 수정·삭제 시 읽었던 updated_at을 대조해 오래된 화면이 최신 값을 덮어쓰지 않도록 합니다.
- 실패 시 텍스트와 선택한 사진을 유지합니다. 조회 오류·빈 목록·없는 주소를 구분합니다.
- 삭제 확인창은 취소·Esc·포커스 복귀를 제공합니다.
- HTML은 텍스트로 표시합니다. 실제 이름·주소·연락처·사람 얼굴·운영 자료를 입력하지 않는 공용 데모입니다. 모든 방문자가 데모 기록을 조회·수정·삭제할 수 있습니다.

## 서비스 소개와 과제 체험 범위

랜딩은 제공된 제품 자료의 카톡 사진 전송 → 현장별 기록 관리 → 보고 링크/PDF → 보관함·직접 선택한 포트폴리오 흐름을 소개합니다. 체험 CTA는 과제 내부 웹 CRUD에 연결합니다. 카카오톡·보고 공유/PDF·포트폴리오는 이번 과제에서 실행하는 기능에 포함하지 않습니다.

흰 배경, 파란 주요 버튼(#2563EB), slate 본문과 44px 이상 터치 영역을 적용합니다. Pretendard Variable은 [공식 v1.3.9 배포](https://github.com/orioncactus/pretendard/tree/v1.3.9)에서 받아 자체 호스팅하며 [SIL OFL 라이선스](public/fonts/OFL.txt)를 함께 보관합니다. 랜딩의 욕실 그림과 DB 예시 사진은 가상 자료입니다.

## 사진과 파일 정리

비공개 `work-record-images` 버킷에 사진 한 장을 연결합니다. JPG·PNG·WebP, 최대 3 MiB(3,145,728 bytes)이며 확장자/MIME/실제 디코딩을 검사합니다. 정지 이미지·최대 2,500만 화소를 지원합니다. 사진 방향을 적용하고 EXIF 등 메타데이터를 제거해 저장합니다.

목록·상세는 서버에서 발급한 10분 URL로 표시합니다. 사진 없음·응답 실패를 안내하고 상세/수정 화면에서 다시 불러올 수 있습니다. 비밀 API 키는 브라우저에 전달하지 않습니다.

DB와 Storage는 하나의 트랜잭션이 아닙니다. 업로드 후 DB 실패 시 새 파일을 정리하고, 교체/제거/기록 삭제 성공 뒤 이전 파일을 정리합니다. 현재 레코드에 연결된 경로는 정리 대상에서 제외합니다. 파일 정리 실패는 `storage_cleanup_tasks`에 남겨 재시도하며, 내역 저장까지 실패하면 비밀값 없이 과제 UUID/경로만 서버에 기록합니다. 완전한 DB 장애나 프로세스 중단 뒤에는 후속 확인이 필요할 수 있습니다.

## 기술

Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui 스타일의 Button/Card/AlertDialog, Radix Alert Dialog, Supabase JS, Zod, Sharp, Playwright. 조회는 Server Components, 변경은 Server Actions이며 별도 백엔드 서버를 만들지 않습니다.

## 테이블

새 과제 DB에 다음 마이그레이션을 순서대로 적용합니다.

1. `supabase/migrations/20261014000100_create_work_records.sql`
2. `supabase/migrations/20261014000200_record_images.sql`

| work_records 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid | PK |
| site_label | varchar(80) | 필수, trim 후 1~80자 |
| work_date | date | 직접 고른 참고 날짜, 필수, 1900~2100년 |
| title | varchar(120) | DB는 1~120자 필수. 폼에서 생략하면 서버 자동 생성 |
| description | text | 기본 빈 문자열, 최대 2000자 |
| image_path | text | 선택, records/{기록 UUID}/{파일 UUID}.{확장자} |
| created_at | timestamptz | DB 생성 시각 |
| updated_at | timestamptz | DB 기본값·수정 트리거 |

내부 파일 정리 테이블 `storage_cleanup_tasks`는 id, record_id, image_path(고유), reason, attempts, created_at으로 구성합니다. 삭제된 기록의 파일도 정리해야 하므로 기록 FK를 두지 않습니다.

두 테이블의 RLS 기본 거부·anon/authenticated 직접 권한 제거·service_role 권한을 적용합니다. 로그인·사용자별 접근 정책은 미션 7 범위입니다. 서버 키는 공용 과제 데이터만 처리합니다.

## 로컬 실행

Node.js 22 이상과 Docker Desktop Linux 엔진이 필요합니다. Supabase CLI는 2.120.0으로 고정합니다.

```bash
npm ci
npm run db:start
npm run db:migrate
npm run check:db
npm run seed:demo
npm run dev -- --hostname 127.0.0.1 --port 3106
```

- 앱: `http://127.0.0.1:3106`
- 새 과제 Supabase API: `http://127.0.0.1:56321`
- Studio: `http://127.0.0.1:56323`
- DB 포트: 56322, project_id: `bluecollar-mission6-demo`
- 시작 도구는 새 로컬 키를 비추적 .env.local에 설정합니다. 다른 프로젝트 값이 있으면 덮어쓰지 않습니다.
- seed는 개인정보 없는 가상 예시 2건을 준비합니다. 사진은 코드로 만든 가상 이미지이며 기존 기록을 덮어쓰지 않습니다.

```bash
npm run cleanup:images
npm run db:stop
```

cleanup은 등록한 과제 DB의 정리 내역에서 UUID 경로를 검증하고 아직 연결된 파일은 지우지 않습니다. 중지는 미션 6 스택만 대상으로 하며 데이터 볼륨을 유지합니다.

## 환경 변수

.env.example에는 이름만 있으며 실제 값은 Git·문서에 올리지 않습니다.

| 이름 | 목적 |
|---|---|
| SUPABASE_URL | 허용된 과제 Supabase URL |
| SUPABASE_SECRET_KEY | 서버 전용 키. NEXT_PUBLIC 접두사 금지 |
| NEXT_PUBLIC_SITE_URL | 미션 6 사이트 주소 |

`lib/supabase/demo-project.json`에는 공개 가능한 식별자만 있습니다. 로컬은 127.0.0.1:56321만 허용하며 Vercel에서는 거절합니다. 클라우드는 새 과제 프로젝트의 확인·등록된 ref와 URL이 같아야 연결합니다.

## 검증

```bash
npm run lint
npm test
npm run build
npm run test:db
npm run test:e2e
```

사진 중심 화면 보정 후 단위 검사 13개, 실제 DB/Storage 검사 7개, 최종 빌드 앱의 브라우저 검사 11개가 통과했습니다. DB 검사에서는 업로드/등록/수정/파일 정리 실패와 저장 응답 유실을 선택적으로 주입해 보상 동작을 확인했습니다. 핵심 정상 데이터는 실제 Supabase에 저장하며 테스트가 만든 UUID/파일만 정리합니다.

`npm run test:states -- empty`는 기본 가상 예시 두 건만 있을 때 임시 분리 후 복원해 빈 화면을 확인합니다. 사용자 기록이 있으면 실행을 거절합니다. 연결 실패 UI는 환경 파일을 바꾸지 않은 테스트용 앱 프로세스로 확인했습니다. 상세 결과·재현 조건은 QA 문서에 있습니다.

## GitHub와 배포·제출 상태

- [공개 GitHub 저장소](https://github.com/jel6111/bluecollar-landing)
- [미션 6 최신 작업 브랜치](https://github.com/jel6111/bluecollar-landing/tree/feature/mission6-crud-20261014)
- 로컬 주소: `http://127.0.0.1:3106` (공개 제출 URL이 아님)
- 미션 6 공개 Vercel URL: **미발급**


GitHub `feature/mission6-crud-20261014` 브랜치에 관리하며 자동 Git 배포는 차단합니다. 로컬 Supabase는 클라우드 무료 프로젝트 한도를 소비하지 않습니다. 사용자가 무료 한도를 모두 사용 중이라고 설명했으므로 별도 클라우드 확보 방법을 결정한 후 새 Vercel에 연결해야 합니다.

미션 6 공개 배포 URL은 아직 없습니다. 기존 미션 5 URL을 미션 6 제출 링크로 사용하지 않습니다. 실제 서비스 DB 재사용·미션 5 배포 변경·main 병합은 진행하지 않습니다.
