import { DemoHeader, DemoNotice } from "@/components/records/DemoShell";
export default function RecordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DemoHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <DemoNotice />
        <div className="mt-8">{children}</div>
      </main>
    </>
  );
}
