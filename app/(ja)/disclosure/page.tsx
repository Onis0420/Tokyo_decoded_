import type { Metadata } from "next";
import LegalPage from "@/app/legal-page";
import { legalContent } from "@/content/legal";
import { metadataForPage } from "@/lib/i18n";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return metadataForPage("disclosure", "ja");
}

export default function DisclosurePage() {
  const content = legalContent.disclosure;

  return (
    <LegalPage
      locale="ja"
      title={content.pageTitle.ja}
      lastUpdated={content.lastUpdated}
      sections={Object.entries(content.sections).map(([id, section]) => ({
        id,
        heading: section.heading.ja,
        body: section.body.ja,
        items: "items" in section ? section.items.ja : undefined,
      }))}
    />
  );
}
