// components/redesign/CardTD.tsx — REDESIGN 記事カード（サーバー）
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/content/types";
import { catClass, catLabel, postHref, title, excerpt, fmtDot } from "@/lib/td";

type Locale = "ja" | "en";

export default function CardTD({ post, locale, priority = false }: { post: Post; locale: Locale; priority?: boolean }) {
  const alt = locale === "ja" ? post.thumbnailAlt_ja : post.thumbnailAlt_en;
  return (
    <Link className="td-c" href={postHref(post, locale)}>
      <div className="td-ci">
        <Image src={post.thumbnail} alt={alt} fill priority={priority} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px" />
      </div>
      <div className="td-cmeta">
        <span className={`td-ck ${catClass(post.category)}`}>{catLabel(post.category, locale)}</span>
        <span className="td-cd">{fmtDot(post.publishedAt)}</span>
      </div>
      <h3>{title(post, locale)}</h3>
      <p>{excerpt(post, locale)}</p>
      <span className="td-more">{locale === "ja" ? "続きを読む →" : "Read more →"}</span>
    </Link>
  );
}
