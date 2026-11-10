# 블루칼라 미션 7 회원별 작업기록

**현재는 2묶음입니다. 회원 기능을 구현하고 새 미션 7 Supabase를 연결했습니다. 실제 가입·메일 확인·로그인·새로고침 유지·로그아웃 후 접근 제한을 사용자 수동 검증으로 확인했습니다. 3묶음 CRUD/RLS와 배포는 아직 진행하지 않았습니다.**

미션 6의 사진 기록 CRUD를 바탕으로 이메일·비밀번호로 가입/로그인한 사용자가 자기 기록과 사진만 관리하는 제출용 MVP를 개발합니다. 실제 서비스와 미션 6 제출물을 유지하기 위해 별도 브랜치·폴더와 새 과제 자원을 사용합니다.

## 선택 기능과 이유

선택 기능은 **유저 기능**입니다. 기존 공용 데모에 기록 소유자와 접근 권한을 도입해 회원별 기록 관리를 검증합니다. 실제 사용자 성과나 운영 전환을 주장하지 않습니다.

최소 범위는 회원가입·이메일 확인·로그인·로그아웃·세션 유지·내 기록/사진 CRUD·타인 접근 차단입니다. 결제·AI·소셜 로그인·프로필 편집·탈퇴·비밀번호 재설정·팀 공유는 최소 범위에서 제외합니다.

## 설계 문서

- [기능 범위와 4개 작업 묶음](docs/mission7-plan.md)
- [유저플로우와 화면별 입출력](docs/mission7-user-flow.md)
- [테이블·DB/Storage 권한·파일 정리](docs/mission7-data-access.md)
- [과제 자원 분리와 연결 전 확인](docs/mission7-isolation.md)
- [QA 계획과 실행 결과](docs/mission7-qa.md)

기술 기반은 Next.js 16.4.6 App Router, React 19.2.4, TypeScript, Tailwind CSS, shadcn/ui, Supabase JS 2.117.3과 SSR 0.12.7입니다. 회원 처리는 Server Actions, 메일 확인은 Route Handler, 세션 검증은 서버 Auth 클라이언트를 사용합니다. 기록 소유권과 RLS는 3묶음 작업입니다.

## 작업 위치와 단계

- 저장소: [jel6111/bluecollar-landing](https://github.com/jel6111/bluecollar-landing)
- 새 브랜치: `feature/mission7-user-20261110`
- 기준: 미션 6 제출 head `84a7dd703af67bba5d746b9c09caef5d7a0fd9ac`
- 폴더: `C:/Users/user/Documents/Codex/2026-11-10/bluecollar-mission7`
- 앱 포트: `3107` / 새 과제 이름: `bluecollar-mission7-demo`
- Supabase ref: `nlvjybohqqkmduqcgzvj` (practice 무료 조직, Singapore). Vercel ID·공개 배포 URL은 **미확정**

2묶음에서는 앱 실행과 회원 검사만 허용합니다. 기록 DB·파일·기존 CRUD 검사 명령은 계속 차단하며, 로그인 성공 후에도 기록 화면은 다음 단계 준비 안내만 표시합니다. 기존 환경 파일과 Vercel 연결 파일은 복사하지 않았습니다.

## 실행과 검사

```bash
npm ci
npm run check:plan
npm run dev
```

새 미션 7 Supabase에 연결한 [로컬 화면](http://127.0.0.1:3107)을 실행할 수 있습니다. 이메일 가입·확인은 활성화돼 있으며 실제 가입·메일 확인·로그인을 확인했습니다. 미연결 환경에서는 외부 요청 대신 연결 준비 안내를 표시합니다.

```bash
npm run lint
npm run test:auth
npm run build
npm run test:auth:browser
```

`check:plan`은 새 대상 등록과 환경 값의 일치·Git 제외·문서·기존 자료 보존·앱 허용/데이터 명령 차단을 검사합니다. 브라우저 검사 중 실제 로그인 검사는 새 프로젝트와 테스트 계정이 없으면 **건너뜀**으로 기록합니다. 기존 미션 6 검사 결과를 재사용하지 않습니다.

브라우저 검사는 다른 앱을 재사용하지 않도록 3107 서버를 직접 시작·종료합니다. 실행 전에 이 과제의 기존 3107 서버를 종료합니다. 실제 계정 검증은 Git 제외 `.env.auth-test.local`의 `MISSION7_TEST_EMAIL`과 `MISSION7_TEST_PASSWORD`를 사용하며 비밀번호/메일 링크를 채팅이나 Git에 남기지 않습니다.

## 새 Supabase 연결 절차

1. 새 프로젝트 이름 `bluecollar-mission7-demo`, 조직과 실제 ref를 확인해 [분리 문서](docs/mission7-isolation.md)에 기록합니다. 미션 6 프로젝트를 재개하거나 재사용하지 않습니다.
2. `.env.example`을 참고해 이 폴더의 Git 제외 파일 `.env.local`에 새 URL·Publishable key와 `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3107`을 입력합니다. 관리자 키를 사용하지 않습니다.
3. 새 Auth의 이메일 확인 활성화와 로컬 `/auth/callback` 복귀 URL, 테스트 계정의 메일 수신 가능 여부를 확인합니다. 임의로 이메일 확인을 끄거나 운영 발신 설정을 가져오지 않습니다.
4. `npm run setup:auth -- <확인한-새-ref> --confirmed-new-mission7`으로 확인된 새 대상만 등록하고 앱을 다시 빌드합니다. 키는 명령 인수에 넣지 않습니다.
5. 사용자 소유 테스트 주소로 가입·메일 확인·로그인·새로고침·로그아웃 및 실패 시나리오를 확인하고 QA 결과를 기록합니다. 비밀번호나 인증 링크는 채팅과 Git에 남기지 않습니다.

## 사용자 시나리오

최종 목표는 랜딩 → 회원가입 → 이메일 확인 → 로그인 → 내 기록 목록 → 등록 → 상세 → 수정·삭제 → 로그아웃입니다. **현재 2묶음의 로그인 후 화면은 준비 안내이며 기록 CRUD는 차단합니다.** 계정 A의 목록과 기록 수에는 A의 자료만 표시하고 B의 상세/수정/삭제와 새 사진 URL 발급 요청을 차단합니다.

## 환경 변수

실제 값은 [.env.example](.env.example)에 기록하지 않습니다.

| 이름 | 용도 |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | 확인된 새 미션 7 Supabase 주소 |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | 새 프로젝트 공개용 키, 세션과 RLS를 함께 사용 |
| NEXT_PUBLIC_SITE_URL | 새 미션 7 주소와 인증 복귀 경로의 기준 |

관리자 키가 추후 격리된 설정/QA에 필요하면 별도로 관리하고 일반 사용자 CRUD에 사용하지 않습니다. 비밀번호·메일 인증 링크·토큰·키를 Git/문서/로그에 저장하지 않습니다. 공개 키와 DB/Storage 접근 권한은 구분합니다.

## 기존 제출물 보존

실제 서비스, 미션 5, [미션 6 PR #2](https://github.com/jel6111/bluecollar-landing/pull/2), 미션 6 브랜치·DB·배포와 main을 변경하지 않습니다. 이 브랜치의 docs/mission6-*와 이전 SQL은 기준 자료이며 미션 7 완료 증거로 사용하지 않습니다.

가이드에 이전 미션 번호가 혼재하지만 사용자 요청대로 작업명은 미션 7로 관리합니다. 제출 전 공식 번호를 확인합니다.
