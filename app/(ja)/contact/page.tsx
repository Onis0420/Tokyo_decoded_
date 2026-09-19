import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { metadataForPage } from "@/lib/i18n";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return metadataForPage("contact", "ja");
}

export default function ContactPage() {
  return <ContactForm locale="ja" />;
}
