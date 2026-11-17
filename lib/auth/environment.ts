import "server-only";
import registration from "@/lib/analytics/mission8-project.json";
import { validateAuthConfiguration } from "./config";

export function authConfiguration() {
  return validateAuthConfiguration({ ...registration, supabaseProjectRef: process.env.MISSION8_SUPABASE_REF ?? null, confirmedNewDemoProject: Boolean(process.env.MISSION8_SUPABASE_REF) }, {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    deployed: Boolean(process.env.VERCEL),
  });
}
export function isAuthConfigured() {
  try { authConfiguration(); return true; } catch { return false; }
}
