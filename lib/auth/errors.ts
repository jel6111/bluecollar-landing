import { AuthConfigurationError } from "./config";

export function authErrorMessage(error: unknown): string {
  if (error instanceof AuthConfigurationError) return error.message;
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (["over_email_send_rate_limit", "over_request_rate_limit"].includes(code)) {
    return "요청이 많아 잠시 기다려야 합니다. 잠시 후 다시 시도해주세요.";
  }
  if (code === "email_not_confirmed") return "가입한 이메일의 확인 링크를 먼저 열어주세요.";
  if (code === "invalid_credentials") return "이메일과 비밀번호를 확인해주세요.";
  if (code === "email_address_not_authorized") return "과제용 이메일 발송 설정을 확인해야 합니다. 담당자에게 문의해주세요.";
  if (code === "signup_disabled") return "현재 과제용 회원가입을 준비하고 있습니다. 잠시 후 다시 시도해주세요.";
  return "요청을 처리하지 못했습니다. 연결 상태를 확인하고 잠시 후 다시 시도해주세요.";
}
