export default function Loading() {
  return (
    <div role="status" aria-label="작업기록 불러오는 중" className="space-y-5">
      <p className="text-slate-500">기록을 불러오고 있습니다…</p>
      <div className="h-10 w-44 animate-pulse rounded-lg bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-48 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}
