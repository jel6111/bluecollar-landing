import { DemoHeader } from "@/components/records/DemoShell";
import { LandingHero, LandingProblem, ProductFlow, DemoInvitation } from "@/components/landing/MissionSixLanding";

export default function Home() {
  return (
    <>
      <DemoHeader />
      <main><LandingHero /><LandingProblem /><ProductFlow /><DemoInvitation /></main>
      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm leading-relaxed text-slate-600">
        블루칼라 · 미션 7 제출용 데모<br />별도 과제 계정으로 회원 기능을 체험합니다.
      </footer>
    </>
  );
}
