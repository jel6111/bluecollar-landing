"use client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageOff } from "lucide-react";
type Props = {
  src?: string;
  alt: string;
  hasImage: boolean;
  compact?: boolean;
};
export default function RecordImage({
  src,
  alt,
  hasImage,
  compact = false,
}: Props) {
  const [failedSource, setFailedSource] = useState<string>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const available = src && failedSource !== src;
  return (
    <div
      className={
        compact
          ? "overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          : "mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
      }
    >
      {available ? (
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={900}
          unoptimized
          className={
            compact
              ? "aspect-square w-full object-cover"
              : "max-h-[520px] w-full object-contain"
          }
          onError={() => setFailedSource(src)}
        />
      ) : (
        <div
          className={
            compact
              ? "flex aspect-square flex-col items-center justify-center gap-2 px-2 text-center text-slate-500"
              : "flex flex-col items-center gap-3 px-5 py-10 text-center text-slate-500"
          }
        >
          <ImageOff size={compact ? 22 : 28} aria-hidden />
          <p className={compact ? "text-xs" : "text-sm"}>
            {hasImage
              ? "사진을 불러오지 못했습니다."
              : "등록된 사진이 없습니다."}
          </p>
          {hasImage && !compact && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setFailedSource(undefined);
                startTransition(() => router.refresh());
              }}
              className="min-h-11 rounded-lg px-3 text-sm font-bold text-blue-600 underline focus-visible:outline-2"
            >
              {pending ? "불러오는 중…" : "사진 다시 불러오기"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
