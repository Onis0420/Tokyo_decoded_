import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { formsContent } from "@/content/forms";
import { metadataForPage } from "@/lib/i18n";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return metadataForPage("contact", "ja");
}

export default function ContactThanksPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-[5vw] py-[clamp(64px,12vw,120px)] lg:px-10">
        <h1 className="font-jp text-4xl font-black text-ink md:text-5xl">
          {formsContent.contact.success.heading.ja}
        </h1>
        <p className="mt-5 max-w-2xl text-ink">{formsContent.contact.success.body.ja}</p>
        <Button href="/" variant="outline" className="mt-8">
          Tokyo Decoded
        </Button>
      </div>
    </section>
  );
}
