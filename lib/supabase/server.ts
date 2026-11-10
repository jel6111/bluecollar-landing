import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DemoConfigurationError } from "./config";
import type { Database } from "./database.types";

export function createDemoClient(): SupabaseClient<Database> {
  // Inherited record Actions cannot reach any DB while ownership is unfinished.
  throw new DemoConfigurationError("기록 관리는 사용자별 권한을 연결하는 3묶음에서 준비합니다.");
}
