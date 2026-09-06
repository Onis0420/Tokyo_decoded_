import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { authors } from "@/content/authors";
import { defaultMetadata, robotsPolicy } from "@/content/seo";

type SitemapPriorityKey = keyof typeof robotsPolicy.sitemapPriorities;
type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

/**
 * 固定ページの実際の最終更新日。
 *
 * 以前は `new Date()` を入れていたため、中身が変わっていない7ページ×日英が
 * サイトマップを生成するたび「今日更新した」と申告していた。
 * 実態と食い違う lastmod はサイトマップ全体の信頼を落とし、
 * Google の「検出 - インデックス未登録」を長引かせる要因になる
 * （2026-08-09 の定例で、公開22本中11本が未クロールと判明した際に発見）。
 *
 * **ページの内容を変更したら、この日付も更新すること。**
 * 値は各ページの最終コミット日（`git log -1 --date=short -- app/<page>`）。
 */
const STATIC_PAGE_LAST_MODIFIED: Record<string, string> = {
  "": "2026-08-01",
  "/about": "2026-09-06",
  "/posts": "2026-08-01",
  "/tools": "2026-07-21",
  "/contact": "2026-06-11",
  "/privacy": "2026-06-07",
  "/disclosure": "2026-06-07",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = defaultMetadata.siteUrl;
  const staticPaths: Array<{
    path: string;
    key: SitemapPriorityKey;
    freq: ChangeFrequency;
  }> = [
    { path: "", key: "/", freq: "weekly" },
    { path: "/about", key: "/about", freq: "monthly" },
    { path: "/posts", key: "/posts", freq: "daily" },
    { path: "/tools", key: "/tools", freq: "monthly" },
    { path: "/contact", key: "/contact", freq: "yearly" },
    { path: "/privacy", key: "/privacy", freq: "yearly" },
    { path: "/disclosure", key: "/disclosure", freq: "yearly" },
  ];

  // 記事一覧とトップは新着記事で実際に変わるため、最新記事の公開日を採用する
  const latestPost = posts
    .map((p) => new Date(p.publishedAt).getTime())
    .reduce((a, b) => Math.max(a, b), 0);

  const staticLastModified = (path: string): Date => {
    if (path === "" || path === "/posts") {
      return latestPost ? new Date(latestPost) : new Date(STATIC_PAGE_LAST_MODIFIED[path]);
    }
    return new Date(STATIC_PAGE_LAST_MODIFIED[path]);
  };

  const staticPages: MetadataRoute.Sitemap = staticPaths.flatMap((page) => [
    {
      url: `${base}${page.path}`,
      lastModified: staticLastModified(page.path),
      changeFrequency: page.freq,
      priority: robotsPolicy.sitemapPriorities[page.key],
    },
    {
      url: `${base}/en${page.path}`,
      lastModified: staticLastModified(page.path),
      changeFrequency: page.freq,
      priority: robotsPolicy.sitemapPriorities[page.key],
    },
  ]);

  const postPages: MetadataRoute.Sitemap = posts.flatMap((post) => [
    {
      url: `${base}/posts/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: robotsPolicy.sitemapPriorities["/posts/[slug]"],
    },
    {
      url: `${base}/en/posts/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: robotsPolicy.sitemapPriorities["/posts/[slug]"],
    },
  ]);

  const authorPages: MetadataRoute.Sitemap = authors.flatMap((a) => {
    const latest = posts
      .filter((p) => (p as { author?: string }).author === a.slug)
      .map((p) => new Date(p.updatedAt ?? p.publishedAt).getTime())
      .reduce((x, y) => Math.max(x, y), 0);
    const lastModified = latest ? new Date(latest) : new Date(STATIC_PAGE_LAST_MODIFIED["/about"]);
    return [
      { url: `${base}/authors/${a.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
      { url: `${base}/en/authors/${a.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    ];
  });

  return [...staticPages, ...postPages, ...authorPages];
}
