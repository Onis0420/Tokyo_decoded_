// content/types.ts
// Tokyo Decoded LP — 共通型定義
// C-5 管理ファイル。Codex は読み取り専用。

export type Locale = "ja" | "en";

export type LocalizedString = {
  readonly ja: string;
  readonly en: string;
};

export type NavItem = {
  readonly href: string;
  readonly label_ja: string;
  readonly label_en: string;
};

export type SocialAccount = {
  readonly id: string;
  readonly platform: "youtube" | "instagram" | "x" | "tiktok";
  readonly locale: Locale;
  readonly handle: string;
  readonly url: string;
  readonly label: string;
};

export type Category = {
  readonly slug: string;
  readonly label_ja: string;
  readonly label_en: string;
  readonly color: string;
};

export type Post = {
  readonly slug: string;
  readonly title_ja: string;
  readonly title_en: string;
  readonly category: string;
  readonly publishedAt: string;
  readonly thumbnail: string;
  readonly thumbnailAlt_ja: string;
  readonly thumbnailAlt_en: string;
  readonly bodyImage1?: string;
  readonly bodyImage1Alt_ja?: string;
  readonly bodyImage1Alt_en?: string;
  readonly bodyImage2?: string;
  readonly bodyImage2Alt_ja?: string;
  readonly bodyImage2Alt_en?: string;
  readonly excerpt_ja: string;
  readonly excerpt_en: string;
  readonly body: PostBody;
  readonly bodyHeadings?: PostBodyHeadings;
  readonly relatedToolSlug: string | null;
  readonly affiliateLinks: readonly AffiliateLink[];
  readonly tags_ja: readonly string[];
  readonly tags_en: readonly string[];
  // 最終更新日（リライト時に更新）。未設定なら publishedAt を使う
  readonly updatedAt?: string;
  // 出典・参考資料。本文中で引用した統計・報道の一次ソース（外部リンク）
  readonly sources?: readonly Source[];
  // よくある質問（検索の質問型クエリに対応）
  readonly faq?: readonly FaqItem[];
  // 著者（content/authors.ts の slug）。未設定なら編集部名義
  readonly author?: string;
};

export type Author = {
  readonly slug: string;
  readonly name_ja: string;
  readonly name_en: string;
  readonly initials: string;
  // イラストから切り出したアバター画像（public 配下のパス）
  readonly image: string;
  readonly role_ja: string;
  readonly role_en: string;
  readonly origin_ja: string;
  readonly origin_en: string;
  readonly categories: readonly string[];
  readonly focus_ja: readonly string[];
  readonly focus_en: readonly string[];
  readonly bio_ja: string;
  readonly bio_en: string;
};

export type Source = {
  readonly label_ja: string;
  readonly label_en: string;
  readonly url: string;
  // 発行元（例: 厚生労働省 / NerdWallet）。省略可
  readonly publisher?: string;
};

export type FaqItem = {
  readonly q: LocalizedString;
  readonly a: LocalizedString;
};

export type PostBody = {
  readonly hook: LocalizedString;
  readonly data: LocalizedString;
  readonly explanation: LocalizedString;
  readonly practice: LocalizedString;
  readonly cta: LocalizedString;
};

// 本文セクションの可視見出し（SEO用・派生クエリを含む）。
// hook はリード文のため見出しなし。未設定セクションは従来どおり sr-only 見出しで描画される。
export type PostBodyHeadings = {
  readonly data?: LocalizedString;
  readonly explanation?: LocalizedString;
  readonly practice?: LocalizedString;
  readonly cta?: LocalizedString;
};

export type AffiliateLink = {
  readonly label: string;
  // 英語ページ用ラベル。未設定時は label（日本語）にフォールバック
  readonly label_en?: string;
  readonly url: string;
  readonly note?: string;
};

export type Tool = {
  readonly slug: string;
  readonly name: LocalizedString;
  readonly category: string;
  readonly description_ja: string;
  readonly description_en: string;
  readonly preview: string;
  readonly previewAlt_ja: string;
  readonly previewAlt_en: string;
  /** 登録不要の直リンク（Notion 公開ページ）。2026-09-07 にメールゲートを廃止 */
  readonly notionUrl: string;
  /** このテンプレートを「実践」節の後に案内する記事 slug */
  readonly relatedSlugs: readonly string[];
};

export type RecommendedCategory = {
  readonly slug: string;
  readonly label_ja: string;
  readonly label_en: string;
};

export type RecommendedItem = {
  readonly slug: string;
  readonly name: LocalizedString;
  readonly category: string;
  readonly description_ja: string;
  readonly description_en: string;
  readonly imageUrl: string;
  readonly imageAlt_ja: string;
  readonly imageAlt_en: string;
  readonly affiliateUrl: string;
  readonly asp: string;
  readonly prLabel_ja: string;
  readonly prLabel_en: string;
};

export type StructuredDataWebSite = {
  readonly "@context": "https://schema.org";
  readonly "@type": "WebSite";
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly inLanguage: readonly string[];
  readonly potentialAction: {
    readonly "@type": "SearchAction";
    readonly target: string;
    readonly "query-input": string;
  };
};

export type StructuredDataOrganization = {
  readonly "@context": "https://schema.org";
  readonly "@type": "Organization";
  readonly name: string;
  readonly url: string;
  readonly logo: string;
  readonly description: string;
  readonly contactPoint: {
    readonly "@type": "ContactPoint";
    readonly email: string;
    readonly contactType: string;
  };
  readonly sameAs: readonly string[];
};

export type StructuredDataArticle = {
  readonly "@context": "https://schema.org";
  readonly "@type": "Article";
  readonly headline: string;
  readonly description: string;
  readonly image: string;
  readonly datePublished: string;
  readonly dateModified: string;
  readonly author: {
    readonly "@type": "Organization" | "Person";
    readonly name: string;
    readonly url: string;
    readonly jobTitle?: string;
    readonly worksFor?: { readonly "@type": "Organization"; readonly name: string };
  };
  readonly publisher: {
    readonly "@type": "Organization";
    readonly name: string;
    readonly logo: {
      readonly "@type": "ImageObject";
      readonly url: string;
    };
  };
  readonly inLanguage: string;
};

export type StructuredDataBreadcrumb = {
  readonly "@context": "https://schema.org";
  readonly "@type": "BreadcrumbList";
  readonly itemListElement: readonly {
    readonly "@type": "ListItem";
    readonly position: number;
    readonly name: string;
    readonly item: string;
  }[];
};
