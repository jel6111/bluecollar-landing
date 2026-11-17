# 미션 8 GTM·GA4 설정 및 제출 캡처

## GA4 속성과 웹 스트림

1. [Google 애널리틱스](https://analytics.google.com/)에서 **관리(Admin) → 만들기(Create) → 속성(Property)**을 누른다. 새 속성 이름은 블루칼라 미션 8로 한다.
2. 새 속성에서 **관리 → 데이터 수집 및 수정 → 데이터 스트림(Data streams) → 스트림 추가 → 웹(Web)**을 연다. 웹사이트 URL은 https://bluecollar-mission8-demo.vercel.app/이다.
3. 웹 스트림에서 **향상된 측정(Enhanced measurement)**을 끈 뒤 **측정 ID(Measurement ID)**를 확인한다. 값은 G-로 시작한다.

## GTM의 변수·트리거·태그

1. [Google 태그 관리자](https://tagmanager.google.com/)에서 미션 8 전용 **웹(Web) 컨테이너**를 만든다. 작업공간 상단의 GTM- 컨테이너 ID를 확인한다.
2. **변수(Variables) → 사용자 정의 변수 → 새로 만들기 → 데이터 영역 변수(Data Layer Variable)**를 4개 만든다. 변수 이름과 데이터 영역 변수 이름은 각각 아래의 같은 값으로 설정한다.

| 변수 | 값 |
|---|---|
| m8_page_location | 정리된 랜딩 URL과 허용된 UTM |
| m8_page_title | 고정 페이지 제목 |
| m8_page_referrer | 빈 문자열 |
| m8_traffic_type | qa 또는 audience |

3. **트리거(Triggers) → 새로 만들기 → 맞춤 이벤트(Custom Event)**에서 이벤트 이름을 m8_landing_view로 입력한다.
4. **태그(Tags) → 새로 만들기 → Google 태그(Google Tag)**를 만든다. 태그 ID에 G- 측정 ID를 넣고, 구성 설정에서 send_page_view를 false로 설정한다. page_location, page_title, page_referrer는 위 변수를 연결한다. 이 태그는 아래 이벤트 태그의 설정 태그로 실행한다.
5. **태그 → 새로 만들기 → Google 애널리틱스: GA4 이벤트**를 선택한다. 같은 G- ID를 넣고 이벤트 이름은 page_view로 설정한다. 트리거는 m8_landing_view다.
6. 이벤트 매개변수로 page_location, page_title, page_referrer, traffic_type에 각각 해당 m8_ 변수를 설정한다. **고급 설정 → 태그 시퀀싱**에서 이 태그 전에 4번 Google 태그를 실행하도록 선택한다.

## 공개 배포와 증빙

1. 미션 8 Vercel의 NEXT_PUBLIC_GTM_ID를 설정하고 재배포한다. 사이트 코드는 동의 후 랜딩에서 GTM을 초기화한다.
2. GTM **미리보기(Preview)**에서 [QA 전용 캠페인 링크](https://bluecollar-mission8-demo.vercel.app/?utm_source=qa&utm_medium=test&utm_campaign=mission8_launch&utm_content=log_check)를 연다. 수집을 허용한 뒤 m8_landing_view 한 건에서 page_view 태그가 실행되는지, 데이터 영역 값이 지정한 UTM과 일치하는지 확인한다.
3. GA4 **관리 → 데이터 표시 → DebugView**에서 page_view와 올바른 URL·QA 속성을 확인한다. 결과가 맞으면 GTM의 **제출(Submit) → 게시(Publish)**를 실행한다.
4. 실제 GTM 태그 설정·Preview 화면과 GA4 수집 화면, 또는 실제 CSV를 증빙 ZIP에 저장한다. 로컬 모의 태그 검사는 이 두 자료와 구분한다.

참고: [GTM 컨테이너 만들기](https://support.google.com/tagmanager/answer/14842164?hl=ko), [GA4 이벤트 태그 설정](https://support.google.com/tagmanager/answer/13034206?hl=ko), [태그 시퀀싱](https://support.google.com/tagmanager/answer/6238868?hl=ko).

Amplitude 수집용 API Key, 리전(US 또는 EU), ID용 독립 난수 비밀값은 Vercel 서버 환경 변수에 설정한다. Amplitude 프로젝트 ID와 Google 측정 ID는 공개 과제 대상과 일치하는지 확인한다. 실제 회사/운영 분석 속성은 연결하지 않는다.

## Supabase 준비

빈 미션 8 프로젝트를 만든 뒤 기존 미션 7과 다른 ref·공개 키를 설정한다. 기록용 SQL은 supabase/migrations/20261117012818_mission7_owned_records.sql 한 파일만 미션 8의 빈 프로젝트 SQL Editor에서 실행한다. 이전 두 파일은 이 과제에 실행하지 않는다. Site URL은 미션 8 공개 주소, 추가 URL은 미션 8 /auth/callback 경로다. 외부 사용자가 가입할 수 있도록 실제 메일 수신을 확인한 뒤 홍보한다.
