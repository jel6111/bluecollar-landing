import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/auth/server";
import { safeNext } from "@/lib/auth/redirect";
import { trackSuccess } from "@/lib/analytics/server";
import { SITE } from "@/lib/site";

function finish(path: string) {
  const response = NextResponse.redirect(new URL(path, SITE.url), 303);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code || !/^[A-Za-z0-9_-]{10,512}$/.test(code)) return finish("/auth/error");
  try {
    const { data, error } = await (await createAuthClient()).auth.exchangeCodeForSession(code);
    if (error) return finish("/auth/error");
    if (data.user?.email_confirmed_at) await trackSuccess({ event: "signup_confirmed", userId: data.user.id });
  } catch { return finish("/auth/error"); }
  return finish(safeNext(request.nextUrl.searchParams.get("next")));
}
