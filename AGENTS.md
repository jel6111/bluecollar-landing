# 블루칼라 미션 8 과제 전용 작업 규칙

- 브랜치는 feature/mission8-analytics-20261117이고 미션 7 제출 코드 294462c에서 분기했다.
- 실제 서비스와 미션 5·6·7 DB/Auth/Storage, 배포, 분석 계정, 제출 브랜치와 PR은 변경하지 않는다. 이전 환경 파일, 키와 사용자 자료는 복사하지 않는다.
- Vercel은 확인된 bluecollar-mission8-demo 프로젝트 ID prj_1T7Q6aVRGTmAUVjkOq7Rdepz3L70, Supabase와 Amplitude·GTM·GA4는 별도 과제 프로젝트만 사용한다.
- 기존 기록 정책은 비어 있는 미션 8 Supabase에서만 적용한다. 보존된 미션 6 SQL과 관리 명령은 실행하지 않는다.
- 분석은 동의 후 최소 속성만 수집한다. 가입 확인과 저장 성공은 서버에서 기록한다. 수집 여부는 Amplitude/GA4 화면에서 확인한 결과와 앱 수준 QA를 구분한다.
- QA 링크와 실제 홍보를 분리한다. 공개 모집 전에 외부 사용자의 이메일 확인·기록 사용을 검증한다.
- Git 자동 배포를 차단한다. 배포는 명시한 새 Vercel 프로젝트에만 하고 작업 브랜치만 푸시한다.
- Next.js 코드 작업 전 설치된 가이드를 읽는다.
