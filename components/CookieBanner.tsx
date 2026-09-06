"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

type CookieConsent = "accepted" | "rejected";

// 2026-09-07: 画面下15%を占める全幅バナーから、右下の小さなカードに変更。
// 「拒否」を選んだ場合は AnalyticsGate が GA を読み込まない（既に読み込み済みなら ga-disable で止める）。
export default function CookieBanner() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "ja";
  const content = {
    ja: { label: "Cookieの使用に関する通知", message: "アクセス解析のため Cookie を使用します。", accept: "同意", reject: "拒否", more: "詳細" },
    en: { label: "Cookie notice", message: "We use cookies for analytics.", accept: "Accept", reject: "Reject", more: "Details" },
  }[locale];

  const consentIsMissing = useSyncExternalStore(
    () => () => undefined,
    () => {
      const consent = window.localStorage.getItem("cookie-consent");
      return consent !== "accepted" && consent !== "rejected";
    },
    () => false,
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const isVisible = consentIsMissing && !isDismissed;

  const handleConsent = (consent: CookieConsent) => {
    window.localStorage.setItem("cookie-consent", consent);
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (consent === "rejected" && gaId) {
      (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = true;
    }
    window.dispatchEvent(new Event("cookie-consent-change"));
    setIsDismissed(true);
  };

  if (!isVisible) return null;

  const btn = "rounded-none px-3 py-1.5 text-xs font-medium transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none";
  const font = locale === "ja" ? "font-jp" : "font-sans";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={content.label}
      className="fixed bottom-3 left-3 right-3 z-[600] sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-[400px] bg-ink text-paper shadow-[0_8px_30px_rgba(0,0,0,.35)] rounded-none"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className={`${font} flex-1 text-xs leading-snug text-paper`}>
          {content.message}{" "}
          <a href={locale === "ja" ? "/privacy" : "/en/privacy"} className="underline underline-offset-2 text-paper/80 hover:text-paper">{content.more}</a>
        </p>
        <button type="button" onClick={() => handleConsent("rejected")} className={`${btn} ${font} border border-paper/40 text-paper hover:border-paper`}>
          {content.reject}
        </button>
        <button type="button" onClick={() => handleConsent("accepted")} className={`${btn} ${font} bg-paper text-ink hover:bg-cream`}>
          {content.accept}
        </button>
      </div>
    </div>
  );
}
