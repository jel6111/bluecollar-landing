# 미션 6 과제 전용 작업 규칙

- 작업 대상은 `jel6111/bluecollar-landing`의 `feature/mission6-crud-20261014` 브랜치와 별도 `work/bluecollar-mission6` 체크아웃이다.
- 실제 서비스 저장소 `jel6111/parancollar`, 도메인 `parancollar.com`, 실제 카카오톡 채널 및 운영 Supabase/Vercel 자원은 조회하거나 변경하지 않는다.
- 미션 5 작업 폴더, `main`, 미션 5 브랜치와 공개 Vercel 프로젝트도 이 작업에서 변경하지 않는다.
- `docs/mission6-isolation.md`, `docs/mission6-plan.md`, `docs/mission6-qa.md`를 읽고 사용자가 요청한 묶음까지만 진행한다.
- 환경 변수와 `.vercel` 연결 파일을 다른 프로젝트에서 복사하지 않는다. 새 과제용 Supabase/Vercel 식별자를 확인·기록한 뒤 연결한다.
- 2묶음에서 실제 서비스 링크·분석·문의 연동을 제거했다. 이후에도 앱의 모든 CTA는 과제 내부 경로로 유지한다.
- 로컬 Supabase는 새 `bluecollar-mission6-demo` 스택과 API 56321/DB 56322/Studio 56323만 사용한다. Docker 전체 중지나 다른 프로젝트의 작업을 금지한다.
- 2026-10-21 사용자는 새 무료 practice 조직 안에 과제 Supabase를 만들고 나머지 연결·배포까지 진행하도록 요청했다. 생성된 새 ref를 화면에서 확인·기록한 뒤에만 연결한다. 운영 프로젝트 공유/중지/변경은 하지 않는다.
- `vercel.json`의 미션 6 브랜치 자동 배포 차단을 유지하고 확인된 새 Vercel 프로젝트에만 배포한다.
- 비밀 키와 실제 데이터는 Git·문서·브라우저·로그에 기록하지 않는다. DB/Storage는 가상의 데모 자료만 저장한다.
- 로그인과 사용자별 권한은 미션 7 범위다. 미션 6에서는 서버를 경유하는 과제용 공용 CRUD만 구현한다.

- 3묶음의 CRUD/사진/파일 정리는 로컬에서 검증했다. 정리 큐의 검증된 UUID 경로만 처리하고 연결 중인 사진은 지우지 않는다.
- 사용자는 무료 클라우드 한도를 모두 사용 중이라고 설명했다. 운영 프로젝트 재사용/중지/삭제나 유료 결제를 자원 확보 수단으로 자동 실행하지 않는다.

- 사진 중심 UI는 `docs/mission6-reference-alignment.md`를 따른다. 제목은 선택이고 work_date 참고 날짜와 created_at 등록일을 구분한다.
- 2026-10-16의 Supabase 제외 범위는 2026-10-21 사용자 요청으로 갱신됐다. 새 과제용 자원에 한해 DB/Storage/환경 변수/별도 배포를 진행할 수 있다. 기존 서비스와 미션 5는 변경하지 않는다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
