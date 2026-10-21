export const PAGE_SIZE = 10;

export function parsePage(value: string | string[] | undefined) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

export function pageWindow(page: number, pageCount: number) {
  const pages = new Set([1, pageCount]);
  for (let p = Math.max(1, page - 2); p <= Math.min(pageCount, page + 2); p++)
    pages.add(p);
  return [...pages].sort((a, b) => a - b);
}

export function listHref(page: number) {
  return `/records?page=${page}`;
}
