import assert from "node:assert/strict";
import test from "node:test";
import { buildEvent, recoverSignupConfirmation } from "../../lib/analytics/payload.ts";
import { campaignChannel, campaignProperties, landingLocation } from "../../lib/analytics/contract.ts";

const context = { device: "c5fdcd9b-39ae-4bd6-bea3-6ecb804617d4", session: 1794888000000, source: "kakao" };
const when = context.session + 500;
const secret = "local-test-value-not-a-real-key-5021";
const theSite = "https://bluecollar-mission8-demo.vercel.app";

test("three distinct campaign URLs retain only their known values", () => {
  for (const key of ["kakao", "naver_blog", "instagram"]) {
    assert.equal(campaignChannel(new URL(landingLocation(theSite, key)).searchParams), key);
  }
});
test("unknown, incomplete or spoofed campaign values are discarded", () => {
  for (const raw of ["utm_source=alice@example.com", "utm_source=kakao", "utm_source=__proto__"]) {
    assert.equal(campaignChannel(new URLSearchParams(raw)), null);
  }
  assert.deepEqual(campaignProperties("unknown"), {});
});
test("GA4 location excludes path, tags and sensitive query values", () => {
  const raw = new URL(landingLocation(theSite, "qa"));
  raw.searchParams.set("code", "sample-token");
  raw.searchParams.set("email", "sample@example.com");
  const target = landingLocation(theSite, campaignChannel(raw.searchParams));
  assert.equal(target.includes("sample"), false);
  assert.equal(target.includes("code"), false);
  assert.equal(new URL(target).pathname, "/");
});
test("record events serialize pseudonymous identity and only safe properties", () => {
  const event = buildEvent(context, { event: "record_created", userId: "raw-user", recordId: "raw-record", hasPhoto: true }, secret, when);
  assert.equal(event.event_properties.has_photo, true);
  assert.equal(event.event_properties.utm_source, "kakao");
  assert.doesNotMatch(JSON.stringify(event), /raw-user|raw-record/);
});
test("retries have a stable key and other records remain distinguishable", () => {
  const run = (id, time) => buildEvent(context, { event: "record_created", userId: "A", recordId: id }, secret, time).insert_id;
  assert.equal(run("one", when), run("one", when + 50));
  assert.notEqual(run("one", when), run("two", when));
});
test("QA traffic is labeled and guest events contain no user ID", () => {
  const event = buildEvent({ ...context, source: "qa" }, { event: "landing_viewed" }, secret, when);
  assert.equal(event.event_properties.traffic_type, "qa");
  assert.equal("user_id" in event, false);
  assert.equal("has_photo" in event.event_properties, false);
});

test("record view can recover the verified confirmation at its original time without adding a new confirmation key", () => {
  const confirmed = when + 60_000;
  const account = {
    id: "assignment-test-account",
    created_at: new Date(when).toISOString(),
    email_confirmed_at: new Date(confirmed).toISOString(),
  };
  const recovered = recoverSignupConfirmation(account, context.session, confirmed + 90_000);
  assert.deepEqual(recovered, { timestamp: confirmed, session: context.session });
  const input = { event: "signup_confirmed", userId: account.id };
  assert.equal(buildEvent(context, input, secret, confirmed + 500).insert_id,
    buildEvent(context, input, secret, recovered.timestamp).insert_id);
  assert.equal(recoverSignupConfirmation(account, confirmed + 10, confirmed + 90_000), null);
  assert.equal(recoverSignupConfirmation({ ...account, email_confirmed_at: undefined }, context.session, confirmed + 90_000), null);
  assert.equal(recoverSignupConfirmation(account, context.session, confirmed + 49 * 60 * 60_000), null);
});
