// components/redesign/HomeTD.tsx — トップページ（日英共通・サーバー）
import Image from "next/image";
import Link from "next/link";
import CardTD from "@/components/redesign/CardTD";
import type { Locale, Post } from "@/content/types";
import { getAuthor } from "@/content/authors";
import {
  sortedPosts, byCategory, catClass, catLabel,
  postHref, title, excerpt, fmtDot, fmtMd, topTags, readMinutes,
} from "@/lib/td";

const L = {
  ja: {
    week: "今週の特集", weekEn: "THIS WEEK", next: "次に読むべき", money: "お金クラスタ 最新",
    topics: "人気のトピック", latest: "最新記事", all: "すべての記事 →",
    cats: [["お金・AI", "MONEY", "money-ai", "td-cm"], ["暮らし", "LIFE", "lifestyle", "td-cl"], ["美容", "BEAUTY", "beauty", "td-cb"], ["まとめ・比較", "GUIDES", "guides", "td-cg"]],
  },
  en: {
    week: "Featured", weekEn: "THIS WEEK", next: "Up next", money: "Latest in Money",
    topics: "Popular topics", latest: "Latest articles", all: "All articles →",
    cats: [["Money & AI", "MONEY", "money-ai", "td-cm"], ["Lifestyle", "LIFE", "lifestyle", "td-cl"], ["Beauty", "BEAUTY", "beauty", "td-cb"], ["Guides", "GUIDES", "guides", "td-cg"]],
  },
} as const;

export default function HomeTD({ locale }: { locale: Locale }) {
  const base = locale === "ja" ? "" : "/en";
  const t = L[locale];
  const all = sortedPosts();
  const money = byCategory("money-ai");
  // リード（特集）と「次に読むべき」はカテゴリを問わず公開日順（2026-08-09 の「更新停止に見える」事故の再発防止）。
  // 「お金クラスタ 最新」レールは収益カテゴリの導線として money のまま。
  const lead = all[0];
  const subs = all.filter((p) => p.slug !== lead.slug).slice(0, 2);
  const rail = money.slice(0, 5);
  const featured = new Set([lead.slug, ...subs.map((p) => p.slug)]);
  const gridPosts = all.filter((p) => !featured.has(p.slug)).slice(0, 6);
  const tags = topTags(locale, 9);

  // 特集の署名は記事ページと同じ実データ（著者・出典数・読了時間）。以前は固定文字列だった
  const author = getAuthor(lead.author);
  const authorName = author ? (locale === "ja" ? author.name_ja : author.name_en) : (locale === "ja" ? "Tokyo Decoded 編集部" : "Tokyo Decoded editorial team");
  const sourcesN = lead.sources?.length ?? 0;
  const leadAlt = locale === "ja" ? lead.thumbnailAlt_ja : lead.thumbnailAlt_en;

  return (
    <div className="td-scope">
      <div className="td-wrap">
        <div className="td-catstrip">
          {t.cats.map(([j, en, slug, cc]) => (
            <Link key={en} href={`${base}/posts?cat=${slug}`} className={cc}>
              <span className="td-cjp">{j}</span>
              <span className="td-cen">{en}</span>
            </Link>
          ))}
        </div>

        <div className="td-top">
          <Link className="td-lead" href={postHref(lead, locale)}>
            <div className="td-ey">{t.week} · <span className="td-en">{t.weekEn}</span></div>
            <h1>{title(lead, locale)}</h1>
            <p className="td-dek">{excerpt(lead, locale)}</p>
            <div className={`td-byline ${catClass(lead.category)}`}>
              <span className="td-cat">{catLabel(lead.category, locale)}</span>
              {author ? <Image src={author.image} alt="" width={22} height={22} className="td-byavatar" /> : null}
              {locale === "ja" ? `文 — ${authorName}` : `By ${authorName}`}
              <span className="td-dot">·</span>{fmtDot(lead.publishedAt)}
              <span className="td-dot">·</span>{locale === "ja" ? `読了 約${readMinutes(lead, locale)}分` : `${readMinutes(lead, locale)} min read`}
              {sourcesN > 0 ? <><span className="td-dot">·</span>{locale === "ja" ? `出典${sourcesN}件` : `${sourcesN} sources`}</> : null}
            </div>
            <div className="td-li">
              <Image src={lead.thumbnail} alt={leadAlt} fill priority sizes="(max-width: 900px) 100vw, 760px" />
            </div>
          </Link>

          <aside className="td-aside">
            <div className="td-asideh">{t.next}</div>
            {subs.map((p: Post) => (
              <Link key={p.slug} className="td-sub" href={postHref(p, locale)}>
                <div className="td-subimg">
                  <Image src={p.thumbnail} alt="" fill sizes="82px" />
                </div>
                <div className="td-subtxt">
                  <div className={`td-k ${catClass(p.category)}`}>{catLabel(p.category, locale)}</div>
                  <h4>{title(p, locale)}</h4>
                </div>
              </Link>
            ))}
            <div className="td-asideh" style={{ marginTop: 20 }}>{t.money}</div>
            <div className="td-rail">
              {rail.map((p) => (
                <Link key={p.slug} className="td-r" href={postHref(p, locale)}>
                  <span className="td-rn">{fmtMd(p.publishedAt)}</span>
                  <span className="td-rt">{title(p, locale)}</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <div className="td-tagsec">
          <span className="td-tl">{t.topics}</span>
          {tags.map((tag) => (
            <Link key={tag} className="td-tag" href={`${base}/posts?q=${encodeURIComponent(tag)}`}>#{tag}</Link>
          ))}
        </div>

        <div className="td-sec">
          <div className="td-sech"><h2>{t.latest}</h2><Link href={`${base}/posts`}>{t.all}</Link></div>
          <div className="td-grid">
            {gridPosts.map((p) => <CardTD key={p.slug} post={p} locale={locale} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
