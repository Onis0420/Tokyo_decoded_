import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthorPageTD from "@/components/redesign/AuthorPageTD";
import { authors, getAuthor } from "@/content/authors";
import { defaultMetadata } from "@/content/seo";
import { absoluteUrl } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 86400;

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  const title = `${author.name_en} — ${author.role_en}`;
  const description = `${author.origin_en}. ${author.bio_en}`;
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/en/authors/${author.slug}`),
      languages: {
        ja: absoluteUrl(`/authors/${author.slug}`),
        en: absoluteUrl(`/en/authors/${author.slug}`),
        "x-default": absoluteUrl(`/authors/${author.slug}`),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/en/authors/${author.slug}`),
      images: [{ url: absoluteUrl(author.image), width: 400, height: 400, alt: title }],
      locale: "en_US",
      type: "profile",
    },
    twitter: { card: "summary", site: defaultMetadata.twitterSite },
  };
}

export default async function EnAuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name_en,
    url: absoluteUrl(`/en/authors/${author.slug}`),
    image: absoluteUrl(author.image),
    jobTitle: author.role_en,
    description: author.bio_en,
    worksFor: { "@type": "Organization", name: "Tokyo Decoded", url: defaultMetadata.siteUrl },
    knowsAbout: [...author.focus_en],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <AuthorPageTD author={author} locale="en" />
    </>
  );
}
