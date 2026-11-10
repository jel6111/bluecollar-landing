# 미션 7 작업 자원 분리

기준일 2026-11-10. 1묶음에서는 새 작업 폴더/브랜치와 설계만 준비한다. 새 클라우드 자원은 아직 생성하지 않았다.

## 현재 허용 범위

| 항목 | 대상과 상태 |
|---|---|
| 저장소 | jel6111/bluecollar-landing, 공개 과제 저장소 |
| 브랜치 | feature/mission7-user-20261110, 이 브랜치만 수정/푸시 |
| 새 폴더 | C:/Users/user/Documents/Codex/2026-11-10/bluecollar-mission7 |
| 시작 커밋 | 84a7dd703af67bba5d746b9c09caef5d7a0fd9ac, 미션 6 PR #2 head |
| 앱 포트 | 3107 계획. 실행하지 않음 |
| Supabase | bluecollar-mission7-demo라는 새 프로젝트 계획. 조직/ref/키 미확정 |
| Vercel | bluecollar-mission7-demo라는 새 프로젝트 계획. 팀/ID/URL 미확정 |
| 선택 로컬 스택 | 미션 7 전용 이름과 API/DB/Studio 57321/57322/57323 계획. 생성/시작하지 않음 |
| 실제 환경 파일/연결 파일 | 없음. 기존 .env.local과 .vercel을 복사하지 않음 |

## 변경하지 않을 대상

- 실제 서비스 저장소 jel6111/parancollar와 parancollar.com, 운영 DB/Storage/Auth/Vercel/카카오톡. 키·스키마·사용자·데이터 조회도 하지 않는다.
- 미션 6 feature/mission6-crud-20261014, PR #2, ref uikvezrkmwplbslayene, Vercel prj_EmOPQD4WC4louamoefDBSXxhNqiL과 https://bluecollar-mission6-demo.vercel.app/.
- 미션 5 feature/mission5-landing-20260928, PR #1, 기존 공개 배포와 제출 파일.
- 저장소 main, 기존 제출 PDF/문서와 기존 로컬/클라우드 데이터.

미션 6에 필수 user_id나 RLS를 추가하면 기존 공용 데모가 깨지거나 기존 관리자 키 경로로 새 데이터가 보일 수 있다. 새 프로젝트에서 빈 스키마로 개발하며 데이터를 공유/복사하지 않는다. 비용/한도 문제를 운영 프로젝트 공유·중지·삭제·유료 결제로 자동 해결하지 않는다.

## 1묶음에서 적용한 차단

1. 별도 클론은 Git 추적 파일만 가져왔다. 현재 등록 JSON은 미션 7 이름, mode=unconfigured, ref=null, confirmed=false다. 기존 DB ref는 연결 설정에서 제거했다.
2. 앱/서버/빌드/등록/DB 시작·중지·마이그레이션/seed/사진 정리/DB·브라우저 검사 명령 앞에 설계 단계 가드를 둔다. 가드는 환경 파일/외부 서비스를 읽지 않고 종료한다.
3. 로컬 Supabase 설정은 새 이름/새 포트로만 준비한다. 기존 로컬 helper는 이 설정과 맞지 않아 직접 실행해도 기존 명령을 시작하기 전에 거절한다. 기존 스크립트 직접 실행/우회를 작업 절차로 사용하지 않는다.
4. launch 설정은 새 폴더/3107을 가리킨다. 실제 서버를 실행하지 않는다.
5. vercel.json에 feature/mission7-* 자동 배포 차단을 추가하고 기존 feature/mission6-* 차단도 유지한다. 기존 Vercel 설정은 변경하지 않는다.
6. .gitignore/.vercelignore의 환경 파일·백업·연결 파일·임시 자료 제외 규칙을 유지한다.

가드는 설계 단계의 오실행 방지이며 완성된 회원 기능의 보안 구현이 아니다. 이후 해당 묶음에서 새 자원을 확인하고 코드/도구를 교체한 뒤 해제한다.

## 2묶음 연결 전 확인 순서

1. 새 과제 Supabase를 만들 수 있는지, 사용자 승인된 조직/요금제/지역인지 확인한다. 기존 프로젝트 전체 목록·운영 키를 수집하지 않는다.
2. 새 프로젝트 실제 이름·ref·확인 근거를 이 문서에 기록한다. 값이 없는 환경 예시와 달리 실제 값은 Git 제외 파일에만 저장한다.
3. 미션 6 ref와 다른 새 프로젝트만 명시 등록한다. 보호된 ref/도메인/ID를 거절하도록 연결 검사를 교체한다.
4. 이메일 확인, 발신 설정/발송 제한, 소유한 테스트 수신 계정을 확인한다. 운영 SMTP나 카카오 계정을 연결하지 않는다.
5. 새 DB/Storage/Auth만 사용해 단계별 구현/검증한다. 관리 키는 일반 CRUD와 분리한다.
6. 4묶음에서 새 Vercel 팀·프로젝트 ID·환경·소스 커밋을 대조하고 비공개 환경 변수 설정 후 별도 배포한다. 기존 프로젝트 자동 배포 설정은 건드리지 않는다.

## 기존 브랜치 기준값

2026-11-10 원격 읽기 확인값:

- main: fbcd552f01aec5eb6b82205b0aad475c5ffbbacf
- 미션 5: 1e403c792345107edd67aab9fc94090b7376528b
- 미션 6: 84a7dd703af67bba5d746b9c09caef5d7a0fd9ac, PR #2 OPEN

1묶음 후 다시 대조한다. 기존 문서/SQL을 이 새 브랜치에서도 보존하며 다른 과제의 확인 결과를 현재 결과로 표시하지 않는다.
