import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/auth/server";
import { safeNext } from "@/lib/auth/redirect";
import { SITE } from "@/lib/site";

function finish(path: string) {
  const response = NextResponse.redirect(new URL(path, SITE.url), 303);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
export async function GET(request: NextRequest) {
  const token_hash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  if (!token_hash || !/^[A-Za-z0-9_-]{30,256}$/.test(token_hash) || !["signup", "email"].includes(type || "")) return finish("/auth/error");
  try {
    const { error } = await (await createAuthClient()).auth.verifyOtp({ token_hash, type: type as "signup" | "email" });
    if (error) return finish("/auth/error");
  } catch { return finish("/auth/error"); }
  return finish(safeNext(request.nextUrl.searchParams.get("next")));
}
