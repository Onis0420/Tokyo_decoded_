// components/redesign/PostsListTD.tsx — 記事一覧（日英共通・サーバー）
// 検索（?q=）とページ送り（?page=）を追加（2026-09-07）。
// 以前は 34 本を一気に描画し、SearchAction が指す /posts?q= も解釈していなかった。
import Link from "next/link";
import CardTD from "@/components/redesign/CardTD";
import type { Locale } from "@/content/types";
import { sortedPosts, categoryCounts, byCategory } from "@/lib/td";
import { searchPosts, paginate, PAGE_SIZE } from "@/lib/posts";

const CC: Record<string, string> = { all: "", "money-ai": "td-cm", lifestyle: "td-cl", beauty: "td-cb", guides: "td-cg" };

const L = {
  ja: {
    filters: [["すべて", "all"], ["お金・AI", "money-ai"], ["暮らし", "lifestyle"], ["美容", "beauty"], ["まとめ・比較", "guides"]],
    ey: "Archive", h1: "記事一覧", lead: (n: number) => `海外⇄日本のトレンドを、データと出典で読み解く。全 ${n} 記事。`,
    sortLabel: "並び替え", newest: "新着順", oldest: "古い順", disabled: "準備中（該当記事がまだありません）",
    result: (q: string, n: number) => `「${q}」の検索結果：${n}件`, clear: "検索を解除", empty: "該当する記事はありません。",
    prev: "← 前へ", next: "次へ →", pager: "ページ送り", searchPh: "記事を検索（タイトル・タグ）", search: "検索",
  },
  en: {
    filters: [["All", "all"], ["Money & AI", "money-ai"], ["Lifestyle", "lifestyle"], ["Beauty", "beauty"], ["Guides", "guides"]],
    ey: "Archive", h1: "Articles", lead: (n: number) => `Global-to-Japan trends, decoded with data and sources. ${n} articles.`,
    sortLabel: "Sort", newest: "Newest", oldest: "Oldest", disabled: "Coming soon (no articles yet)",
    result: (q: string, n: number) => `Results for “${q}”: ${n}`, clear: "Clear search", empty: "No articles match.",
    prev: "← Previous", next: "Next →", pager: "Pagination", searchPh: "Search articles (title, tags)", search: "Search",
  },
} as const;

type Params = { cat?: string; sort?: string; q?: string; page?: string };

function hrefFor(base: string, p: { cat: string; sort: string; q: string; page?: number }): string {
  const sp = new URLSearchParams();
  if (p.cat !== "all") sp.set("cat", p.cat);
  if (p.sort === "old") sp.set("sort", "old");
  if (p.q) sp.set("q", p.q);
  if (p.page && p.page > 1) sp.set("page", String(p.page));
  const s = sp.toString();
  return `${base}/posts${s ? `?${s}` : ""}`;
}

export default function PostsListTD({ locale, params }: { locale: Locale; params: Params }) {
  const base = locale === "ja" ? "" : "/en";
  const t = L[locale];
  const active = params.cat && CC[params.cat] !== undefined ? params.cat : "all";
  const sort = params.sort === "old" ? "old" : "new";
  const q = (params.q ?? "").trim().slice(0, 60);
  const pageNum = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const all = sortedPosts();
  const byCat = active === "all" ? all : byCategory(active);
  const searched = searchPosts(byCat, q, locale);
  const ordered = sort === "old" ? [...searched].reverse() : searched;
  const { items, page, total } = paginate(ordered, pageNum, PAGE_SIZE);
  const counts = categoryCounts();
  const state = { cat: active, sort, q };

  return (
    <div className="td-scope">
      <div className="td-wrap">
        <div className="td-pagehead">
          <div className="td-ey">{t.ey}</div>
          <h1>{t.h1}</h1>
          <p>{t.lead(all.length)}</p>
        </div>

        <form className="td-searchbar" action={`${base}/posts`} method="get" role="search">
          {active !== "all" ? <input type="hidden" name="cat" value={active} /> : null}
          {sort === "old" ? <input type="hidden" name="sort" value="old" /> : null}
          <input type="search" name="q" defaultValue={q} placeholder={t.searchPh} aria-label={t.searchPh} maxLength={60} />
          <button type="submit">{t.search}</button>
        </form>

        <div className="td-filterbar">
          <div className="td-fpills">
            {t.filters.map(([j, slug]) => {
              const n = slug === "all" ? all.length : counts[slug] ?? 0;
              const cls = `td-fpill ${CC[slug]} ${active === slug ? "td-on" : ""}`;
              if (slug !== "all" && n === 0) {
                return (
                  <span key={slug} className={`${cls} td-fdisabled`} aria-disabled="true" title={t.disabled}>
                    <span>{j}</span><span className="td-fc">{n}</span>
                  </span>
                );
              }
              return (
                <Link key={slug} href={hrefFor(base, { ...state, cat: slug })} className={cls}>
                  <span>{j}</span><span className="td-fc">{n}</span>
                </Link>
              );
            })}
          </div>
          <div className="td-sortsel" role="group" aria-label={t.sortLabel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M6 12h12M10 18h4" /></svg>
            <Link href={hrefFor(base, { ...state, sort: "new" })} className={`td-sortlink ${sort === "new" ? "td-on" : ""}`}>{t.newest}</Link>
            <Link href={hrefFor(base, { ...state, sort: "old" })} className={`td-sortlink ${sort === "old" ? "td-on" : ""}`}>{t.oldest}</Link>
          </div>
        </div>

        {q ? (
          <p className="td-result">
            {t.result(q, searched.length)}
            <Link href={hrefFor(base, { ...state, q: "" })} className="td-resultclear">{t.clear}</Link>
          </p>
        ) : null}

        {items.length > 0 ? (
          <div className="td-grid">
            {items.map((p, i) => <CardTD key={p.slug} post={p} locale={locale} priority={i < 3} />)}
          </div>
        ) : (
          <p className="td-empty">{t.empty}</p>
        )}

        {total > 1 ? (
          <nav className="td-pager" aria-label={t.pager}>
            {page > 1 ? <Link href={hrefFor(base, { ...state, page: page - 1 })} className="td-pgprev">{t.prev}</Link> : <span />}
            <div className="td-pgnums">
              {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                n === page
                  ? <span key={n} className="td-pgn td-on" aria-current="page">{n}</span>
                  : <Link key={n} href={hrefFor(base, { ...state, page: n })} className="td-pgn">{n}</Link>
              ))}
            </div>
            {page < total ? <Link href={hrefFor(base, { ...state, page: page + 1 })} className="td-pgnext">{t.next}</Link> : <span />}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
