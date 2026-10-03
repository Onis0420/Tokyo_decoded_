import type { Metadata } from "next";
import PostsListTD from "@/components/redesign/PostsListTD";
import { metadataForPage } from "@/lib/i18n";
import { posts } from "@/content/posts";
import { PAGE_SIZE } from "@/lib/posts";

export const revalidate = 3600;

type SP = { cat?: string; sort?: string; q?: string; page?: string };

// 2026-10-03: ページ送り（?page=2〜）の canonical が /posts を指していたため、
// Google は 2 ページ目以降を 1 ページ目の重複として扱い、そこにしか載らない
// 旧記事（001〜034）への経路を軽く見ていた。2 ページ目以降は自分自身を canonical にする。
// 絞り込み（?cat= / ?sort= / ?q=）は従来どおり /posts を canonical にする。
export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const base = metadataForPage("posts", "en");
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const total = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const filtered = Boolean(sp.cat || sp.sort || sp.q);
  if (page === 1 || page > total || filtered) return base;
  const langs = base.alternates?.languages as Record<string, string> | undefined;
  const withPage = (u: string | undefined) => (u ? `${u}?page=${page}` : undefined);
  return {
    ...base,
    title: `${String(base.title)} (Page ${page})`,
    alternates: {
      ...base.alternates,
      canonical: withPage(String(base.alternates?.canonical)),
      languages: langs ? { ja: withPage(langs.ja), en: withPage(langs.en) } : undefined,
    },
  };
}

export default async function EnPostsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  return <PostsListTD locale="en" params={sp} />;
}
