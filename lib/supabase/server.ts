import "server-only";
import { cache } from "react";
import { createAuthClient } from "@/lib/auth/server";
import { requireUser } from "@/lib/auth/session";

const recordsClient = cache(createAuthClient);

export async function ownRecords(next?: string) {
  const user = await requireUser(next);
  return { db: await recordsClient(), userId: user.id };
}

export type OwnRecords = Awaited<ReturnType<typeof ownRecords>>;
