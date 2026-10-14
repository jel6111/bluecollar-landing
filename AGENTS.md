# 미션 6 과제 전용 작업 규칙

- 작업 대상은 `jel6111/bluecollar-landing`의 `feature/mission6-crud-20261014` 브랜치와 별도 `work/bluecollar-mission6` 체크아웃이다.
- 실제 서비스 저장소 `jel6111/parancollar`, 도메인 `parancollar.com`, 실제 카카오톡 채널 및 운영 Supabase/Vercel 자원은 조회하거나 변경하지 않는다.
- 미션 5 작업 폴더, `main`, 미션 5 브랜치와 공개 Vercel 프로젝트도 이 작업에서 변경하지 않는다.
- `docs/mission6-isolation.md`, `docs/mission6-plan.md`, `docs/mission6-qa.md`를 읽고 사용자가 요청한 묶음까지만 진행한다.
- 환경 변수와 `.vercel` 연결 파일을 다른 프로젝트에서 복사하지 않는다. 새 과제용 Supabase/Vercel 식별자를 확인·기록한 뒤 연결한다.
- 상속한 미션 5 런타임에는 실제 서비스 링크가 있다. 다음 묶음의 첫 코드 변경으로 실제 링크·분석·문의 연동을 제거하기 전에는 이 앱을 실행하거나 배포하지 않는다.
- `vercel.json`의 미션 6 브랜치 자동 배포 차단을 유지하고 확인된 새 Vercel 프로젝트에만 배포한다.
- 비밀 키와 실제 데이터는 Git·문서·브라우저·로그에 기록하지 않는다. DB/Storage는 가상의 데모 자료만 저장한다.
- 로그인과 사용자별 권한은 미션 7 범위다. 미션 6에서는 서버를 경유하는 과제용 공용 CRUD만 구현한다.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
