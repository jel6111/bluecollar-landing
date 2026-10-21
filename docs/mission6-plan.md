# 미션 6 기능 명세와 구현 계획

작성일: 2026-10-14, 갱신일: 2026-10-21. 4묶음의 랜딩/기록 화면 보정, 새 과제 클라우드 Supabase 연결, 별도 Vercel 배포와 공개 환경 전체 검증을 완료했다. 공개 주소는 `https://bluecollar-mission6-demo.vercel.app/`이다.

## 검증할 가치와 범위

핵심 기능은 **가상의 현장 작업기록 1건 CRUD**다. 현장 이름·직접 선택한 참고 날짜·선택 제목·설명·사진을 한 건으로 저장하고 다시 찾고 고치고 삭제하는 흐름을 검증한다. 과제 웹 폼에서 직접 입력한다.

근거는 DB 영속성과 UI 동작이다. 실제 기공 사용률·시간 절약·보고 성과를 주장하지 않는다. 로그인·사용자별 권한, 실제 카카오톡 봇/웹훅, 운영 데이터 동기화, 댓글/좋아요, 여러 사진, 자동 포트폴리오는 기본 범위에 포함하지 않는다.

계정 없는 공용 데모이므로 다른 방문자의 데모 기록도 수정·삭제할 수 있다. 실제 이름·전화번호·주소·고객/작업자 얼굴·운영 현장 정보를 저장하지 않는다. 예시는 `A현장`, `욕실 타일 점검` 등 가상 자료를 쓴다.

## 사용자 흐름

랜딩의 내부 `사진 기록 체험하기` → 목록 → 카드 상세 → 수정/삭제. 목록·상세에서 등록 화면으로 진입할 수 있다. 등록 성공은 새 상세, 수정 성공은 같은 상세, 삭제 성공은 목록으로 이동한다.

상세·수정 왕복 시 목록 `page`를 보존한다. 삭제로 페이지가 비면 마지막 유효 페이지로 조정한다. 내부 이동에는 Next.js Link를 사용하고 실제 서비스·카카오톡으로 연결하지 않는다.

## 화면별 명세

| 화면/경로 | 표시·입력 | 행동 | 성공 | 실패·예외 |
|---|---|---|---|---|
| 랜딩 `/` | 과제 안내·사진 기록 가치·내부 CTA | 체험 | `/records` | 외부 서비스 CTA 제거 |
| 목록 `/records?page=1` | 사진·현장 이름·제목·설명·등록일(created_at), 10건/페이지 | 등록·카드·페이지 선택 | DB 최신 기록 | 0건은 등록 안내, 조회 실패는 재시도, 잘못된 page 정규화 |
| 상세 `/records/[id]` | 저장 필드·사진 또는 사진 없음 | 목록·등록·수정·삭제 | 선택 UUID의 데이터 | 잘못된/없는 UUID는 not-found, DB 장애는 error, 이미지 오류 안내 |
| 등록 `/records/new` | 공통 폼 | 저장·취소 | 새 레코드 상세 이동 | 필드 오류·입력 유지·pending·업로드 실패 안내 |
| 수정 `/records/[id]/edit` | 기존값·기존 사진 | 수정·사진 유지/교체/제거·저장 | 같은 상세의 변경값 | 삭제된 건은 not-found, 실패 시 입력/기존 데이터 유지 |
| 삭제 다이얼로그 | 제목·삭제 결과 | 취소·확정 | 목록 이동 | 취소는 유지, DB 실패는 상세 유지, 파일 정리 실패는 별도 기록 |

## 입력 검증

| 필드 | 규칙 | 오류 예시 |
|---|---|---|
| 현장 이름 | trim 후 1~80자, 필수 | 현장 이름을 입력해주세요. |
| 기록 날짜 | 직접 고르는 참고 날짜. 오늘(KST) 기본값, 유효한 YYYY-MM-DD, 1900~2100년 | 기록 날짜을 올바른 날짜로 입력해주세요. |
| 제목 | 선택, trim 후 최대 120자. 생략하면 설명 첫 줄 또는 현장 이름으로 생성 | 기록 제목은 120자 이내로 입력해주세요. |
| 설명 | 선택, 최대 2000자 | 설명은 2000자 이내로 입력해주세요. |
| 사진 | 선택 1장, JPEG/PNG/WebP, 0 초과~3 MiB | JPG, PNG, WebP 사진을 3MB 이하로 올려주세요. |
| ID | 서버에서 UUID 검증 | 없는 기록 안내 |

브라우저는 빠른 피드백, 서버는 최종 검증을 담당한다. 서버는 MIME/확장자와 이미지 시그니처를 확인한다. HTML은 텍스트로 표시하며 `dangerouslySetInnerHTML`을 쓰지 않는다. ID·시각·Storage 경로는 서버가 제어한다.

실제 구현은 Sharp 디코딩까지 확인하며 정지 이미지·최대 2,500만 화소를 허용한다. 방향을 적용하고 EXIF 등 메타데이터를 제거한다. 처리 후에도 3 MiB를 검사한다. 폼은 실패한 입력과 File 객체를 유지하며 선택하지 않은 빈 파일은 전송하지 않는다.

## 데이터 구조

테이블 `public.work_records`. 저장소의 SQL 2개를 새 로컬 과제 스택과 새 클라우드 과제 프로젝트에 각각 적용했다. 허용된 클라우드 ref는 `uikvezrkmwplbslayene`이다.

| 컬럼 | 타입 | 기본값·제약 |
|---|---|---|
| `id` | uuid | PK, gen_random_uuid() 기본값, 파일 경로용 ID는 서버에서 먼저 생성 가능 |
| `site_label` | varchar(80) | NOT NULL, trim 길이 1~80 CHECK |
| `work_date` | date | 직접 선택한 참고 날짜, NOT NULL, 1900~2100 범위 CHECK |
| `title` | varchar(120) | NOT NULL, 1~120 CHECK. 선택 입력을 서버에서 보충 |
| `description` | text | NOT NULL DEFAULT '', 길이 0~2000 CHECK |
| `image_path` | text | NULL 허용, records/{record-id}/{file-id}.{ext} |
| `created_at` | timestamptz | NOT NULL DEFAULT now(), 폼 입력 제외 |
| `updated_at` | timestamptz | NOT NULL DEFAULT now(), BEFORE UPDATE 트리거 |

- 정렬 `created_at DESC, id DESC`와 대응 인덱스.
- 10건씩 `count`/`range`로 DB 조회. 전체를 가져와 브라우저에서 자르지 않는다.
- page 기본 1. 0/음수/문자/소수는 1, 총 페이지 밖은 마지막 유효 페이지로 정규화한다.
- DB 조회 오류와 정상 빈 결과를 구분한다.
- 생성·수정·삭제 후 목록·상세를 재검증하고 새로고침에서도 DB 값을 읽는다.
- seed는 가상 자료만 사용한다. 제공된 실제 서비스 캡처·사용자 이름을 DB로 수집하지 않는다.

## 서버 연결과 권한

서버 전용 `lib/supabase/server.ts`의 SDK를 Server Components/Server Actions에서 호출한다. 별도 백엔드 서버는 생성하지 않는다. `SUPABASE_URL`과 `SUPABASE_SECRET_KEY`는 서버 전용이다.

새 과제 ref를 연결 문서와 코드의 허용 대상으로 확정한 뒤 URL/ref를 대조한다. 미등록·불일치면 모든 DB/Storage 작업을 시작하지 않는다. 비밀 키·원문 오류의 민감한 내용을 화면·로그에 출력하지 않는다.

로그인과 사용자별 정책은 미션 7 범위다. 기본 RLS 거부 상태를 유지하고 공개 anon CRUD 정책을 만들지 않으며 서버 비밀 키로 과제 데이터만 처리한다. 이 키는 RLS를 우회하므로 mutation에서 입력·UUID·경로를 검증한다. 서버 경유는 사용자 인증을 대신하지 않으며 공용 기록을 모든 방문자가 바꿀 수 있다.

공식 근거: [Supabase 데이터 보안](https://supabase.com/docs/guides/database/secure-data).

## 사진 저장과 실패 처리

- 버킷 `work-record-images`: private, image/jpeg·image/png·image/webp, 최대 3 MiB(3,145,728 bytes).
- 원본 파일명 대신 UUID 경로를 만들고 overwrite/upsert를 쓰지 않는다.
- DB의 경로로 서버에서 제한시간 다운로드 URL을 발급한다. URL 자체는 DB에 저장하지 않는다.
- 사진 포함 폼은 Server Action에서 처리한다. 기본 본문 제한은 1MB이므로 구현 시 `bodySizeLimit` 4MB를 설정하고 파일 자체는 3 MiB로 검사한다. Vercel 요청 본문 제한과 multipart 여유를 고려한 값이다.
- 사진 없음은 정상 대체 영역과 안내로 표시한다.
- 생성: 검증 → 새 파일 업로드(있는 경우) → DB insert. insert 실패 시 새 파일 보상 삭제를 시도한다.
- 수정: 새 파일 업로드 → DB update → 성공 후 이전 파일 삭제. update 실패 시 새 파일을 정리하고 이전 레코드/사진을 유지한다.
- 사진 제거: DB 경로를 비운 후 파일 정리. 레코드 삭제: DB 삭제 성공 후 연결 파일 정리.
- DB 성공 후 파일 정리 실패는 별도로 기록한다. 비밀 정보 없이 과제 UUID/경로를 남겨 후속 정리하며 DB/Storage가 원자적이라고 가정하지 않는다.
- 보상 삭제도 과제 프로젝트와 검증한 UUID 경로만 대상으로 한다.

공식 근거: [Next.js Server Actions 설정](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions), [Vercel 함수 제한](https://vercel.com/docs/functions/limitations), [Supabase 파일 제한](https://supabase.com/docs/guides/storage/uploads/file-limits).

내부 `storage_cleanup_tasks`는 id, record_id, image_path(unique), reason, attempts, created_at을 저장하고 `cleanup:images`로 재시도한다. 현재 레코드가 참조하는 사진은 삭제하지 않는다. 두 번째 SQL에서 비공개 버킷과 내부 테이블을 생성했다.

경로는 요청별 새 UUID로 만들고 재사용하지 않는다. 응답 유실 시 실제 저장/참조 상태를 다시 확인한다. 수정/삭제는 읽은 updated_at 조건으로 실행한다. 사진 URL은 600초이며 응답 실패 시 재조회 버튼을 제공한다. [Supabase 서명 URL](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl), [파일 삭제](https://supabase.com/docs/reference/javascript/storage-from-remove).

## UI·상태·디자인

공통 UI는 `RecordForm`, `RecordCard`, `RecordPagination`, `DeleteRecordDialog`, `RecordImage`, 필드 오류·저장 버튼으로 나눈다. 기존 shadcn Button/Card와 필요한 Input/Textarea/Label/AlertDialog/Skeleton을 사용한다.

조회 대기는 `loading.tsx`, 예상치 못한 실패는 `error.tsx`, 없는 ID는 `not-found.tsx`로 처리한다. 0건은 정상 빈 상태다. 저장/삭제 중 버튼을 비활성화하고 실패 시 입력을 보존한다. 삭제 다이얼로그는 취소·키보드·포커스 복귀를 제공한다.

320px·375px와 데스크톱에서 폼·CTA·페이지 탐색을 확인했다. 자체 호스팅 Pretendard Variable, Primary #2563EB, Text #0F172A, Surface #F8FAFC와 흰 배경을 적용했다. 목록은 사진 썸네일과 설명, 상세는 잘리지 않는 사진을 설명보다 먼저 표시한다.

2묶음에서 실제 서비스 링크·분석·문의 연동을 제거하고 내부 CTA의 데모 랜딩으로 바꿨다. 4묶음에서 문제·제품 흐름·기대효과·과제 체험 CTA로 랜딩을 구성했다. [제품 자료 반영 기준](mission6-reference-alignment.md)을 따른다.

현재는 새 과제 클라우드 Supabase에 연결한다. 등록 모드는 코드의 허용 주소와 일치해야 하며 Vercel에서는 로컬 모드를 거절한다. 별도 Docker 스택/API 56321은 개발용으로 보관한다. 2026-10-21 클라우드 DB/Storage 7개 및 로컬 최종 빌드 브라우저 11개 검사를 통과했다.

사용자가 새 무료 조직을 만들고 과제 전용 프로젝트 생성을 승인했다. 운영 프로젝트 재사용·중지·삭제나 유료 결제를 자동으로 진행하지 않는다.

## 4묶음과 완료 기준

| 묶음 | 작업 | 완료 기준 |
|---|---|---|
| 1 | 별도 클론·브랜치, 자원 경계, 기능·화면·테이블·검증 명세 | Git/설정/문서 점검, 기존 서비스·미션 5 변경 없음 |
| 2 | 실제 링크 먼저 제거, 새 Supabase·SQL·조회/등록/상세/페이지네이션 | 실제 DB 등록 → 목록 → 상세 → 새로고침 유지 |
| 3 | 수정·삭제, 사진 업로드·교체·정리, pending·검증·예외 | 텍스트/사진 전체 CRUD, 실패 시 정합성 |
| 4 | 랜딩/기록 화면·클라우드 Supabase·별도 Vercel 배포·QA 완료 | 공개 배포 브라우저 11개 통과, 코드·문서 브랜치 관리 |

2묶음에서 텍스트 영속성을 먼저 확인하고 3묶음에서 같은 폼에 사진을 붙인다. 다음 묶음은 사용자가 요청한 뒤 진행한다.

## 기본 요구사항 대응

| 요구사항 | 설계 근거 |
|---|---|
| 1 핵심 명세 | 작업기록 1기능·입력·행동·성공·실패 |
| 2 데이터 구조 | UUID·필수값·시각·새 자원 연결·컨텍스트 |
| 3 CRUD | 서버 조회와 등록·수정·삭제 Actions |
| 4 라우팅·페이지네이션 | 동적 ID·공통 UI·DB 10건 조회 |
| 5 검증·상태 | 서버 검증·pending·loading/error/empty/not-found |
| 6 파일 | private Storage·1사진·형식/크기·실패 절차 |
| 7 배포·환경 변수 | 새 Vercel·비밀값 Git 제외·배포 전체 흐름 |
| 8 QA·문서 | mission6-qa·README의 실행법/구조/URL/결과 |

검색·정렬 쿼리, 무한 스크롤, 낙관적 업데이트, 여러 사진, 관계 테이블, 동적 OG는 기본 흐름 통과 후 선택한다. 페이지네이션은 기본 요구사항이다.
