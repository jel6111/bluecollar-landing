import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { SITE } from "@/lib/site";
import { currentUser } from "@/lib/auth/session";
import { campaignChannel, cookieNames, landingLocation, views } from "@/lib/analytics/contract";
import { analyticsEnabled, queueEvent } from "@/lib/analytics/server";
import { recoverSignupConfirmation } from "@/lib/analytics/payload";

const command = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("consent"), allow: z.boolean() }).strict(),
  z.object({ kind: z.literal("view"), event: z.enum(views), query: z.string().max(512).optional() }).strict(),
]);
const options = { httpOnly: true, sameSite: "lax" as const, secure: SITE.url.startsWith("https:"), path: "/" };
const retention = 60 * 60 * 24 * 90;

export async function POST(request: Request) {
  if (request.headers.get("origin") !== SITE.url) return new Response(null, { status: 403 });
  if (Number(request.headers.get("content-length")) > 1024) return new Response(null, { status: 413 });
  const raw = await request.text();
  if (raw.length > 1024) return new Response(null, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return new Response(null, { status: 400 }); }
  const parsed = command.safeParse(json);
  if (!parsed.success) return new Response(null, { status: 400 });
  const data = parsed.data;
  const jar = await cookies();
  if (data.kind === "consent") {
    if (!data.allow) {
      for (const name of Object.values(cookieNames)) jar.set(name, "", { ...options, maxAge: 0 });
    } else {
      jar.set(cookieNames.consent, "yes", { ...options, maxAge: retention });
      if (!jar.has(cookieNames.device)) jar.set(cookieNames.device, randomUUID(), { ...options, maxAge: retention });
    }
    return new Response(null, { status: 204 });
  }
  if (jar.get(cookieNames.consent)?.value !== "yes") return new Response(null, { status: 204 });
  const authenticatedView = data.event === "records_viewed" || data.event === "record_create_started";
  const user = authenticatedView ? await currentUser() : null;
  if (authenticatedView && !user) return new Response(null, { status: 401 });

  const now = Date.now();
  const savedDevice = jar.get(cookieNames.device)?.value;
  const device = savedDevice && /^[a-f0-9-]{36}$/i.test(savedDevice) ? savedDevice : randomUUID();
  const storedSession = Number(jar.get(cookieNames.session)?.value);
  const session = storedSession > 0 && storedSession <= now && now - storedSession < 30 * 60_000 ? storedSession : now;
  if (device !== savedDevice) jar.set(cookieNames.device, device, { ...options, maxAge: retention });
  if (session !== storedSession) jar.set(cookieNames.session, String(session), { ...options, maxAge: retention });

  const landing = data.event === "landing_viewed";
  const incoming = landing ? campaignChannel(new URLSearchParams(data.query ?? "")) : null;
  const source = incoming ?? jar.get(cookieNames.source)?.value ?? "";
  if (incoming) jar.set(cookieNames.source, incoming, { ...options, maxAge: retention });
  if (analyticsEnabled()) {
    if (data.event === "records_viewed" && user && savedDevice === device) {
      const confirmation = recoverSignupConfirmation(user, storedSession, now);
      if (confirmation) {
        // A verified login can recover the measurement when the email link did not restore a session.
        queueEvent({ device, session: confirmation.session, source },
          { event: "signup_confirmed", userId: user.id }, confirmation.timestamp);
      }
    }
    queueEvent({ device, session, source }, { event: data.event, userId: user?.id });
  }

  return NextResponse.json({
    accepted: true,
    amplitudeConfigured: analyticsEnabled(),
    ...(landing ? { pageLocation: landingLocation(SITE.url, incoming ?? ""), trafficType: incoming === "qa" ? "qa" : "audience" } : {}),
  }, { headers: { "Cache-Control": "private, no-store" } });
}
