import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createAuthClient } from "./server";
import { isAuthConfigured } from "./environment";
import { safeNext } from "./redirect";

// React cache is scoped to this render request; no shared user/session state.
export const currentUser = cache(async () => {
  if (!isAuthConfigured()) return null;
  // Keep cookies() outside the provider-error catch so Next's dynamic rendering
  // signal cannot be swallowed during prerendering.
  const supabase = await createAuthClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    return error ? null : data.user;
  } catch { return null; }
});

export async function requireUser(next = "/records") {
  const user = await currentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(safeNext(next))}`);
  return user;
}
