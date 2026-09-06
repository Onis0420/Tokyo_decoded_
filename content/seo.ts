// content/seo.ts
// Tokyo Decoded LP — SEO・メタデータ統合管理
// C-5 管理ファイル。Codex は読み取り専用。
// X-4（Codex）は本ファイルを import して metadata / JSON-LD を実装する。

import type {
  StructuredDataWebSite,
  StructuredDataOrganization,
  StructuredDataArticle,
  StructuredDataBreadcrumb,
} from "./types";

// ----------------------------------------------------------------
// デフォルトメタデータ
// ----------------------------------------------------------------

export const defaultMetadata = {
  // Next.js Metadata API の title.template に使用
  titleTemplate: "%s | Tokyo Decoded",
  defaultTitle: "Tokyo Decoded — 東京発バイリンガル編集部",
  defaultDescription:
    "東京発バイリンガル編集部。海外トレンドをデータで読み解き、日本のミレニアル世代に届けます。お金・暮らし・美容の最新情報を日本語と英語で発信。",
  defaultOgImage: "/brand/ogp-1200x630.png",
  // www 付きが正。www なしは 308 で www へリダイレクトされ、Google も www を正規URLとして
  // 選んでいる（URL検査API の googleCanonical で確認済み）。ここが www なしだと
  // canonical・sitemap・robots.txt がすべて「リダイレクトするURL」を指してしまう。
  siteUrl: "https://www.tokyo-decoded.com",
  locale: "ja_JP",
  alternateLocale: "en_US",
  twitterSite: "@Tokyo_decoded_",
  twitterCreator: "@Tokyo_decoded_",
} as const;

// ----------------------------------------------------------------
// 各ページのメタデータ
// ----------------------------------------------------------------

export const pageMetadata = {
  home: {
    title_ja: "Tokyo Decoded — 東京発バイリンガル編集部",
    title_en: "Tokyo Decoded — A Tokyo-Based Bilingual Editorial Team",
    description_ja:
      "海外トレンドをデータで読み解き、日本のミレニアル世代に届けるバイリンガル編集部。お金・暮らし・美容の情報を東京から発信しています。",
    description_en:
      "A Tokyo-based editorial team decoding global trends for Japan's millennials — and translating Japan's wisdom for the world. Money, lifestyle, beauty.",
    ogImage: "/brand/ogp-1200x630.png",
    canonicalPath: "/",
  },

  about: {
    title_ja: "編集部について",
    title_en: "About Us",
    description_ja:
      "Tokyo Decoded編集部のミッション・戦略・3本柱を紹介。海外トレンドと日本の知恵を翻訳するバイリンガルリサーチチームです。",
    description_en:
      "Meet the Tokyo Decoded team. Our mission, our trend arbitrage approach, and the three content pillars that guide everything we publish.",
    ogImage: "/brand/ogp-1200x630.png",
    canonicalPath: "/about",
  },

  posts: {
    title_ja: "投稿一覧",
    title_en: "Posts",
    description_ja:
      "Tokyo Decoded編集部の全投稿一覧。お金・AI・暮らし・美容のカテゴリ別に、世界のトレンドをデータで解説しています。",
    description_en:
      "All posts from Tokyo Decoded. Browse by category — money & AI, lifestyle, and beauty — for data-backed global trend coverage.",
    ogImage: "/brand/ogp-1200x630.png",
    canonicalPath: "/posts",
  },

  "posts/001-loud-budgeting": {
    title_ja:
      "「お金ない」が恥ずかしくない時代へ——米国発「Loud Budgeting」とは",
    title_en:
      "Loud Budgeting: The US Trend That's Changing How We Talk About Money",
    description_ja:
      "TikTokで1.4億回再生を突破した「Loud Budgeting」。節約を堂々と宣言する新しいお金の価値観と、日本版の実践方法をデータで解説します。",
    description_en:
      "Loud Budgeting hit 140 million TikTok views. We decode the data behind this US trend — and what it means for Japanese millennials.",
    ogImage: "/images/posts/001-loud-budgeting-ogp.webp",
    canonicalPath: "/posts/001-loud-budgeting",
  },

  "posts/002-soft-saving": {
    title_ja:
      "「将来のために我慢」はもう古い——Z世代73%が支持する「Soft Saving」とは",
    title_en:
      "Soft Saving: Why 73% of Gen Z Prioritize Today Over Retirement",
    description_ja:
      "Intuit調査でZ世代の73%が「老後より今の生活の質を優先」と回答。「Soft Saving」という新しい節約観と日本の積立・もったいない文化との接点を解説します。",
    description_en:
      "73% of US Gen Z value today's quality of life over retirement savings, per Intuit. We look at Soft Saving through data and Japanese financial tradition.",
    ogImage: "/images/posts/002-soft-saving-ogp.webp",
    canonicalPath: "/posts/002-soft-saving",
  },

  tools: {
    title_ja: "Editor's Tools — 無料テンプレート配布",
    title_en: "Editor's Tools — Free Templates",
    description_ja:
      "Tokyo Decoded編集部が実際に使うリサーチ・家計管理フレームワークを無料配布。Digital Kakeibo（AI家計簿テンプレート）を今すぐダウンロード。",
    description_en:
      "Download the research and budgeting frameworks we actually use — free. Start with the Digital Kakeibo AI budgeting template.",
    ogImage: "/brand/ogp-1200x630.png",
    canonicalPath: "/tools",
  },

  privacy: {
    title_ja: "プライバシーポリシー",
    title_en: "Privacy Policy",
    description_ja:
      "Tokyo Decoded のプライバシーポリシー。個人情報の取り扱い・Cookie・メールアドレスの利用範囲を説明しています。",
    description_en:
      "Tokyo Decoded Privacy Policy. How we collect, use, and protect your personal information, cookies, and email address.",
    ogImage: "/brand/ogp-1200x630.png",
    canonicalPath: "/privacy",
  },

  disclosure: {
    title_ja: "アフィリエイト・広告開示",
    title_en: "Affiliate & Advertising Disclosure",
    description_ja:
      "Tokyo Decoded のアフィリエイト開示。景品表示法（ステマ規制）対応・参加ASP一覧・PR表記ルールを明示しています。",
    description_en:
      "Tokyo Decoded Affiliate Disclosure. Our compliance with Japan's stealth marketing regulations, affiliate programs, and labeling practices.",
    ogImage: "/brand/ogp-1200x630.png",
    canonicalPath: "/disclosure",
  },

  editorialPolicy: {
    title_ja: "編集ポリシー",
    title_en: "Editorial Policy",
    description_ja:
      "Tokyo Decoded の編集ポリシー。出典と事実確認の基準・AIの活用と編集責任・紹介する商品の選定基準を明示しています。",
    description_en:
      "Tokyo Decoded Editorial Policy. Our standards for sourcing and fact-checking, our use of AI, and how we select the products we feature.",
    ogImage: "/brand/ogp-1200x630.png",
    canonicalPath: "/editorial-policy",
  },

  contact: {
    title_ja: "お問い合わせ",
    title_en: "Contact",
    description_ja:
      "Tokyo Decoded編集部へのお問い合わせ。メディア取材・PR案件・コラボ相談など、お気軽にご連絡ください。",
    description_en:
      "Contact the Tokyo Decoded editorial team. Media inquiries, PR opportunities, and collaboration ideas welcome.",
    ogImage: "/brand/ogp-1200x630.png",
    canonicalPath: "/contact",
  },
} as const;

// ----------------------------------------------------------------
// robots / sitemap の方針
// ----------------------------------------------------------------

// robots.ts での設定方針：
// - 本番（NEXT_PUBLIC_SITE_URL が tokyo-decoded.com）: 全ページ allow
// - プレビュー（Vercel preview URL）: disallow all
// - noindex 対象: /privacy, /disclosure はインデックス対象だが低優先度
// - noindex 除外対象: なし（全ページインデックス可）

export const robotsPolicy = {
  productionAllow: ["/*"],
  productionDisallow: [],
  // sitemap の changefreq・priority の目安
  sitemapPriorities: {
    "/": 1.0,
    "/about": 0.8,
    "/posts": 0.9,
    "/posts/[slug]": 0.8,
    "/contact": 0.6,
    "/privacy": 0.3,
    "/disclosure": 0.3,
  },
} as const;

// ----------------------------------------------------------------
// 構造化データ テンプレート
// ----------------------------------------------------------------

export const structuredDataTemplates = {
  webSite: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tokyo Decoded",
    url: "https://www.tokyo-decoded.com",
    description:
      "A Tokyo-based bilingual editorial team decoding global trends for Japan and translating Japan's wisdom for the world.",
    inLanguage: ["ja", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.tokyo-decoded.com/posts?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  } satisfies StructuredDataWebSite,

  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tokyo Decoded",
    url: "https://www.tokyo-decoded.com",
    logo: "https://www.tokyo-decoded.com/brand/logo-mark-red.svg",
    description:
      "A Tokyo-based bilingual editorial team. We decode global trends for Japan and translate Japan's wisdom for the world.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@tokyo-decoded.com",
      contactType: "editorial",
    },
    sameAs: [
      "https://www.instagram.com/tokyo_decoded_jp/",
      "https://www.instagram.com/tokyo_decoded.team/",
      "https://x.com/TokyoDecoded_jp",
      "https://x.com/Tokyo_decoded_",
    ],
  } satisfies StructuredDataOrganization,

  // 個別投稿ページで使用するテンプレート（X-4 が各投稿の値で上書きする）
  articleTemplate: {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "{{title}}",
    description: "{{description}}",
    image: "{{ogImage}}",
    datePublished: "{{publishedAt}}",
    dateModified: "{{publishedAt}}",
    author: {
      "@type": "Organization",
      name: "Tokyo Decoded編集部",
      url: "https://www.tokyo-decoded.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Tokyo Decoded",
      logo: {
        "@type": "ImageObject",
        url: "https://www.tokyo-decoded.com/brand/logo-mark-red.svg",
      },
    },
    inLanguage: "ja",
  } satisfies StructuredDataArticle,

  // パンくずリストのテンプレート（各ページで itemListElement を差し替える）
  breadcrumbHome: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Tokyo Decoded",
        item: "https://www.tokyo-decoded.com",
      },
    ],
  } satisfies StructuredDataBreadcrumb,
} as const;
