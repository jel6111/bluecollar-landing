const dayFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short",
});
/** 서버 등록 시각을 한국 날짜로 표시한다. 직접 선택한 work_date와 구분한다. */
export const registeredDay = (timestamp: string) => dayFormat.format(new Date(timestamp));
export const registeredTime = (timestamp: string) => timeFormat.format(new Date(timestamp));
