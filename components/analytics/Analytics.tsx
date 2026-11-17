"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { AnalyticsView } from "@/lib/analytics/contract";

const preferenceKey = "bluecollar-mission8-analytics";
const changeEvent = "mission8-analytics-preference";

function preference() {
  try { return window.localStorage.getItem(preferenceKey) ?? ""; } catch { return ""; }
}
function subscribe(listener: () => void) {
  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", listener);
  };
}
function usePreference() {
  return useSyncExternalStore(subscribe, preference, () => "");
}
async function post(body: object) {
  return fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
  });
}

type GtmWindow = Window & { dataLayer?: Record<string, unknown>[] };
function layer() {
  const target = window as GtmWindow;
  return target.dataLayer ??= [];
}

export function AnalyticsSignal({ event, sendGa = false }: { event: AnalyticsView; sendGa?: boolean }) {
  const choice = usePreference();
  const sent = useRef(false);
  useEffect(() => {
    if (choice !== "yes" || sent.current) return;
    sent.current = true;
    void post({ kind: "view", event, ...(event === "landing_viewed" ? { query: window.location.search.slice(0, 512) } : {}) })
      .then(async (response) => {
        if (response.status !== 200 || !sendGa || preference() !== "yes") return;
        const result = await response.json();
        if (typeof result.pageLocation !== "string") return;
        layer().push({
          event: "m8_landing_view",
          m8_page_location: result.pageLocation,
          m8_page_title: "블루칼라 미션 8",
          m8_page_referrer: "",
          m8_traffic_type: result.trafficType,
        });
      })
      .catch(() => { /* The app works when analytics is unavailable. */ });
  }, [choice, event, sendGa]);
  return null;
}

export function AnalyticsControls({ amplitude, gtmId }: { amplitude: boolean; gtmId?: string }) {
  const choice = usePreference();
  const path = usePathname();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [editing, setEditing] = useState(false);
  const collect = Boolean(amplitude || gtmId);
  if (!collect) return null;

  async function change(allow: boolean) {
    setPending(true);
    setFailed(false);
    try {
      const response = await post({ kind: "consent", allow });
      if (!response.ok) throw new Error("preference");
      window.localStorage.setItem(preferenceKey, allow ? "yes" : "no");
      window.dispatchEvent(new Event(changeEvent));
      setEditing(false);
      if (!allow) window.location.reload();
    } catch { setFailed(true); }
    finally { setPending(false); }
  }

  const publicView = path === "/" || path === "/signup";
  return <>
    {path === "/" && choice === "yes" && gtmId && (
      <Script id="mission8-gtm" src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`} />
    )}
    {publicView && <AnalyticsSignal key={path} event={path === "/" ? "landing_viewed" : "signup_started"} sendGa={path === "/" && Boolean(gtmId)} />}
    <div className="mx-auto w-full max-w-5xl px-4 py-3 text-sm text-slate-600">
      {!choice || editing ? <div className="flex flex-wrap items-center gap-3">
        <span>과제 데모 개선을 위해 방문과 기능 이용 정보를 수집해도 될까요?</span>
        <button className="font-semibold text-blue-700 underline" type="button" disabled={pending} onClick={() => void change(true)}>허용</button>
        <button className="font-semibold underline" type="button" disabled={pending} onClick={() => void change(false)}>거부</button>
      </div> : <button type="button" className="underline" onClick={() => setEditing(true)}>이용 분석 설정</button>}
      {failed && <p role="alert">설정을 저장하지 못했습니다. 다시 시도해주세요.</p>}
    </div>
  </>;
}
