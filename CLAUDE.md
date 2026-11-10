@AGENTS.md

# 블루칼라 미션 7 작업 맥락

## 목적과 현재 상태

미션 6 공용 CRUD 데모를 바탕으로 회원이 **자기 기록과 사진만 관리**하도록 만드는 별도 제출 과제다. 고도화 기능은 유저 기능 하나다. 2026-11-10 현재 1묶음 설계/분리 단계이며 가입·로그인·RLS는 아직 구현하지 않았다.

기술 기반은 Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase Postgres/Storage다. 인증은 Supabase Auth의 이메일·비밀번호와 서버 세션을 사용할 계획이다. 기존 서비스와 미션 6의 Auth/DB/Storage/Vercel 설정은 재사용하지 않는다.

## 구현 순서

1. 새 폴더/브랜치·명세·사용 흐름·미연결 설정·실행 차단을 준비한다.
2. 새 과제 프로젝트 확인 후 가입·이메일 확인·로그인·로그아웃·서버 세션을 구현한다. 기록 CRUD는 소유권 제어 완료 전까지 차단한다.
3. 새 DB의 user_id와 DB/Storage RLS, 사용자 세션 기반 CRUD와 사진 정리를 연결한다.
4. 서로 다른 두 계정의 정상/실패·직접 API 접근·기존 흐름을 검증하고 별도 Vercel 배포/README/QA/PR을 준비한다.

## 보존할 기존 동작

기존 목록·등록·상세·수정·삭제, 10건 페이지네이션, 선택 제목, 참고 날짜/등록일 구분, 사진 1장, 이미지 검증/EXIF 제거, pending·실패 입력 유지·삭제 확인창을 유지한다. 미션 6의 공용 DB 클라이언트는 로그인 세션 기반으로 교체할 예정이다.

## 접근 제어 설계

- 조회·개수·변경은 인증 사용자 범위와 RLS를 적용한다.
- work_records.user_id는 auth.users.id를 참조하는 필수 UUID로 계획한다. 미션 6 DB는 변경하지 않는다.
- 사진 경로는 users/{user-id}/records/{record-id}/{file-id}.{ext}, 새 비공개 버킷은 mission7-record-images로 계획한다.
- storage_cleanup_tasks에도 user_id를 보존한다. 기록 삭제 후에도 소유자를 확인하고 정리를 재시도한다.
- 관리자 도구는 사용자 요청 경로와 분리한다. 관리 키를 기본 클라이언트로 써 RLS를 무력화하지 않는다.
- 세션 응답은 공용 캐시에 저장하지 않고 인증 callback의 next는 허용한 내부 경로만 사용한다.

## 문서와 실행

- [범위와 작업 묶음](docs/mission7-plan.md)
- [화면과 사용자 흐름](docs/mission7-user-flow.md)
- [데이터와 권한](docs/mission7-data-access.md)
- [작업 자원 분리](docs/mission7-isolation.md)
- [QA 계획과 실행 근거](docs/mission7-qa.md)

미션 7 클라우드 ID/배포 URL은 아직 없다. 실행·DB 명령은 의도적으로 차단한다. 의존성 없이 가능한 설계 검사는 `npm run check:plan`이다. 다음 묶음은 사용자 요청 후 진행한다.