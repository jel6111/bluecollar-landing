@AGENTS.md

# 블루칼라 미션 6 · 과제용 작업 맥락

목적은 가상의 현장 작업기록 1건의 등록 → 목록 → 상세 → 수정 → 삭제를 Next.js와 Supabase에 연결하는 제출용 데모다. 브라우저 폼에서 현장 별칭, 작업일, 제목, 설명, 사진 1장을 입력한다.

현재 3묶음의 전체 CRUD·사진 업로드/유지/교체/제거·파일 정리와 재시도를 새 로컬 Supabase에서 구현·검증했다. 클라우드 Supabase와 Vercel 배포는 아직 없다. 사용자는 무료 한도를 모두 사용 중이라고 설명했으므로 4묶음에서 별도 자원 확보를 먼저 결정한다. 다음 묶음은 사용자 요청 후 진행한다.

## 작업 대상과 보호 범위

- 원격: `https://github.com/jel6111/bluecollar-landing.git`
- 브랜치: `feature/mission6-crud-20261014`
- 시작점: 미션 5 head `1e403c792345107edd67aab9fc94090b7376528b`
- 새 체크아웃: `work/bluecollar-mission6`, 로컬 포트 `3106`
- 새 자원 예정 이름: Supabase와 Vercel 각각 `bluecollar-mission6-demo`
- 실제 서비스 및 미션 5 자원의 경계와 연결 순서는 `docs/mission6-isolation.md`를 따른다.
- 실제 서비스의 코드·데이터·환경 변수·카카오톡·분석 계정을 조회하거나 재사용하지 않는다.
- 실제 서비스 CTA, 분석 및 문의 연동을 제거했다. 모든 런타임 CTA는 과제 내부 경로다.
- 로컬 Supabase project_id는 `bluecollar-mission6-demo`, API/DB/Studio는 56321/56322/56323이다. 로컬 연결은 Vercel에서 거절한다.
- `vercel.json`의 미션 6 브랜치 자동 배포 차단을 유지한다.

## 화면과 테이블

- `/`: 과제 데모 안내와 내부 `/records` CTA.
- `/records?page=1`: 10건씩, 최신 생성순, 목록·페이지 탐색·빈 상태.
- `/records/new`: 등록 폼.
- `/records/[id]`: 상세·수정/삭제 진입·없는 ID 안내.
- `/records/[id]/edit`: 저장값을 미리 채운 수정 폼.
- `work_records`: uuid PK, `site_label`(1~80자), `work_date`(date), `title`(1~120자), `description`(0~2000자), 선택 `image_path`, DB 제어 `created_at`/`updated_at`.
- Storage `work-record-images`: private, 사진 1장, JPEG/PNG/WebP, 최대 3 MiB. 상세는 서버에서 발급한 제한시간 URL로 표시.

- 내부 `storage_cleanup_tasks`: id, record_id, image_path(unique), reason, attempts, created_at. 파일 정리 실패 재시도용, 공개 anon 권한 없음, 삭제된 기록을 위해 FK 없음.

## 구현 규칙

- Next.js 16.4 App Router, React 19, TypeScript, Tailwind 4, shadcn/ui를 활용한다. 16.2.10의 보안 문제를 이 브랜치에서 보정했다.
- Server Components에서 조회, Server Actions에서 등록·수정·삭제·사진 포함 폼을 처리한다.
- 서버 전용 Supabase 클라이언트에는 `server-only`를 사용한다. `SUPABASE_SECRET_KEY`를 브라우저에 전달하지 않는다.
- 새 과제용 Supabase ref를 연결 기록과 코드의 허용 대상으로 확정한다. URL/ref가 미등록·불일치하면 연결을 시작하지 않는다.
- 로컬은 명시 등록한 `http://127.0.0.1:56321`만 허용한다. 로컬 시작은 `npm run db:start`, 해당 프로젝트만 중지는 `npm run db:stop`이다. 키 값은 출력하지 않는다.
- 로그인·사용자별 RLS 정책은 미션 7 범위다. 테이블의 기본 RLS 거부 상태를 유지하고 공개 anon CRUD 정책을 만들지 않는다. 서버 경유 공용 데모는 모든 방문자가 기록을 변경할 수 있다는 안내를 둔다.
- 필드 trim·길이·날짜·UUID, 이미지 실제 형식·크기를 서버에서 최종 검증하고 DB에도 제약을 둔다.
- 이미지 업로드와 DB 작업은 원자적 트랜잭션이 아니다. 실패 보상과 파일 정리는 `mission6-plan`을 따른다.
- 목록 정렬은 `created_at DESC, id DESC`. 페이지를 URL에 보존하고 변경 후 목록·상세 경로를 재검증한다.
- 핵심 데이터의 최종 저장소는 Supabase다. Mock/localStorage를 최종 저장소로 쓰지 않는다.
- DB/Storage에는 가상 자료만 사용하고 이름·주소·전화번호·사람 얼굴·운영 데이터를 저장하지 않는다.
- 확인 결과는 `docs/mission6-qa.md`에 완료/미확인/실패로 구분한다. 미션 5 QA를 미션 6 통과 증거로 사용하지 않는다.
- 사용자 수요·이용 성과를 만들어 쓰지 않는다.

- 수정/삭제는 읽은 updated_at을 비교한다. 사진은 새 UUID 경로만 쓰며 현재 레코드에 연결된 파일은 정리하지 않는다.
- Sharp 실제 디코딩·방향 적용·메타데이터 제거, 정지 이미지·2,500만 화소·3 MiB 제한. 비공개 사진은 600초 URL이다.
- `db:migrate`는 전용 로컬 SQL, `cleanup:images`는 허용 과제의 정리 큐에만 적용한다. 가상 예시 2건과 코드로 만든 가상 사진 1장을 사용한다.
- 단위 12개·실제 DB/Storage 7개·브라우저 10개·빈 목록/연결 실패 UI 검사 통과. 원본 환경 값은 바꾸지 않았다.

## 문서

- 기능·화면·데이터 명세: `docs/mission6-plan.md`
- 자원 분리·식별자 확인: `docs/mission6-isolation.md`
- 단계별 QA: `docs/mission6-qa.md`
- 로컬/클라우드 연결: `docs/mission6-supabase-setup.md`
