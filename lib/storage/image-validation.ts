import sharp from "sharp";
import { imageInputError, MAX_IMAGE_BYTES } from "@/lib/records/image-rules";
import { recordIdSchema } from "@/lib/records/validation";
export class ImageValidationError extends Error {}
export type ValidatedImage = {
  bytes: Buffer;
  extension: "jpg" | "png" | "webp";
  contentType: string;
};
export async function validateImage(file: File): Promise<ValidatedImage> {
  const inputError = imageInputError(file);
  if (inputError) throw new ImageValidationError(inputError);
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const pipeline = sharp(bytes, {
      limitInputPixels: 25_000_000,
      failOn: "warning",
    });
    const metadata = await pipeline.metadata();
    const formats = {
      jpeg: ["image/jpeg", "jpg"],
      png: ["image/png", "png"],
      webp: ["image/webp", "webp"],
    } as const;
    const format = formats[metadata.format as keyof typeof formats];
    if (!format || format[0] !== file.type || (metadata.pages ?? 1) !== 1)
      throw new ImageValidationError(
        "파일 내용과 형식이 맞는 JPG, PNG, WebP 사진을 선택해주세요.",
      );
    // 실제 디코딩으로 손상 여부를 검사하고 방향을 적용한다. EXIF 등 메타데이터는 저장하지 않는다.
    const normalized = await pipeline.rotate().toBuffer();
    if (normalized.length > MAX_IMAGE_BYTES)
      throw new ImageValidationError(
        "처리된 사진이 3MB를 넘습니다. 더 작은 사진을 선택해주세요.",
      );
    return { bytes: normalized, contentType: format[0], extension: format[1] };
  } catch (error) {
    if (error instanceof ImageValidationError) throw error;
    throw new ImageValidationError(
      "사진을 읽을 수 없습니다. 손상되지 않은 정지 사진을 선택해주세요. 최대 2,500만 화소까지 지원합니다.",
    );
  }
}
export function validImagePath(recordId: string, path: string) {
  const parts = path.split("/");
  if (
    parts.length !== 3 ||
    parts[0] !== "records" ||
    parts[1] !== recordId ||
    !recordIdSchema.safeParse(recordId).success
  )
    return false;
  const match = parts[2].match(/^([0-9a-f-]{36})\.(jpg|png|webp)$/);
  return !!match && recordIdSchema.safeParse(match[1]).success;
}
