# 미션 5 QA

## 로컬 코드 확인

| 항목 | 결과 | 근거 |
|---|---|---|
| Next.js App Router, Tailwind CSS, shadcn/ui 구성 | 확인 | `package.json`, `components.json`, `components/ui/` |
| 주요 섹션·재사용 UI | 확인 | `app/page.tsx`, `components/` |
| JS 인터랙션 | 코드 확인 | `사용 방법 보기`의 `scrollIntoView`; 브라우저 클릭 검증은 배포 후 |
| 이미지 대체 텍스트와 링크 역할 | 코드 확인 | 제품 사진 `alt`, 카카오톡 CTA는 `<a>`, 섹션 이동은 `<button>` |
| 제목·설명·OG 이미지 | 확인 | `app/layout.tsx`, `public/og-v2.jpg` 1200×630 |
| `npm run lint` | 통과 | 2026-09-28 로컬 실행, exit 0 |
| `npm run build` | 통과 | 2026-09-28 로컬 실행, Next.js 16.2.10 정적 빌드 |
| 로컬 HTML 응답 | 확인 | 카카오톡 CTA 4개, 해결 섹션 ID, 이미지, 메타데이터 표시 |

## 배포 환경 수동 확인

다음은 GitHub와 Vercel의 최신 커밋이 연결된 뒤 **실제 배포 URL**에서 점검합니다. 확인 전에는 완료로 표시하지 않습니다.

- [ ] Vercel Deployments의 최신 커밋이 Ready이며 제출할 운영 URL이 200을 반환함. 기존 `bluecollar-landing.vercel.app`은 2026-09-28 점검 당시 `DEPLOYMENT_NOT_FOUND`였음.
- [ ] 일반 창과 시크릿 창에서 첫 화면, 로고, 현장 사진이 표시됨.
- [ ] 모바일 320px/375px, 데스크톱에서 가로 넘침·겹침 없음.
- [ ] 사용 방법 버튼이 해결 섹션으로 이동.
- [ ] 상단·히어로·중간·하단 CTA가 실제 카카오톡 채널을 엶.
- [ ] 제품 링크가 `parancollar.com`으로 이동.
- [ ] 개발자 도구 Console 오류 없음.
- [ ] GitHub에 `.env.local`, API 키, `node_modules`, `.next`가 없음.
- [ ] 수정 커밋을 push하면 Vercel에 새 배포가 생성됨.

## 사용자 검증과 구분

이 문서는 화면·코드 QA를 기록합니다. 기공의 실제 첫 사용, 보고 링크 활용, 2주 내 재사용은 이후 현장 검증으로 관찰하며, QA 통과를 사용자 검증 성과로 표현하지 않습니다.
