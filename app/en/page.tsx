import type { Metadata } from "next";
import HomeTD from "@/components/redesign/HomeTD";
import { metadataForPage } from "@/lib/i18n";

export const dynamic = "force-static";
export function generateMetadata(): Metadata {
  return metadataForPage("home", "en");
}

export default function EnHome() {
  return <HomeTD locale="en" />;
}
