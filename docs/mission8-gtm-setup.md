# 미션 8 GTM·GA4 설정 및 제출 캡처

1. 미션 8 전용 GA4 속성과 웹 스트림을 생성하고 공개 과제 도메인을 입력한다. 해당 스트림 향상된 측정을 끈다.
2. 미션 8 전용 웹 GTM 컨테이너를 만든다. 데이터 영역 변수 m8_page_location, m8_page_title, m8_page_referrer, m8_traffic_type를 설정한다.
3. Google 태그에 G- 측정 ID, send_page_view=false, page_location={{m8_page_location}}, page_title={{m8_page_title}}, page_referrer={{m8_page_referrer}}를 설정한다. 다른 페이지에 실행되는 기본 All Pages 태그는 만들지 않는다.
4. GA4 이벤트 태그 이름은 page_view, 트리거는 Custom Event m8_landing_view다. page_location, page_title, page_referrer, traffic_type을 위 데이터 영역 변수를 사용해 명시한다. Google 태그를 설정 태그로 먼저 실행한다.
5. 미션 8 Vercel의 NEXT_PUBLIC_GTM_ID를 설정하고 재배포한다. Tag Assistant에서 QA 링크와 동의를 사용해 단 한 번 발화하는지 확인한다.
6. GTM 설정 화면, GA4 DebugView 수신 결과, Amplitude 이벤트 수신 결과를 각각 저장한다. 컴파일·로컬 테스트만으로 실제 수집 여부를 기록하지 않는다.

Amplitude 수집용 API Key, 리전(US 또는 EU), ID용 독립 난수 비밀값은 Vercel 서버 환경 변수에 설정한다. Amplitude 프로젝트 ID와 Google 측정 ID는 공개 과제 대상과 일치하는지 확인한다. 실제 회사/운영 분석 속성은 연결하지 않는다.

## Supabase 준비

빈 미션 8 프로젝트를 만든 뒤 기존 미션 7과 다른 ref·공개 키를 설정한다. 기록용 SQL은 supabase/migrations/20261117012818_mission7_owned_records.sql 한 파일만 미션 8의 빈 프로젝트 SQL Editor에서 실행한다. 이전 두 파일은 이 과제에 실행하지 않는다. Site URL은 미션 8 공개 주소, 추가 URL은 미션 8 /auth/callback 경로다. 외부 사용자가 가입할 수 있도록 실제 메일 수신을 확인한 뒤 홍보한다.
