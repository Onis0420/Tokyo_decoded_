import Image from "next/image";
import Link from "next/link";
import { aboutContent } from "@/content/about";
import { siteContent } from "@/content/site";
import { authors } from "@/content/authors";
import type { Locale } from "@/content/types";
import { Button } from "@/components/ui/Button";

type AboutPageBodyProps = {
  locale?: Locale;
};

function externalLabel(locale: Locale) {
  return locale === "ja" ? "外部サイト" : "external site";
}

function contactHref(locale: Locale) {
  return locale === "ja"
    ? aboutContent.contactCta.link.href
    : `/en${aboutContent.contactCta.link.href}`;
}

export function AboutPageBody({ locale = "ja" }: AboutPageBodyProps) {
  const localizedSocial = siteContent.social.filter(
    (account) => account.locale === locale,
  );

  return (
    <article className="overflow-x-hidden bg-paper">
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-[clamp(64px,10vw,112px)] lg:px-10">
          <div className="max-w-4xl">
            <h1 className="font-display text-[clamp(3rem,5.2vw,5.4rem)] font-bold leading-none tracking-normal text-ink text-balance">
              {aboutContent.meta.heading[locale]}
            </h1>
            <p className="mt-7 max-w-3xl font-jp text-lg leading-loose text-ink md:text-xl">
              {aboutContent.mission.body[locale]}
            </p>
          </div>

          <div className="mt-10 max-w-5xl">
            <Image
              src="/brand/editorial-team.png"
              alt={`${siteContent.nameEn} ${aboutContent.meta.heading[locale]}`}
              width={1286}
              height={772}
              priority
              sizes="(min-width: 1024px) 70vw, 90vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-[clamp(64px,9vw,104px)] lg:px-10">
          <h2 className="max-w-3xl font-display text-[clamp(2.1rem,3vw,3.2rem)] font-bold leading-tight text-ink">
            {aboutContent.strategy.heading[locale]}
          </h2>
          <p className="mt-7 max-w-4xl font-jp text-lg leading-loose text-ink md:text-xl">
            {aboutContent.strategy.body[locale]}
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-[clamp(64px,9vw,104px)] lg:px-10">
          <h2 className="max-w-3xl font-display text-[clamp(2.1rem,3vw,3.2rem)] font-bold leading-tight text-ink">
            {aboutContent.pillarsHeading[locale]}
          </h2>

          <ul role="list" className="mt-10 grid gap-px bg-ink md:grid-cols-3">
            {aboutContent.pillars.map((pillar) => (
              <li
                key={pillar.id}
                className="bg-cream p-6 transition-colors duration-[250ms] hover:bg-paper motion-reduce:transition-none md:p-8"
              >
                <div className="flex min-h-full flex-col gap-7">
                  <div>
                    <p className="font-display text-4xl font-bold leading-none text-accent md:text-5xl">
                      {pillar.share}
                    </p>
                    <h3 className="mt-5 font-jp text-xl font-black leading-tight text-ink md:text-2xl">
                      {pillar.name[locale]}
                    </h3>
                  </div>
                  <p className="font-jp text-base leading-loose text-ink">
                    {pillar.body[locale]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-[clamp(64px,9vw,104px)] lg:px-10">
          <h2 className="font-display text-[clamp(2.1rem,3vw,3.2rem)] font-bold leading-tight text-paper">
            {aboutContent.editorialStance.heading[locale]}
          </h2>
          <ul role="list" className="mt-10 grid gap-px bg-paper md:grid-cols-3">
            {aboutContent.editorialStance.points[locale].map((point) => (
              <li key={point.label} className="bg-ink p-6 md:p-8">
                <h3 className="font-jp text-xl font-black leading-tight text-paper">
                  {point.label}
                </h3>
                <p className="mt-5 font-jp text-base leading-loose text-muted-light">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream" id="team">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-[clamp(64px,9vw,104px)] lg:px-10">
          <h2 className="font-display text-[clamp(2.1rem,3vw,3.2rem)] font-bold leading-tight text-ink">
            {aboutContent.team.heading[locale]}
          </h2>
          <p className="mt-6 max-w-4xl font-jp text-lg leading-loose text-ink">
            {aboutContent.team.body[locale]}
          </p>
          <ul role="list" className="mt-10 grid gap-px bg-ink sm:grid-cols-2 lg:grid-cols-5">
            {authors.map((a) => {
              const href = locale === "ja" ? `/authors/${a.slug}` : `/en/authors/${a.slug}`;
              return (
                <li key={a.slug} className="bg-paper">
                  <Link href={href} className="block h-full p-6 transition-colors duration-[150ms] hover:bg-cream motion-reduce:transition-none">
                    <Image
                      src={a.image}
                      alt={locale === "ja" ? a.name_ja : a.name_en}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-full border border-ink/20 object-cover"
                    />
                    <p className="mt-5 font-jp text-lg font-black leading-tight text-ink">
                      {locale === "ja" ? a.name_ja : a.name_en}
                    </p>
                    <p className="mt-1 font-sans text-xs font-bold text-accent">
                      {locale === "ja" ? a.role_ja : a.role_en}
                    </p>
                    <p className="mt-1 font-sans text-xs text-ink/70">
                      {locale === "ja" ? a.origin_ja : a.origin_en}
                    </p>
                    <p className="mt-4 font-jp text-sm leading-relaxed text-ink">
                      {(locale === "ja" ? a.focus_ja : a.focus_en).slice(0, 3).join(" / ")}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-[clamp(64px,9vw,104px)] lg:px-10">
          <h2 className="font-display text-[clamp(2.1rem,3vw,3.2rem)] font-bold leading-tight text-ink">
            {aboutContent.socialIntro.heading[locale]}
          </h2>
          <p className="mt-6 max-w-3xl font-jp text-lg leading-loose text-ink">
            {aboutContent.socialIntro.body[locale]}
          </p>
          <ul role="list" className="mt-10 grid gap-px bg-ink sm:grid-cols-2">
            {localizedSocial.map((account) => (
              <li key={account.id} className="bg-paper">
                <a
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${account.label}（${externalLabel(locale)}）`}
                  className="block px-5 py-5 font-sans text-sm font-medium text-ink transition-colors duration-[150ms] hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent motion-reduce:transition-none"
                >
                  {account.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1200px] px-[5vw] py-[clamp(64px,8vw,96px)] lg:px-10">
          <div>
            <div>
              <h2 className="max-w-3xl font-display text-[clamp(2.1rem,3vw,3.2rem)] font-bold leading-tight text-ink">
                {aboutContent.contactCta.heading[locale]}
              </h2>
              <p className="mt-6 max-w-2xl font-jp text-lg leading-loose text-ink">
                {aboutContent.contactCta.body[locale]}
              </p>
            </div>
            <Button href={contactHref(locale)} className="mt-9">
              {aboutContent.contactCta.link[`label_${locale}`]}
            </Button>
          </div>
          <Link href={locale === "ja" ? "/about" : "/en/about"} className="sr-only">
            {aboutContent.meta.heading[locale]}
          </Link>
        </div>
      </section>
    </article>
  );
}
