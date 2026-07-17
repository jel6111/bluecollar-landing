import Script from "next/script";
import { SITE } from "@/lib/site";

/**
 * Google Analytics (gtag.js).
 * NEXT_PUBLIC_GA_ID가 설정된 경우에만 스크립트를 삽입한다.
 * 방문(page_view)은 gtag config가 자동 수집한다.
 */
export default function Analytics() {
  if (!SITE.gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${SITE.gaId}');
        `}
      </Script>
    </>
  );
}
