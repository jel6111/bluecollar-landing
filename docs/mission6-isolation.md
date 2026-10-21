# 미션 6 작업 자원 분리

기준일: 2026-10-14. 과제용 대상만 확인·연결하기 위한 기록이다. 실제 서비스의 환경 설정·데이터를 조회할 필요가 없다.

## 허용된 대상

| 자원 | 대상 | 상태 |
|---|---|---|
| GitHub | `jel6111/bluecollar-landing` | 공개 제출용 저장소 |
| 브랜치 | `feature/mission6-crud-20261014` | 미션 5 head `1e403c7`에서 생성 |
| 체크아웃 | `work/bluecollar-mission6` | 새 클론, 비추적 파일 복사 없음 |
| 로컬 포트 | `3106` | 3묶음 최종 빌드 앱·브라우저 검증 |
| Supabase | `practice · FREE` / `bluecollar-mission6-demo` | 2026-10-21 새 클라우드 생성·연결. 로컬 전용 스택도 별도 보관 |
| Storage | 새 클라우드 프로젝트의 `work-record-images` | 비공개·3 MiB·JPEG/PNG/WebP, 가상 사진만 저장 |
| Vercel | 새 `bluecollar-mission6-demo` | 2026-10-21 Production 환경 변수·공개 배포·브라우저 11개 검사 완료 |
| 분석·문의·메시징 | 연결 없음 | 운영 계정 사용 금지 |

## 보호할 기존 대상

- 실제 서비스: `jel6111/parancollar`, `parancollar.com`, 실제 카카오톡 채널, 운영 Supabase/Storage/Vercel.
- 미션 5: `work/bluecollar-landing`, `feature/mission5-landing-20260928`, PR #1, Vercel 프로젝트 `bluecollar-landing`과 공개 URL.
- 제출용 저장소의 `main`.

기존 대상에 미션 6 코드·환경 변수·스키마·데모 데이터·배포를 적용하지 않는다. `main` 병합은 별도 사용자 요청이 필요하다.

## 연결 전 순서

1. 새 자원을 과제용 이름으로 만든다. 기존 프로젝트를 재사용하지 않는다.
2. 이름·계정·식별자·용도를 아래에 기록한다. 비밀 키 값은 기록하지 않는다.
3. 새 Supabase ref를 서버 코드의 허용 대상으로 확정하고 URL의 ref와 대조한다. 미등록·불일치이면 DB/Storage 연결을 시작하지 않는다.
4. `.env.local`에는 새 자원의 값만 설정한다. Git 추적 제외를 확인하고 값이 출력되는 명령을 쓰지 않는다.
5. 새 체크아웃에서 새 Vercel project ID에 연결하고 `.vercel/project.json`의 ID를 기록과 대조한다.
6. 실제 서비스 링크·카카오톡 전송·분석·문의 연동을 제거한 뒤 앱을 실행한다.
7. DB 변경·업로드·삭제·배포 직전에 허용된 프로젝트와 데모 자료인지 확인한다.

## 새 자원 기록

| 항목 | 값 |
|---|---|
| Supabase 계정/조직 | `practice`, FREE, 조직 ID `dewpytfcifrdkkcnzotg` |
| Supabase 이름 | `bluecollar-mission6-demo`, NANO, Singapore |
| Supabase project ref | `uikvezrkmwplbslayene` |
| Vercel 계정/팀 | jireh project (jel6111), Hobby, account ID `team_RgDqKSqNkiDjzIrLB6qUwEOJ` |
| Vercel 이름 | `bluecollar-mission6-demo` |
| Vercel project ID | `prj_EmOPQD4WC4louamoefDBSXxhNqiL` |
| 미션 6 URL | `https://bluecollar-mission6-demo.vercel.app/` |
| 확인 날짜·근거 | 2026-10-14: 새 로컬 API/DB/Studio 포트 56321/56322/56323, 테이블 SQL 적용·브라우저 테스트 |

## 자동 배포 차단

같은 저장소는 기존 미션 5 Vercel과 연결돼 있어 새 브랜치 푸시도 Preview를 만들 수 있다. 이 브랜치에 다음 설정을 두어 미션 6 브랜치의 자동 배포를 차단한다.

```json
{ "git": { "deploymentEnabled": { "feature/mission6-*": false } } }
```

기존 Vercel 프로젝트의 대시보드 설정은 변경하지 않는다. 차단은 새 프로젝트 확인 전까지 유지한다. 초기 미션 6 제출 배포는 확인된 새 project ID로만 수동 진행한다. 자동 배포를 도입하려면 연결된 프로젝트별 브랜치 구분을 먼저 검토한다.

공식 근거: [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).

## 1묶음 당시 변경 범위

새 체크아웃·브랜치, README/컨텍스트/명세/QA 문서, 값 없는 환경 변수 예시, 실행 위치·포트, Git 자동 배포 차단. Supabase/Vercel 생성·연결·데이터 변경·앱 실행·배포는 진행하지 않는다.

## 2묶음 확인

- 실행 전에 실제 카카오톡·서비스·분석·문의 연결을 제거했다. 사이트 주소의 운영 도메인은 연결 거부 목록으로만 남아 있다.
- Docker의 새 미션 6 스택만 생성했다. 기존 컨테이너의 데이터·설정은 조회/변경하지 않았다. 중지/재시작도 `bluecollar-mission6-demo`만 지정했다.
- 새 로컬 키를 비추적 `.env.local`에 설정했다. `lib/supabase/demo-project.json`에는 키가 아닌 로컬 허용 주소와 프로젝트 이름만 있다.
- 테이블의 RLS 활성·anon 조회/등록 권한 없음·service_role 등록 권한을 새 과제 컨테이너에서 확인했다.
- 클라우드 연결 도구·CLI 로그인·브라우저 제어가 준비되지 않았다. 전체 Supabase 프로젝트 목록 조회는 자동 승인 검토가 거부해 실행하지 않았다. 운영 메타데이터를 조회하는 우회 없이 로컬 Supabase로 핵심 흐름을 검증했다.
- Vercel 연결 파일·새 프로젝트·배포 URL은 아직 없다. 브랜치 자동 배포 차단은 유지한다.

## 3묶음 확인

- 같은 새 로컬 DB에 두 번째 마이그레이션으로 비공개 사진 버킷과 내부 정리 테이블만 추가했다.
- 테스트는 생성한 UUID/해당 Storage 폴더만 정리했다. 빈 목록은 기본 가상 예시 두 건만 임시 분리하고 원본 필드·사진 경로를 복원했다.
- 연결 실패 UI는 앱 프로세스에 잘못된 테스트 키를 적용해 검사했다. 원본 환경 파일·Supabase 키·다른 프로젝트 설정은 바꾸지 않았고 정상 앱으로 복귀했다.
- 가상 예시 2건과 코드로 만든 가상 사진 1장만 준비했다. 실제 서비스 캡처를 DB/Storage로 수집하지 않았다.
- 클라우드/Vercel 배포·무료 프로젝트 확보·main 병합은 진행하지 않았다.

## 2026-10-16 현재 작업 범위

운영 프로젝트 공유/일시정지/유료 전환 논의는 보류했다. 사용자는 Supabase를 제외한 문서 정리·코드 검증·미션 6 브랜치 커밋/푸시를 요청했다. 등록 정보·환경 변수·DB/Storage·Vercel·자동 배포 차단은 변경하지 않는다. 제공된 제품 자료는 화면/용어 참고로만 사용했다.

## 2026-10-21 새 자원 준비

사용자가 새 무료 practice 조직에 과제 Supabase를 만들고 나머지 연결·배포를 진행하도록 요청했다. 조직 ID dewpytfcifrdkkcnzotg, 화면 요금제 FREE를 확인했다. 사용자가 비밀번호 입력과 생성 제출을 직접 완료했다. 새 이름과 ref `uikvezrkmwplbslayene`, Healthy 상태를 화면에서 확인한 뒤 등록했다. Data API 활성/새 테이블 자동 노출 해제/자동 RLS 활성으로 생성했다.

새 프로젝트 SQL Editor에서 저장소의 마이그레이션 2개를 실행하고 성공을 확인했다. 서버 연결 검사 통과, 가상 예시 2건·가상 사진 1장 준비, 실제 클라우드 DB/Storage 검사 7개 통과. 기존 로컬 환경은 Git 제외 백업에 보관하고 `.env.local`을 새 과제 URL/서버 키로 전환했다. 키 값은 문서와 Git에 기록하지 않는다.

새 Vercel 프로젝트를 연결 도구로 생성하고 브라우저의 jireh project Hobby / bluecollar-mission6-demo 화면에서 확인했다. 연결 도구의 team 권한 부족 뒤 사용자가 CLI의 정상 로그인 승인을 직접 완료했다. CLI whoami와 project inspect에서 위 계정/팀/ID를 대조한 뒤 새 프로젝트에만 Production 환경 변수 3개를 추가했다. 서버 키는 Secret, URL은 Config다. 로컬 .vercel/project.json은 새 ID만 기록하며 Git 제외다.

수동 Production 배포를 --skip-domain으로 준비하고 서버의 과제 DB 조회를 확인한 뒤 과제 공개 주소로 승격했다. 첫 배포의 사진 교체 검사는 저장 중 5초 대기 제한을 초과했다. 앱 서버를 DB와 같은 sin1으로 지정하고 배포 검사 대기/저장 완료 이동 확인을 보정했다. 실행 코드 5631e67의 배포 dpl_75mNiLp35HnQ69JDdXbG5q7yQVBw에서 공개 브라우저 11개가 통과했다. Git 연결과 기존 프로젝트 설정은 변경하지 않았고 자동 배포 차단을 유지한다.

업로드 전 파일 목록을 검사해 로컬 환경 백업이 포함되는 것을 발견하고 .vercelignore로 차단했다. 실제 업로드 목록 93개에는 비밀값/로컬 설정이 없다. main/미션 5 원격 head도 기존 값 그대로 확인했다.
