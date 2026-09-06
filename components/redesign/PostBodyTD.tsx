import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale, Post } from "@/content/types";
import CardTD from "@/components/redesign/CardTD";
import ShareRow from "@/components/redesign/ShareRow";
import { catClass, catLabel, title, excerpt, fmtDot, readMinutes } from "@/lib/td";
import { getAuthor } from "@/content/authors";
import { getPrevNextPosts } from "@/lib/posts";
import { splitParagraphs } from "@/lib/text";
import { defaultMetadata } from "@/content/seo";

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

/** 段落分割（改行・長文の自動分割）+ ①②③ の手順は番号付きリストに */
function SectionContent({ content, locale }: { content: string; locale: Locale }) {
  const paragraphs = splitParagraphs(content, locale);
  return (
    <>
      {paragraphs.map((para, pi) => {
        const markerCount = (para.match(new RegExp(STEP_MARKER, "g")) ?? []).length;
        if (markerCount < 2) return <p key={pi}>{renderInline(para)}</p>;
        const segments = para.split(new RegExp(`(?=${STEP_MARKER.source})`));
        const intro = STEP_MARKER.test(segments[0]?.charAt(0) ?? "") ? null : segments.shift();
        const items = segments.map((s) => s.replace(new RegExp(`^${STEP_MARKER.source}\\s*`), ""));
        return (
          <React.Fragment key={pi}>
            {intro ? <p>{renderInline(intro.trim())}</p> : null}
            <ol>{items.map((item, i) => <li key={i}>{renderInline(item.trim())}</li>)}</ol>
          </React.Fragment>
        );
      })}
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
  const faq = post.faq ?? [];
  const minutes = readMinutes(post, locale);
  const author = getAuthor(post.author);
  const authorName = author ? (locale === "ja" ? author.name_ja : author.name_en) : null;
  const authorRole = author ? (locale === "ja" ? author.role_ja : author.role_en) : null;
  const authorHref = author ? `${base}/authors/${author.slug}` : null;
  const { prev, next } = getPrevNextPosts(post.slug);
  const pageUrl = `${defaultMetadata.siteUrl}${base}/posts/${post.slug}`;
  const thumbAlt = locale === "ja" ? post.thumbnailAlt_ja : post.thumbnailAlt_en;

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
                <Image src={author.image} alt="" width={26} height={26} className="td-byavatar" />
                <b>{locale === "ja" ? `文 — ${authorName}` : `By ${authorName}`}</b>
                <span className="td-byrole">{authorRole}</span>
              </Link>
            ) : (
              <b>{locale === "ja" ? "文 — Tokyo Decoded 編集部" : "By the Tokyo Decoded editorial team"}</b>
            )}
            <span className="td-dot">·</span>{fmtDot(post.publishedAt)} {locale === "ja" ? "公開" : "published"}
            <span className="td-dot">·</span>{fmtDot(post.updatedAt ?? post.publishedAt)} {locale === "ja" ? "更新" : "updated"}
            <span className="td-dot">·</span>{locale === "ja" ? `読了 約${minutes}分` : `${minutes} min read`}
            {sources.length > 0 ? (
              <><span className="td-dot">·</span><a href="#sources" className="td-srclink">{locale === "ja" ? `出典 ${sources.length}件` : `${sources.length} sources`}</a></>
            ) : null}
          </div>
        </div>

        <div className="td-hero">
          <Image src={post.thumbnail} alt={thumbAlt} fill priority sizes="(max-width: 900px) 100vw, 1100px" />
        </div>

        <div className="td-layout">
          <div className="td-article">
            <div className="td-lead-p"><SectionContent content={post.body.hook[locale]} locale={locale} /></div>
            {sections.map((s, i) => (
              <React.Fragment key={s.key}>
                {s.h ? <h2 id={`s${i + 1}`}>{s.h}</h2> : null}
                <SectionContent content={s.text} locale={locale} />
                {bodyImgAfter[i]?.src ? (
                  <figure className="td-bodyfig">
                    <Image src={bodyImgAfter[i]!.src!} alt={bodyImgAfter[i]!.alt ?? ""} width={1536} height={1024}
                      sizes="(max-width: 900px) 100vw, 760px" style={{ width: "100%", height: "auto" }} />
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
                    <SectionContent content={item.a[locale]} locale={locale} />
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

            <ShareRow url={pageUrl} title={title(post, locale)} locale={locale} />

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

            {author && authorHref ? (
              <aside className="td-authorcard">
                <Link href={authorHref} className="td-acavatar" aria-hidden="true" tabIndex={-1}>
                  <Image src={author.image} alt="" width={72} height={72} />
                </Link>
                <div className="td-acbody">
                  <div className="td-acrole">{authorRole}</div>
                  <Link href={authorHref} className="td-acname">{authorName}</Link>
                  <p>{locale === "ja" ? author.bio_ja : author.bio_en}</p>
                  <Link href={authorHref} className="td-aclink">
                    {locale === "ja" ? `${authorName}の記事をもっと読む →` : `More from ${authorName} →`}
                  </Link>
                </div>
              </aside>
            ) : null}

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
                {tags.map((t) => (
                  <Link key={t} className="td-dtag" href={`${base}/posts?q=${encodeURIComponent(t)}`}>#{t}</Link>
                ))}
              </div>
            ) : null}

            {(prev || next) ? (
              <nav className="td-pn" aria-label={locale === "ja" ? "前後の記事" : "Previous and next articles"}>
                {prev ? (
                  <Link href={`${base}/posts/${prev.slug}`} className="td-pnprev">
                    <span className="td-pnl">{locale === "ja" ? "← 前の記事" : "← Previous"}</span>
                    <span className="td-pnt">{title(prev, locale)}</span>
                  </Link>
                ) : <span />}
                {next ? (
                  <Link href={`${base}/posts/${next.slug}`} className="td-pnnext">
                    <span className="td-pnl">{locale === "ja" ? "次の記事 →" : "Next →"}</span>
                    <span className="td-pnt">{title(next, locale)}</span>
                  </Link>
                ) : <span />}
              </nav>
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
