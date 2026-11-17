export const views = ["landing_viewed", "signup_started", "records_viewed", "record_create_started"] as const;
export type AnalyticsView = (typeof views)[number];
export type AnalyticsEvent = AnalyticsView | "signup_submitted" | "signup_confirmed" | "record_created";

export const campaignName = "mission8_launch";
export const channels = {
  kakao: { medium: "messaging", content: "chat_intro" },
  naver_blog: { medium: "referral", content: "blog_intro" },
  instagram: { medium: "social", content: "story_intro" },
  qa: { medium: "test", content: "log_check" },
} as const;

type Channel = keyof typeof channels;
export function campaignChannel(params: URLSearchParams): Channel | null {
  const source = params.get("utm_source");
  if (!source || !Object.hasOwn(channels, source)) return null;
  const channel = channels[source as Channel];
  return params.get("utm_campaign") === campaignName &&
    params.get("utm_medium") === channel.medium &&
    params.get("utm_content") === channel.content
    ? source as Channel : null;
}

export function campaignProperties(source: string) {
  if (!Object.hasOwn(channels, source)) return {};
  const channel = channels[source as Channel];
  return { utm_source: source, utm_medium: channel.medium, utm_campaign: campaignName, utm_content: channel.content };
}

export function landingLocation(origin: string, source: string) {
  const url = new URL("/", origin);
  for (const [key, value] of Object.entries(campaignProperties(source))) url.searchParams.set(key, value);
  return url.href;
}

export const cookieNames = { consent: "m8_consent", device: "m8_device", session: "m8_session", source: "m8_source" } as const;
