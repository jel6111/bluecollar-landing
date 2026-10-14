export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const IMAGE_ACCEPT =
  ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export function imageInputError(file: Pick<File, "size" | "type" | "name">) {
  if (file.size === 0) return "내용이 없는 사진은 올릴 수 없습니다.";
  if (file.size > MAX_IMAGE_BYTES) return "사진은 3MB 이하로 올려주세요.";
  const extension = file.name.toLowerCase().split(".").pop();
  const allowed = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
  };
  if (
    !(file.type in allowed) ||
    !allowed[file.type as keyof typeof allowed].includes(extension ?? "")
  )
    return "JPG, PNG, WebP 사진만 올릴 수 있습니다.";
  return null;
}
