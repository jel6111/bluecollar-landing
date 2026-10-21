import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
export default function DataUnavailable({
  configuration,
  message,
}: {
  configuration: boolean;
  message: string;
}) {
  return (
    <Card>
      <CardContent>
        <div role="alert">
          <h2 className="text-xl font-bold">
            {configuration
              ? "데이터 연결을 준비하고 있습니다"
              : "기록을 불러오지 못했습니다"}
          </h2>
          <p className="mt-3 text-slate-600">{message}</p>
          <p className="mt-2 text-sm text-slate-500">
            {configuration
              ? "연결이 완료되면 기록을 저장하고 다시 확인할 수 있습니다."
              : "잠시 후 페이지를 다시 열어주세요."}
          </p>
        </div>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/">데모 첫 화면으로</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
