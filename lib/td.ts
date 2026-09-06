// lib/td.ts — REDESIGN 2026-07 共通ヘルパー（サーバー安全・純関数）
import { posts, postCategories } from "@/content/posts";
import type { Post } from "@/content/types";

type Locale = "ja" | "en";

// カテゴリ slug → 色クラス（td-cm/cl/cb/cg）。posts.ts は変更せずCSS駆動で色分け
export const CAT_CLASS: Record<string, string> = {
  "money-ai": "td-cm",
  lifestyle: "td-cl",
  beauty: "td-cb",
  guides: "td-cg",
};
export function catClass(slug: string): string {
  return CAT_CLASS[slug] ?? "";
}

export function catLabel(slug: string, locale: Locale): string {
  const c = postCategories.find((x) => x.slug === slug);
  return c ? (locale === "ja" ? c.label_ja : c.label_en) : slug;
}

// 記事の「型」判定（話題カテゴリとは別軸）。データに無いためタイトルから判定する。
//
// 「まとめ・比較」はヘッダーに並ぶ他の3つ（お金・暮らし・美容）と違い、**話題ではなく型**。
// そのため post.category には入れず、ここで横断的に判定する。
// こうすると1本の記事が「お金・AI」と「まとめ・比較」の両方に出られる
// （category は単一値なので、付け替えると話題カテゴリから消えてしまう）。
//
// 「ガイド」は入れない：020「〜実践ガイド」のような解説記事まで拾ってしまうため。
// まとめ・比較記事は 比較 / ランキング / N選 / 大全 / 事典 / まとめ のいずれかを必ず含む。
const RE_COMPARISON = /(比較|ランキング|おすすめ|\d+選)/;
const RE_ROUNDUP = /(大全|まとめ|事典)/;

export function isGuide(post: Post): boolean {
  const t = post.title_ja ?? "";
  return RE_COMPARISON.test(t) || RE_ROUNDUP.test(t);
}

export function kindLabel(post: Post, locale: Locale = "ja"): string {
  const t = post.title_ja ?? "";
  const en = locale === "en";
  if (RE_COMPARISON.test(t)) return en ? "Comparison" : "比較";
  if (RE_ROUNDUP.test(t)) return en ? "Roundup" : "まとめ";
  return en ? "Explainer" : "解説";
}

export function postHref(post: Post, locale: Locale): string {
  return locale === "ja" ? `/posts/${post.slug}` : `/en/posts/${post.slug}`;
}

export function title(post: Post, locale: Locale): string {
  return locale === "ja" ? post.title_ja : post.title_en;
}
export function excerpt(post: Post, locale: Locale): string {
  return locale === "ja" ? post.excerpt_ja : post.excerpt_en;
}

export function fmtDot(date: string): string {
  return (date ?? "").slice(0, 10).replace(/-/g, ".");
}
export function fmtMd(date: string): string {
  return (date ?? "").slice(5, 10).replace(/-/g, "/");
}

// 新着（publishedAt 降順）
export function sortedPosts(): Post[] {
  return [...posts].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

// 話題カテゴリでの絞り込み。"guides" だけは型での絞り込みになる（isGuide 参照）
export function byCategory(slug: string): Post[] {
  if (slug === "guides") return sortedPosts().filter(isGuide);
  return sortedPosts().filter((p) => p.category === slug);
}

// カテゴリ別件数（ナビ・フィルタ用）
export function categoryCounts(): Record<string, number> {
  const out: Record<string, number> = { all: posts.length };
  for (const c of postCategories) {
    if (c.slug === "all") continue;
    out[c.slug] = posts.filter((p) => p.category === c.slug).length;
  }
  out.guides = posts.filter(isGuide).length;
  return out;
}

// 検索インデックス（クライアントに渡すスリムなデータ）
export type SearchItem = { t: string; c: string; u: string; k: string; cc: string };
export function buildSearchIndex(locale: Locale): SearchItem[] {
  return sortedPosts().map((p) => ({
    t: title(p, locale),
    c: catLabel(p.category, locale),
    u: postHref(p, locale),
    k: kindLabel(p, locale),
    cc: catClass(p.category),
  }));
}


/** タグの出現回数上位（トップの「人気のトピック」用。以前はハードコード） */
export function topTags(locale: Locale, n = 9): string[] {
  const count = new Map<string, number>();
  for (const p of posts) {
    for (const t of (locale === "ja" ? p.tags_ja : p.tags_en)) count.set(t, (count.get(t) ?? 0) + 1);
  }
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], locale))
    .slice(0, n)
    .map(([t]) => t);
}

/** 読了時間：日本語 約500字/分、英語 約200語/分（最低1分） */
export function readMinutes(post: Post, locale: Locale): number {
  const parts = Object.values(post.body).map((b) => b[locale]);
  const text = parts.join(" ");
  const n = locale === "ja" ? text.length / 500 : text.split(/\s+/).length / 200;
  return Math.max(1, Math.round(n));
}
