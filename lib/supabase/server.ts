import "server-only";
import { createClient } from "@supabase/supabase-js";
import registration from "./demo-project.json";
import { validateDemoConnection } from "./config";
import type { Database } from "./database.types";

export function createDemoClient() {
  const { url, secret } = validateDemoConnection(registration, {
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SECRET_KEY,
    deployed: Boolean(process.env.VERCEL),
  });
  return createClient<Database>(url, secret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
