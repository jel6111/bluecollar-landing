import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authConfiguration } from "@/lib/auth/environment";
import { safeNext } from "@/lib/auth/redirect";

function privateResponse(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const protectedPath = path === "/records" || path.startsWith("/records/");
  const move = (destination: string) => {
    const redirected = NextResponse.redirect(new URL(destination, request.url), 303);
    for (const cookie of response.cookies.getAll()) redirected.cookies.set(cookie);
    return privateResponse(redirected);
  };
  let configured: ReturnType<typeof authConfiguration>;
  try { configured = authConfiguration(); }
  catch {
    return protectedPath ? move(`/login?next=${encodeURIComponent(safeNext(path + request.nextUrl.search))}`) : privateResponse(response);
  }
  const supabase = createServerClient(configured.url, configured.key, {
    cookieOptions: { httpOnly: true, sameSite: "lax", secure: configured.siteUrl.startsWith("https:"), path: "/" },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        for (const { name, value } of values) request.cookies.set(name, value);
        const previous = response.cookies.getAll();
        response = NextResponse.next({ request });
        for (const cookie of previous) response.cookies.set(cookie);
        for (const { name, value, options } of values) response.cookies.set(name, value, options);
      },
    },
  });
  let authenticated = false;
  try {
    const { data, error } = await supabase.auth.getClaims();
    authenticated = !error && Boolean(data?.claims?.sub);
  } catch { /* Fail closed; provider errors and tokens are not logged. */ }
  if (protectedPath && !authenticated) return move(`/login?next=${encodeURIComponent(safeNext(path + request.nextUrl.search))}`);
  // Group 2 intentionally has no record DB access. Pages/Actions also refuse it.
  if (authenticated && path.startsWith("/records/")) return move("/records?notice=preparing");
  return privateResponse(response);
}
export const config = { matcher: ["/", "/login", "/signup", "/auth/:path*", "/records/:path*"] };
