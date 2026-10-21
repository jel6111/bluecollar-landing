export default function CleanupNotice({
  notice,
}: {
  notice?: string | string[];
}) {
  return notice === "cleanup-pending" ? (
    <p
      role="status"
      className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"
    >
      기록 처리는 완료됐습니다. 이전 사진의 파일 정리가 지연되어 재시도 내역을
      남겼습니다.
    </p>
  ) : null;
}
