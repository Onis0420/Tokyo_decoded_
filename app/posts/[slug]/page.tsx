import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLdArticle from "@/components/seo/JsonLdArticle";
import PostBodyTD from "@/components/redesign/PostBodyTD";
import { posts } from "@/content/posts";
import { getAuthor } from "@/content/authors";
import { defaultMetadata, pageMetadata, structuredDataTemplates } from "@/content/seo";
import { absoluteUrl } from "@/lib/i18n";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 86400;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {};
  }

  const key = `posts/${post.slug}` as keyof typeof pageMetadata;
  const meta = pageMetadata[key];
  const title = meta?.title_ja ?? post.title_ja;
  const description = meta?.description_ja ?? post.excerpt_ja;
  // OG画像は記事サムネイル実写真を使う（/api/og はフォント起因の500で機能していなかった。
  // Google Discover 推奨も「テキストの多い画像を避け高品質写真を使う」）
  const ogImage = absoluteUrl(post.thumbnail);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/posts/${post.slug}`),
      languages: {
        ja: absoluteUrl(`/posts/${post.slug}`),
        en: absoluteUrl(`/en/posts/${post.slug}`),
        "x-default": absoluteUrl(`/posts/${post.slug}`),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/posts/${post.slug}`),
      images: [{ url: ogImage, width: 1536, height: 1024, alt: title }],
      locale: "ja_JP",
      alternateLocale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      site: defaultMetadata.twitterSite,
      creator: defaultMetadata.twitterCreator,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const author = getAuthor(post.author);
  const articleData = {
    ...structuredDataTemplates.articleTemplate,
    headline: post.title_ja,
    description: post.excerpt_ja,
    image: absoluteUrl(post.thumbnail),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    ...(author
      ? {
          author: {
            "@type": "Person" as const,
            name: author.name_ja,
            url: absoluteUrl(`/authors/${author.slug}`),
            jobTitle: author.role_ja,
            worksFor: { "@type": "Organization" as const, name: "Tokyo Decoded" },
          },
        }
      : {}),
    inLanguage: "ja",
  };

  const relatedPosts = getRelatedPosts(post);

  return (
    <>
      <JsonLdArticle data={articleData} />
      <PostBodyTD post={post} locale="ja" relatedPosts={relatedPosts} />
    </>
  );
}
