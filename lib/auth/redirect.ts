/** Only known record routes may be used as a post-authentication destination. */
export function safeNext(value: unknown): string {
  if (typeof value !== "string" || value.length > 180 || /[%\\#\s]/.test(value)) return "/records";
  const path = "/records(?:/new|/[0-9a-fA-F-]{36}(?:/edit)?)?";
  if (!new RegExp(`^${path}/?(?:\\?page=[1-9][0-9]{0,5})?$`).test(value)) return "/records";
  return value;
}
