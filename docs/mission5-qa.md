# 미션 5 QA

## 로컬 코드 확인

| 항목 | 결과 | 근거 |
|---|---|---|
| Next.js App Router, Tailwind CSS, shadcn/ui 구성 | 확인 | `package.json`, `components.json`, `components/ui/` |
| 주요 섹션·재사용 UI | 확인 | `app/page.tsx`, `components/` |
| JS 인터랙션 | 확인 | 공개 배포에서 `사용 방법 보기` 클릭 후 해당 섹션 표시 |
| 이미지 대체 텍스트와 링크 역할 | 코드 확인 | 제품 사진 `alt`, 카카오톡 CTA는 `<a>`, 섹션 이동은 `<button>` |
| 제목·설명·OG 이미지 | 확인 | `app/layout.tsx`, `public/og-v2.jpg` 1200×630 |
| `npm run lint` | 통과 | 2026-09-28 로컬 실행, exit 0 |
| `npm run build` | 통과 | 2026-09-28 로컬 실행, Next.js 16.2.10 정적 빌드 |
| 로컬 HTML 응답 | 확인 | 카카오톡 CTA 4개, 해결 섹션 ID, 이미지, 메타데이터 표시 |

## 배포 환경 수동 확인

2026-09-28 `feature/mission5-landing-20260928`의 `efccd90`을 Preview로 빌드한 뒤, 별도 Vercel 프로젝트의 Production으로 승격했습니다. 공개 주소는 <https://bluecollar-landing.vercel.app/>입니다. 완료된 항목과 남은 점검을 구분합니다.

- [x] Vercel Production 배포가 Ready이고 공개 URL이 인증 없이 HTTP 200 및 미션 문구를 반환함.
- [x] 브라우저에서 첫 화면, 로고, 현장 사진이 표시됨.
- [ ] 별도 시크릿 창에서 화면과 이미지가 표시됨(인증 없는 HTTP 응답은 확인).
- [ ] 모바일 320px/375px, 데스크톱에서 가로 넘침·겹침 없음.
- [x] 사용 방법 버튼이 해결 섹션으로 이동.
- [ ] 상단·히어로·중간·하단 CTA가 카카오톡 앱/웹으로 열림(네 곳의 링크 주소는 채널 URL로 확인).
- [ ] 제품 링크가 `parancollar.com`으로 이동(링크 주소는 확인).
- [x] 페이지 자체의 브라우저 Console 오류 없음(브라우저 확장 프로그램의 메타데이터 오류는 제외).
- [ ] GitHub에 `.env.local`, API 키, `node_modules`, `.next`가 없음.
- [ ] 수정 커밋을 push하면 Vercel에 새 배포가 생성됨. Git 연결 후 수동으로 브랜치 배포를 만들었으므로 자동 배포는 아직 검증되지 않음.

## 사용자 검증과 구분

이 문서는 화면·코드 QA를 기록합니다. 기공의 실제 첫 사용, 보고 링크 활용, 2주 내 재사용은 이후 현장 검증으로 관찰하며, QA 통과를 사용자 검증 성과로 표현하지 않습니다.
