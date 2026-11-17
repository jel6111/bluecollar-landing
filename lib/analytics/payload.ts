import { createHmac } from "node:crypto";
import { campaignProperties, type AnalyticsEvent } from "./contract";

export type AnalyticsContext = { device: string; session: number; source: string };
export type EventInput = { event: AnalyticsEvent; userId?: string; recordId?: string; hasPhoto?: boolean };

export function buildEvent(context: AnalyticsContext, input: EventInput, secret: string, timestamp: number) {
  const hash = (value: string) => createHmac("sha256", secret).update(value).digest("hex");
  const user = input.userId ? hash("user:" + input.userId) : undefined;
  let key = context.device + ":" + context.session;
  if (input.event === "signup_confirmed" && user) key = user;
  if (input.event === "record_created" && user && input.recordId) key = user + ":" + input.recordId;
  return {
    event_type: input.event,
    device_id: context.device,
    ...(user ? { user_id: user } : {}),
    session_id: context.session,
    insert_id: hash(input.event + ":" + key),
    time: timestamp,
    event_properties: {
      ...campaignProperties(context.source),
      traffic_type: context.source === "qa" ? "qa" : "audience",
      schema_version: 1,
      ...(input.event === "record_created" ? { has_photo: Boolean(input.hasPhoto) } : {}),
    },
    ...(input.event === "signup_confirmed" ? { user_properties: { account_type: "assignment_demo" } } : {}),
  };
}
