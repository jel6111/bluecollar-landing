# 블루칼라 미션 8 · 유입과 첫 작업기록

미션 7의 과제용 MVP를 바탕으로 첫 기록 저장까지의 방문·가입·활동을 측정한다. 미션 8 브랜치와 전용 배포를 사용한다.

- [지표 설계서](docs/mission8-metrics.md)
- [Tracking Plan](docs/mission8-tracking-plan.md)
- [GTM·GA4와 과제용 DB 설정](docs/mission8-gtm-setup.md)
- [세 채널의 UTM 링크와 홍보 문안](docs/mission8-promotion.md)
- [미션 8 공개 배포](https://bluecollar-mission8-demo.vercel.app/)

로컬은 npm ci 후 npm run dev로 실행한다. 포트는 3108이다. npm run test:analytics, npm run test:auth, npm run check:plan, npm run lint, npm run build를 사용한다.

.env.example에 있는 미션 8 전용 설정을 .env.local 또는 전용 Vercel 환경에 넣는다. AMPLITUDE_REGION은 US 또는 EU, MISSION8_ANALYTICS_ID_SECRET은 최소 32자 난수다. GTM 미설정 시 태그를 삽입하지 않으며, Amplitude 설정이 없으면 외부 전송이 꺼진다.

전용 공개 배포에서 [Amplitude QA 이벤트 2종의 실제 수집과 Google 수집 서버의 응답을 확인했다](docs/mission8-qa.md). 전용 GTM-KTCNM9VL과 GA4 G-1YTGH76MPW를 연결했다. 동의 전/철회 후 차단, page_view 1회 전송과 주소 정리는 node scripts/check-google-collection.mjs로 재현한다. 실제 QA 트래픽이 발생하는 검사다. GA4 보고서 반영·태그 설정 화면 캡처, 새 과제 DB 연결 후 나머지 회원 이벤트 검증과 실제 홍보는 남아 있다.

미션 11에서는 두 분석 도구의 관찰 단위를 구분하고 테스트 유입을 제외한다.
