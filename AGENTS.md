# 미션 7 과제 전용 작업 규칙

- 사용자는 2026-11-10 유저 기능을 선택하고 **1묶음 설계와 작업 분리만** 요청했다. 회원 구현·DB 생성/변경·이메일 발송·앱 실행·배포는 다음 묶음이다.
- 저장소는 `jel6111/bluecollar-landing`, 브랜치는 `feature/mission7-user-20261110`, 폴더는 `C:/Users/user/Documents/Codex/2026-11-10/bluecollar-mission7`이다.
- 기준은 미션 6 제출 head `84a7dd703af67bba5d746b9c09caef5d7a0fd9ac`이다. 추적 파일만 새로 클론했고 이전 환경 파일/키/연결 파일은 복사하지 않는다.
- 실제 서비스 `jel6111/parancollar`, `parancollar.com`, 운영 DB/Storage/Auth/Vercel/카카오톡은 조회·연결·변경하지 않는다.
- 미션 6 브랜치·PR #2·DB ref `uikvezrkmwplbslayene`·Vercel ID `prj_EmOPQD4WC4louamoefDBSXxhNqiL`·공개 배포를 변경하지 않는다. 미션 5와 `main`도 보존한다.
- `docs/mission7-plan.md`, `docs/mission7-user-flow.md`, `docs/mission7-data-access.md`, `docs/mission7-isolation.md`, `docs/mission7-qa.md`를 읽고 해당 묶음까지만 작업한다.
- 새 과제 Supabase/Vercel의 실제 이름·조직·ref/ID를 확인·기록하기 전에는 연결하지 않는다. 미션 6 DB에 user_id/RLS를 추가하는 방식은 금지한다.
- 1묶음에서는 등록 JSON을 미연결 상태로 두고 npm의 실행/DB/파일/브라우저 검사 명령을 선행 가드로 차단한다. 기존 스크립트를 직접 실행하거나 차단을 우회하지 않는다.
- `npm run check:plan`은 네트워크/DB/도커를 사용하지 않는 설계·분리 검사다. 회원 기능이나 전체 CRUD 통과로 보고하지 않는다.
- 이메일·비밀번호 가입/이메일 확인/로그인/로그아웃, 검증한 세션과 본인 기록/사진 접근만 최소 범위다. 결제·AI·운영 카카오 로그인은 포함하지 않는다.
- 일반 사용자 CRUD는 로그인 세션의 클라이언트와 RLS를 사용한다. 미션 6의 비밀 키 기반 공용 클라이언트를 그대로 사용하지 않는다.
- 기록의 user_id는 서버가 검증한 사용자 ID다. 폼의 user_id를 신뢰하지 않는다. 목록 수·상세·수정·삭제·사진 URL 발급·정리를 모두 같은 사용자 경계로 검사한다.
- Storage는 소유자 경로와 RLS를 적용한다. 유효한 서명 URL은 만료 전 소지자가 볼 수 있으므로 URL 비밀성과 접근 권한을 구분한다.
- 실제 작업 자료를 DB로 옮기지 않는다. 테스트 기록은 가상 자료, 테스트 이메일은 사용자가 관리하는 계정만 사용한다. 비밀번호/인증 링크/토큰/키를 채팅·Git·로그에 기록하지 않는다.
- 자동 Git 배포를 차단한다. 새 과제 Vercel 확인 전에는 연결/배포/기존 프로젝트 설정 변경을 하지 않는다. main 병합은 별도 요청이 필요하다.
- 미션 6의 13/7/11개 결과를 미션 7 통과로 재사용하지 않는다. 미구현·미확인·통과를 구분한다.
- 기존 미션 5/6 문서와 SQL은 기준 자료다. 이 브랜치에서도 해당 파일을 수정하지 말고 미션 7 문서를 추가한다.
- Next.js 앱 코드 작업 전 의존성과 설치된 `node_modules/next/dist/docs/`의 관련 안내를 확인한다. 1묶음은 문서·설정·실행 차단만 변경한다.