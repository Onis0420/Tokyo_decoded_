import type { MetadataRoute } from "next";
import { defaultMetadata } from "@/content/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? defaultMetadata.siteUrl;
  const isProduction = siteUrl === defaultMetadata.siteUrl;

  // 2026-09-20: Search Console のクロール統計で、90日間 4,360 リクエストのうち 64% が
  // `?_rsc=`（App Router のプリフェッチ用 RSC ペイロード）に使われていた。
  // HTML ではないので検索には不要。新着記事のクロールに回すため止める。
  const rscPayloads = ["/*?_rsc=", "/*&_rsc="];

  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/", disallow: rscPayloads }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
