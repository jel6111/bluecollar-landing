import "server-only";
import { cookies } from "next/headers";
import { after } from "next/server";
import { cookieNames } from "./contract";
import { buildEvent, type AnalyticsContext, type EventInput } from "./payload";

export function analyticsEnabled() {
  return Boolean(process.env.AMPLITUDE_API_KEY && (process.env.MISSION8_ANALYTICS_ID_SECRET?.length ?? 0) >= 32);
}

export function queueEvent(context: AnalyticsContext, input: EventInput, timestamp = Date.now()) {
  const apiKey = process.env.AMPLITUDE_API_KEY;
  const secret = process.env.MISSION8_ANALYTICS_ID_SECRET;
  if (!apiKey || !secret || secret.length < 32) return;
  const event = buildEvent(context, input, secret, timestamp);
  const endpoint = process.env.AMPLITUDE_REGION === "EU"
    ? "https://api.eu.amplitude.com/2/httpapi" : "https://api2.amplitude.com/2/httpapi";
  after(async () => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, events: [event] }),
        signal: AbortSignal.timeout(3500),
        cache: "no-store",
      });
      if (!res.ok) console.warn("Mission 8 analytics request rejected", res.status);
    } catch { console.warn("Mission 8 analytics unavailable"); }
  });
}

export async function trackSuccess(input: EventInput) {
  if (!analyticsEnabled()) return;
  try {
    const jar = await cookies();
    const device = jar.get(cookieNames.device)?.value;
    const session = Number(jar.get(cookieNames.session)?.value);
    if (jar.get(cookieNames.consent)?.value !== "yes" || !device ||
        !/^[a-f0-9-]{36}$/i.test(device) || !Number.isSafeInteger(session) ||
        session <= 0 || session > Date.now()) return;
    // A callback within the 90-day consent window can outlive the original browsing session.
    const activeSession = Date.now() - session < 30 * 60_000 ? session : Date.now();
    queueEvent({ device, session: activeSession, source: jar.get(cookieNames.source)?.value ?? "" }, input);
  } catch { /* Analytics never interferes with account or record actions. */ }
}
