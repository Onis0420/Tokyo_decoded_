"use client";

import { useSyncExternalStore } from "react";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";

// Cookie バナーで「拒否」を選んだ訪問者には GA を読み込まない。
// 未選択（バナー無視）の場合は従来どおり読み込む（オプトアウト方式）。
function subscribe(cb: () => void) {
  window.addEventListener("cookie-consent-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("cookie-consent-change", cb);
    window.removeEventListener("storage", cb);
  };
}

export default function AnalyticsGate({ gaId }: { gaId: string }) {
  const rejected = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem("cookie-consent") === "rejected",
    () => false,
  );
  if (!gaId || rejected) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
