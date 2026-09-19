import type { Metadata } from "next";
import HomeTD from "@/components/redesign/HomeTD";
import { metadataForPage } from "@/lib/i18n";
import { defaultMetadata } from "@/content/seo";

export const dynamic = "force-static";
export function generateMetadata(): Metadata {
  const meta = metadataForPage("home", "en");
  // app/en/layout.tsx がルートレイアウトになったため、同じ階層のこのページには
  // title.template（"%s | Tokyo Decoded"）が掛からない。インデックス済みのタイトルを
  // 動かさないよう、従来どおりの文字列を absolute で固定する（2026-09-20）。
  const title = typeof meta.title === "string" ? meta.title : null;
  return title
    ? { ...meta, title: { absolute: defaultMetadata.titleTemplate.replace("%s", title) } }
    : meta;
}

export default function EnHome() {
  return <HomeTD locale="en" />;
}
