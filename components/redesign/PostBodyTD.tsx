import React from "react";
import Link from "next/link";
import type { Locale, Post } from "@/content/types";
import CardTD from "@/components/redesign/CardTD";
import { catClass, catLabel, title, excerpt, fmtDot } from "@/lib/td";
import { getAuthor } from "@/content/authors";

const STEP_MARKER = /[①②③④⑤⑥⑦⑧⑨⑩]/;
const INLINE_LINK = /\[([^\]]+)\]\((\/[^\s)]+|https:\/\/[^\s)]+)\)/g;
const AFFILIATE_HOSTS = ["hb.afl.rakuten.co.jp", "px.a8.net", "af.moshimo.com"];
const isAffiliateHref = (href: string) => AFFILIATE_HOSTS.some((h) => href.startsWith(`https://${h}/`));

function renderInline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const pattern = new RegExp(INLINE_LINK.source, "g");
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const [, label, href] = match;
    if (href.startsWith("/")) {
      nodes.push(<Link key={`${href}-${match.index}`} href={href} className="td-ilink">{label}</Link>);
    } else {
      nodes.push(
        <a key={`${href}-${match.index}`} href={href} target="_blank"
          rel={isAffiliateHref(href) ? "sponsored noopener noreferrer" : "noopener noreferrer"} className="td-ilink">{label}</a>,
      );
    }
    last = pattern.lastIndex;
  }
  if (nodes.length === 0) return text;
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function SectionContent({ content }: { content: string }) {
  const markerCount = (content.match(new RegExp(STEP_MARKER, "g")) ?? []).length;
  if (markerCount < 2) return <p>{renderInline(content)}</p>;
  const segments = content.split(new RegExp(`(?=${STEP_MARKER.source})`));
  const intro = STEP_MARKER.test(segments[0]?.charAt(0) ?? "") ? null : segments.shift();
  const items = segments.map((s) => s.replace(new RegExp(`^${STEP_MARKER.source}\\s*`), ""));
  return (
    <>
      {intro ? <p>{renderInline(intro.trim())}</p> : null}
      <ol>{items.map((item, i) => <li key={i}>{renderInline(item.trim())}</li>)}</ol>
    </>
  );
}

const SECTIONS = ["data", "explanation", "practice", "cta"] as const;

export default function PostBodyTD({
  post, locale = "ja", relatedPosts = [],
}: { post: Post; locale?: Locale; relatedPosts?: readonly Post[] }) {
  const base = locale === "ja" ? "" : "/en";
  const heading = (key: (typeof SECTIONS)[number]) =>
    post.bodyHeadings?.[key]?.[locale] ?? "";
  const sections = SECTIONS.map((key) => ({ key, h: heading(key), text: post.body[key][locale] }));
  const toc = sections.filter((s) => s.h);
  const tags = locale === "ja" ? post.tags_ja : post.tags_en;
  const sources = post.sources ?? [];
  const author = getAuthor(post.author);
  const authorName = author ? (locale === "ja" ? author.name_ja : author.name_en) : null;
  const authorRole = author ? (locale === "ja" ? author.role_ja : author.role_en) : null;
  const authorHref = author ? `${base}/authors/${author.slug}` : null;
  const faq = post.faq ?? [];
  // 読了時間：日本語は約500字/分、英語は約200語/分で概算（最低1分）
  const bodyText = [post.body.hook, ...SECTIONS.map((k) => post.body[k])].map((b) => b[locale]).join(" ");
  const readMinutes = Math.max(1, Math.round(locale === "ja" ? bodyText.length / 500 : bodyText.split(/\s+/).length / 200));

  const bodyImgAfter: Record<number, { src?: string; alt?: string }> = {
    1: { src: post.bodyImage1, alt: locale === "ja" ? post.bodyImage1Alt_ja : post.bodyImage1Alt_en },
    2: { src: post.bodyImage2, alt: locale === "ja" ? post.bodyImage2Alt_ja : post.bodyImage2Alt_en },
  };

  return (
    <div className="td-scope">
      <div className="td-wrap">
        <div className="td-crumb">
          <Link href={`${base}/`}>{locale === "ja" ? "ホーム" : "Home"}</Link>
          <span className="td-sep">›</span>
          <Link href={`${base}/posts?cat=${post.category}`}>{catLabel(post.category, locale)}</Link>
          <span className="td-sep">›</span>
          <span>{title(post, locale)}</span>
        </div>

        <div className={`td-ahead ${catClass(post.category)}`}>
          <div className="td-chips">
            <span className="td-ck">{catLabel(post.category, locale)}</span>
          </div>
          <h1>{title(post, locale)}</h1>
          <p className="td-dek">{excerpt(post, locale)}</p>
          <div className="td-abyline">
            {author && authorHref ? (
              <Link href={authorHref} className="td-byauthor">
                <img src={author.image} alt="" width={26} height={26} className="td-byavatar" />
                <b>{locale === "ja" ? `文 — ${authorName}` : `By ${authorName}`}</b>
                <span className="td-byrole">{authorRole}</span>
              </Link>
            ) : (
              <b>{locale === "ja" ? "文 — Tokyo Decoded 編集部" : "By the Tokyo Decoded editorial team"}</b>
            )}
            <span className="td-dot">·</span>{fmtDot(post.publishedAt)} {locale === "ja" ? "公開" : "published"}
            <span className="td-dot">·</span>{fmtDot(post.updatedAt ?? post.publishedAt)} {locale === "ja" ? "更新" : "updated"}
            <span className="td-dot">·</span>{locale === "ja" ? `読了 約${readMinutes}分` : `${readMinutes} min read`}
            {sources.length > 0 ? (
              <><span className="td-dot">·</span><a href="#sources" className="td-srclink">{locale === "ja" ? `出典 ${sources.length}件` : `${sources.length} sources`}</a></>
            ) : null}
          </div>
        </div>

        <div className="td-hero" style={{ backgroundImage: `url(${post.thumbnail})` }} />

        <div className="td-layout">
          <div className="td-article">
            <div className="td-lead-p"><p>{renderInline(post.body.hook[locale])}</p></div>
            {sections.map((s, i) => (
              <React.Fragment key={s.key}>
                {s.h ? <h2 id={`s${i + 1}`}>{s.h}</h2> : null}
                <SectionContent content={s.text} />
                {bodyImgAfter[i]?.src ? (
                  <figure className="td-bodyfig">
                    <img src={bodyImgAfter[i]!.src} alt={bodyImgAfter[i]!.alt ?? ""} />
                  </figure>
                ) : null}
              </React.Fragment>
            ))}

            {faq.length > 0 ? (
              <section className="td-faq" id="faq">
                <h2>{locale === "ja" ? "よくある質問" : "FAQ"}</h2>
                {faq.map((item, i) => (
                  <div className="td-faqitem" key={i}>
                    <h3>{item.q[locale]}</h3>
                    <p>{renderInline(item.a[locale])}</p>
                  </div>
                ))}
              </section>
            ) : null}

            {post.affiliateLinks.length > 0 ? (
              <aside className="td-affbox">
                <div className="td-al">{locale === "ja" ? "この記事で紹介した商品（PR）" : "Featured products (PR)"}</div>
                <p className="td-an">
                  {locale === "ja"
                    ? "PR・広告：以下のリンクはアフィリエイトリンクを含みます。"
                    : "PR: the links below may include affiliate links. "}
                  <Link href={`${base}/disclosure`}>{locale === "ja" ? "詳細はこちら" : "Disclosure"}</Link>
                </p>
                <ul>
                  {post.affiliateLinks.map((link) => {
                    const label = locale === "en" && link.label_en ? link.label_en : link.label;
                    return (
                      <li key={link.url}>
                        <a className="td-affitem" href={link.url} target="_blank" rel="sponsored noopener noreferrer">
                          <span className="td-prb">PR</span><span>{label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            ) : null}

            <div className="td-trust">
              <h3>{locale === "ja" ? "この記事について" : "About this article"}</h3>
              <p>
                {locale === "ja"
                  ? (author
                      ? `この記事は Tokyo Decoded 編集部の${authorName}（${authorRole}）が執筆し、編集部が出典の確認と事実確認を行いました。広告主が内容・評価に関与しない編集の独立を方針としています。詳しくは`
                      : "この記事は Tokyo Decoded 編集部が制作しました。出典の明記と事実確認、広告主が内容・評価に関与しない編集の独立を方針としています。詳しくは")
                  : (author
                      ? `This article was written by ${authorName} (${authorRole}) of the Tokyo Decoded editorial team, with sources and facts checked by the team. We keep editorial independence from advertisers. See our `
                      : "This article was produced by the Tokyo Decoded editorial team. We cite sources, verify facts, and keep editorial independence from advertisers. See our ")}
                <Link href={`${base}/editorial-policy`}>{locale === "ja" ? "編集ポリシー" : "editorial policy"}</Link>
                {locale === "ja" ? "をご覧ください。" : "."}
              </p>
            </div>

            {sources.length > 0 ? (
              <section className="td-sources" id="sources">
                <h2>{locale === "ja" ? "出典・参考資料" : "Sources"}</h2>
                <ol>
                  {sources.map((src) => (
                    <li key={src.url}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer">
                        {locale === "ja" ? src.label_ja : src.label_en}
                      </a>
                      {src.publisher ? <span className="td-srcpub"> — {src.publisher}</span> : null}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {tags.length > 0 ? (
              <div className="td-dtags">
                {tags.map((t) => <Link key={t} className="td-dtag" href={`${base}/posts`}>#{t}</Link>)}
              </div>
            ) : null}
          </div>

          {toc.length > 0 ? (
            <nav className="td-toc" aria-label={locale === "ja" ? "目次" : "Contents"}>
              <div className="td-tl">{locale === "ja" ? "目次 — Contents" : "Contents"}</div>
              <ol>
                {sections.map((s, i) => (s.h ? <li key={s.key}><a href={`#s${i + 1}`}>{s.h}</a></li> : null))}
                {faq.length > 0 ? <li><a href="#faq">{locale === "ja" ? "よくある質問" : "FAQ"}</a></li> : null}
                {sources.length > 0 ? <li><a href="#sources">{locale === "ja" ? "出典・参考資料" : "Sources"}</a></li> : null}
              </ol>
            </nav>
          ) : null}
        </div>

        {relatedPosts.length > 0 ? (
          <div className="td-related">
            <h2>{locale === "ja" ? "関連記事" : "Related"}</h2>
            <div className="td-grid">
              {relatedPosts.slice(0, 3).map((p) => <CardTD key={p.slug} post={p} locale={locale} />)}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
