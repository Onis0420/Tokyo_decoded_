import { posts } from "@/content/posts";
import type { Post } from "@/lib/types";

// posts は `as const` のリテラル配列なので、任意フィールド（author 等）を扱うときは Post[] に寄せる
const all: readonly Post[] = posts;

export function getPostBySlug(slug: string): Post | undefined {
  return all.find((post) => post.slug === slug);
}

export function listPosts(): readonly Post[] {
  return [...all].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function filterPostsByCategory(
  items: readonly Post[],
  categorySlug: string,
): readonly Post[] {
  if (categorySlug === "all") {
    return items;
  }

  return items.filter((post) => post.category === categorySlug);
}

function tagSet(p: Post): Set<string> {
  return new Set([...p.tags_ja, ...p.tags_en].map((t) => t.toLowerCase()));
}

function bodyText(p: Post): string {
  return Object.values(p.body).map((b) => `${b.ja} ${b.en}`).join(" ");
}

/**
 * 関連記事（主題ベース）。
 * 以前は「同カテゴリの最新3本」固定で、どの記事から見ても同じ顔ぶれだった（2026-09-07 に変更）。
 * 採点: 同カテゴリ +2 / 共通タグ1つにつき +2 / 本文中で相互にリンク +3 / 同じ著者 +1。同点は新しい順。
 */
export function getRelatedPosts(post: Post, count = 3): readonly Post[] {
  const tags = tagSet(post);
  const body = bodyText(post);
  const scored = all
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 2;
      for (const t of tagSet(p)) if (tags.has(t)) score += 2;
      if (body.includes(`/posts/${p.slug}`)) score += 3;
      if (bodyText(p).includes(`/posts/${post.slug}`)) score += 3;
      if (p.author && p.author === post.author) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || b.p.publishedAt.localeCompare(a.p.publishedAt));
  return scored.slice(0, count).map((x) => x.p);
}

export function getPrevNextPosts(slug: string): { prev: Post | null; next: Post | null } {
  const sorted = listPosts(); // newest first
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: (sorted[index + 1] as Post | undefined) ?? null, // 1つ古い記事
    next: (sorted[index - 1] as Post | undefined) ?? null, // 1つ新しい記事
  };
}

export function getPostsByAuthor(authorSlug: string): readonly Post[] {
  return listPosts().filter((p) => p.author === authorSlug);
}

/** 記事一覧の検索（タイトル・抜粋・タグ・見出しの部分一致、大文字小文字を無視） */
export function searchPosts(items: readonly Post[], q: string, locale: "ja" | "en"): readonly Post[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((p) => {
    const hay = [
      locale === "ja" ? p.title_ja : p.title_en,
      locale === "ja" ? p.excerpt_ja : p.excerpt_en,
      ...Object.values(p.bodyHeadings ?? {}).map((h) => h?.[locale] ?? ""),
      // 日英どちらのタグでも当たるようにする（「Loud Budgeting」を日本語ページで検索する等）
      ...p.tags_ja,
      ...p.tags_en,
    ].join(" ").toLowerCase();
    return hay.includes(needle);
  });
}

export const PAGE_SIZE = 12;

export function paginate<T>(items: readonly T[], page: number, size = PAGE_SIZE) {
  const total = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), total);
  return { items: items.slice((current - 1) * size, current * size), page: current, total };
}
