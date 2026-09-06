import Link from "next/link";
import type { Author, Locale } from "@/content/types";
import CardTD from "@/components/redesign/CardTD";
import { getPostsByAuthor } from "@/lib/posts";

export default function AuthorPageTD({ author, locale }: { author: Author; locale: Locale }) {
  const base = locale === "ja" ? "" : "/en";
  const name = locale === "ja" ? author.name_ja : author.name_en;
  const role = locale === "ja" ? author.role_ja : author.role_en;
  const origin = locale === "ja" ? author.origin_ja : author.origin_en;
  const bio = locale === "ja" ? author.bio_ja : author.bio_en;
  const focus = locale === "ja" ? author.focus_ja : author.focus_en;
  const posts = getPostsByAuthor(author.slug);

  return (
    <div className="td-scope">
      <div className="td-wrap">
        <div className="td-crumb">
          <Link href={`${base}/`}>{locale === "ja" ? "ホーム" : "Home"}</Link>
          <span className="td-sep">›</span>
          <Link href={`${base}/about`}>{locale === "ja" ? "編集部について" : "About"}</Link>
          <span className="td-sep">›</span>
          <span>{name}</span>
        </div>

        <header className="td-authorhead">
          <img src={author.image} alt={name} width={132} height={132} />
          <div>
            <p className="td-authorrole">{role}</p>
            <h1>{name}</h1>
            <p className="td-authororigin">{origin} · Tokyo Decoded {locale === "ja" ? "編集部" : "editorial team"}</p>
            <p className="td-authorbio">{bio}</p>
            <ul className="td-authorfocus" aria-label={locale === "ja" ? "担当分野" : "Focus areas"}>
              {focus.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </header>

        <section className="td-authorposts">
          <h2>
            {locale === "ja" ? `${name}の記事` : `Articles by ${name}`}
            <span className="td-dot"> · </span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{posts.length}</span>
          </h2>
          {posts.length > 0 ? (
            <div className="td-grid">
              {posts.map((p) => <CardTD key={p.slug} post={p} locale={locale} />)}
            </div>
          ) : (
            <p>{locale === "ja" ? "準備中です。" : "Coming soon."}</p>
          )}
        </section>
      </div>
    </div>
  );
}
