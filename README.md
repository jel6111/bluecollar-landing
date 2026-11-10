# 블루칼라 미션 7 회원별 작업기록

**현재는 1묶음인 설계와 작업 분리 단계입니다. 회원 기능은 아직 구현하지 않았습니다.**

미션 6의 사진 기록 CRUD를 바탕으로 이메일·비밀번호로 가입/로그인한 사용자가 자기 기록과 사진만 관리하는 제출용 MVP를 계획합니다. 실제 서비스와 미션 6 제출물을 유지하기 위해 별도 브랜치·폴더와 새 과제 자원을 사용합니다.

## 선택 기능과 이유

선택 기능은 **유저 기능**입니다. 기존 공용 데모에 기록 소유자와 접근 권한을 도입해 회원별 기록 관리를 검증합니다. 실제 사용자 성과나 운영 전환을 주장하지 않습니다.

최소 범위는 회원가입·이메일 확인·로그인·로그아웃·세션 유지·내 기록/사진 CRUD·타인 접근 차단입니다. 결제·AI·소셜 로그인·프로필 편집·탈퇴·비밀번호 재설정·팀 공유는 최소 범위에서 제외합니다.

## 설계 문서

- [기능 범위와 4개 작업 묶음](docs/mission7-plan.md)
- [유저플로우와 화면별 입출력](docs/mission7-user-flow.md)
- [테이블·DB/Storage 권한·파일 정리](docs/mission7-data-access.md)
- [과제 자원 분리와 연결 전 확인](docs/mission7-isolation.md)
- [QA 계획과 1묶음 결과](docs/mission7-qa.md)

기술 기반은 Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui와 Supabase입니다. Server Components 조회와 Server Actions 변경에 Supabase Auth와 세션/RLS를 추가할 예정입니다. 버전과 구현은 다음 묶음에서 설치된 문서·공식 안내로 확인합니다.

## 작업 위치와 단계

- 저장소: [jel6111/bluecollar-landing](https://github.com/jel6111/bluecollar-landing)
- 새 브랜치: `feature/mission7-user-20261110`
- 기준: 미션 6 제출 head `84a7dd703af67bba5d746b9c09caef5d7a0fd9ac`
- 폴더: `C:/Users/user/Documents/Codex/2026-11-10/bluecollar-mission7`
- 예정 앱 포트: `3107` / 새 과제 이름: `bluecollar-mission7-demo`
- Supabase ref, Vercel ID, 공개 배포 URL: **미생성·미확정**

1묶음에서는 클라우드 생성, 환경 변수 실제 값 설정, DB/Storage 변경, 이메일 발송, 앱 실행과 배포를 하지 않습니다. 환경 파일·키·Vercel 연결 파일을 복사하지 않았습니다. DB 등록은 미연결 상태이며 실행/DB/파일/브라우저 검사 명령에 선행 차단을 적용했습니다.

## 1묶음 검사

Node.js로 의존성 설치 없이 실행합니다.

```bash
npm run check:plan
```

문서 링크·과제 식별자·미연결 상태·환경 파일 부재·자동 배포 차단·기존 자료 보존·실행 차단을 검사합니다. 회원 기능·CRUD·배포 검증은 아닙니다. dev/start/build와 DB/파일/브라우저 검사는 다음 묶음 준비 전까지 의도적으로 실패합니다. 기존 스크립트를 직접 실행해 우회하지 않습니다.

## 사용자 시나리오

랜딩 → 회원가입 → 이메일 확인 → 로그인 → 내 기록 목록 → 등록 → 상세 → 수정·삭제 → 로그아웃. 계정 A의 목록과 기록 수에는 A의 자료만 표시하고 B의 상세/수정/삭제와 새 사진 URL 발급 요청을 차단합니다.

## 환경 변수 계획

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