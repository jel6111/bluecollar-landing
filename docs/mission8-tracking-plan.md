# 블루칼라 미션 8 · Tracking Plan

작성자 정이레 · 2026-11-17 · 스키마 v1

| 이벤트 | 언제 기록하는가 | 전송 위치 | 속성 및 중복 방지 | QA |
|---|---|---|---|---|
| landing_viewed | 동의한 사용자가 랜딩을 열었을 때 | 브라우저 → Next API → Amplitude | UTM, QA 여부, 같은 기기/30분 세션당 한 번 | 동의 전 미수집, 홍보용 UTM 3종·QA 구분 |
| signup_started | 가입 화면이 열렸을 때 | 브라우저 → Next API → Amplitude | UTM, 기기/세션당 한 번 | 랜딩→가입 이동, 첫 진입 위치 확인 |
| signup_submitted | 서버에서 입력 검증 후 Supabase 가입 요청이 처리되고 확인 안내로 넘어갈 때 | 가입 Server Action → Amplitude | 기기/세션당 한 번. 신규 계정 수가 아닌 가입 요청 브라우저 집계 | 빈 값/불일치/발송 오류는 전송 없음 |
| signup_confirmed | 이메일 콜백의 세션 교환 또는 OTP 확인이 성공한 뒤 | 인증 Route Handler → Amplitude | 가명 계정 ID, 기기 ID, account_type=assignment_demo, 계정 기반 중복 방지 키 | 정상 확인 후 전송, 만료/잘못된 링크 제외 |
| records_viewed | 인증된 사용자의 작업기록 목록 조회가 성공해 화면이 열렸을 때 | 브라우저 → 인증 확인 API → Amplitude | 가명 계정 ID, 기기/세션당 한 번 | 비로그인·DB 오류 제외 |
| record_create_started | 인증된 사용자가 기록 등록 화면을 열었을 때 | 브라우저 → 인증 확인 API → Amplitude | 가명 계정 ID, 기기/세션당 한 번 | 직접 링크와 버튼 경로 확인 |
| record_created | 기록 등록이 DB에서 성공한 뒤 | 등록 Server Action → Amplitude | 가명 계정 ID, has_photo, 계정/기록 기준 중복 방지 키 | 저장 오류·수정 제외, 재전송 중복 확인 |

## 공통 속성 및 개인정보

- event_type, 수집 시간, 무작위 device ID, 30분 단위 session ID, insert_id, schema_version, traffic_type을 사용한다.
- 등록된 UTM source/medium/campaign/content 조합만 전송한다. Amplitude에서는 브라우저가 마지막으로 연 허용 캠페인을 유지한다.
- 암호화 키를 쓰는 HMAC으로 계정 식별값과 중복 방지 키를 생성한다. 이메일, 이름, 현장명, 사용자 입력 텍스트, 사진, 기록 원본 ID, 인증 파라미터, 서명 링크는 넣지 않는다. 등록 성공 여부는 클라이언트에서 위조해 전송할 수 없다.
- 가입 확인/기록 저장은 서버에서 성공 뒤 전송한다. Amplitude의 중복 방지 범위는 같은 기기의 insert_id이며, 최초 가입 코호트는 최종 집계에서도 계정 단위로 한 번 센다. 재전송 큐는 이번 수집 범위에 없다.
- 수집을 허용한 브라우저에서만 동작하며 언제든 이용 분석 설정에서 철회할 수 있다. QA는 별도 브라우저에서 QA 링크로 시작한다.

## GA4 수집

브라우저는 허용된 UTM만 포함한 랜딩 주소로 m8_landing_view를 dataLayer에 넣는다. 미션 8 전용 GTM은 해당 이벤트만 GA4 page_view로 전송한다. GTM Preview와 GA4 DebugView에서 속성을 확인하고, 확인 뒤 QA 유입을 제외한다.
