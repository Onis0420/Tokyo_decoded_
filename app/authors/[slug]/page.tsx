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
  const title = `${author.name_ja}（${author.role_ja}） | Tokyo Decoded 編集部`;
  const description = `${author.origin_ja}出身。${author.bio_ja}`;
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/authors/${author.slug}`),
      languages: {
        ja: absoluteUrl(`/authors/${author.slug}`),
        en: absoluteUrl(`/en/authors/${author.slug}`),
        "x-default": absoluteUrl(`/authors/${author.slug}`),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/authors/${author.slug}`),
      images: [{ url: absoluteUrl(author.image), width: 400, height: 400, alt: title }],
      locale: "ja_JP",
      type: "profile",
    },
    twitter: { card: "summary", site: defaultMetadata.twitterSite },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name_ja,
    url: absoluteUrl(`/authors/${author.slug}`),
    image: absoluteUrl(author.image),
    jobTitle: author.role_ja,
    description: author.bio_ja,
    worksFor: { "@type": "Organization", name: "Tokyo Decoded", url: defaultMetadata.siteUrl },
    knowsAbout: [...author.focus_ja],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <AuthorPageTD author={author} locale="ja" />
    </>
  );
}
