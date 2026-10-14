# 미션 6 작업 자원 분리

기준일: 2026-10-14. 과제용 대상만 확인·연결하기 위한 기록이다. 실제 서비스의 환경 설정·데이터를 조회할 필요가 없다.

## 허용된 대상

| 자원 | 대상 | 상태 |
|---|---|---|
| GitHub | `jel6111/bluecollar-landing` | 공개 제출용 저장소 |
| 브랜치 | `feature/mission6-crud-20261014` | 미션 5 head `1e403c7`에서 생성 |
| 체크아웃 | `work/bluecollar-mission6` | 새 클론, 비추적 파일 복사 없음 |
| 로컬 포트 | `3106` | 실행 설정만 준비, 실행하지 않음 |
| Supabase | 새 `bluecollar-mission6-demo` | 아직 생성하지 않음 |
| Storage | 새 프로젝트의 `work-record-images` | 아직 생성하지 않음 |
| Vercel | 새 `bluecollar-mission6-demo` | 아직 생성하지 않음 |
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
| Supabase 계정/조직 | 미정 |
| Supabase 이름 | 예정: `bluecollar-mission6-demo` |
| Supabase project ref | 미발급 |
| Vercel 계정/팀 | 미정 |
| Vercel 이름 | 예정: `bluecollar-mission6-demo` |
| Vercel project ID | 미발급 |
| 미션 6 URL | 미발급 |
| 확인 날짜·근거 | 다음 묶음에서 생성 후 기록 |

## 자동 배포 차단

같은 저장소는 기존 미션 5 Vercel과 연결돼 있어 새 브랜치 푸시도 Preview를 만들 수 있다. 이 브랜치에 다음 설정을 두어 미션 6 브랜치의 자동 배포를 차단한다.

```json
{ "git": { "deploymentEnabled": { "feature/mission6-*": false } } }
```

기존 Vercel 프로젝트의 대시보드 설정은 변경하지 않는다. 차단은 새 프로젝트 확인 전까지 유지한다. 초기 미션 6 제출 배포는 확인된 새 project ID로만 수동 진행한다. 자동 배포를 도입하려면 연결된 프로젝트별 브랜치 구분을 먼저 검토한다.

공식 근거: [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).

## 1묶음 변경 범위

새 체크아웃·브랜치, README/컨텍스트/명세/QA 문서, 값 없는 환경 변수 예시, 실행 위치·포트, Git 자동 배포 차단. Supabase/Vercel 생성·연결·데이터 변경·앱 실행·배포는 진행하지 않는다.
