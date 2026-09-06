"use client";

import { useState } from "react";

export default function ShareRow({ url, title, locale }: { url: string; title: string; locale: "ja" | "en" }) {
  const [copied, setCopied] = useState(false);
  const x = `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const line = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard が使えない環境では何もしない */
    }
  };
  return (
    <div className="td-share" aria-label={locale === "ja" ? "この記事を共有" : "Share this article"}>
      <span className="td-sharel">{locale === "ja" ? "共有" : "Share"}</span>
      <a href={x} target="_blank" rel="noopener noreferrer">X</a>
      <a href={line} target="_blank" rel="noopener noreferrer">LINE</a>
      <button type="button" onClick={copy}>
        {copied ? (locale === "ja" ? "コピーしました" : "Copied") : (locale === "ja" ? "リンクをコピー" : "Copy link")}
      </button>
    </div>
  );
}
