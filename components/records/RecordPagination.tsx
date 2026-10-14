import Link from "next/link";
import { Fragment } from "react";
import { listHref, pageWindow } from "@/lib/records/pagination";
export default function RecordPagination({
  page,
  pageCount,
}: {
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const pages = pageWindow(page, pageCount);
  const itemClass =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-bold";
  return (
    <nav
      aria-label="기록 목록 페이지"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={listHref(page - 1)}
          aria-label="이전 페이지"
          className={itemClass}
        >
          이전
        </Link>
      )}
      {pages.map((p, index) => (
        <Fragment key={p}>
          {index > 0 && p - pages[index - 1] > 1 && (
            <span className="px-1 text-slate-400" aria-hidden>
              …
            </span>
          )}
          <Link
            href={listHref(p)}
            aria-label={`${p}페이지`}
            aria-current={p === page ? "page" : undefined}
            className={`${itemClass} ${p === page ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 hover:bg-blue-50"}`}
          >
            {p}
          </Link>
        </Fragment>
      ))}
      {page < pageCount && (
        <Link
          href={listHref(page + 1)}
          aria-label="다음 페이지"
          className={itemClass}
        >
          다음
        </Link>
      )}
    </nav>
  );
}
