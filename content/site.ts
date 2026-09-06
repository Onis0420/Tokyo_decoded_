// content/site.ts
// Tokyo Decoded LP — サイト全体共通設定
// C-5 管理ファイル。Codex は読み取り専用。
// 2026-09-07: リポジトリは Onis0420/Tokyo_decoded_、Vercel は team Onis（onis2）でホスト

import type { NavItem, SocialAccount } from "./types";

export const siteContent = {
  name: "東京デコード",
  nameEn: "Tokyo Decoded",
  domain: "tokyo-decoded.com",  // 表示用のドメイン名。URLとしては使わない
  siteUrl: "https://www.tokyo-decoded.com",  // 実配信は www（www なしは308でここへ飛ぶ）
  contactEmail: "hello@tokyo-decoded.com",

  description: {
    ja: "東京発・バイリンガル編集部。海外トレンドを日本語へ、日本の知恵を世界へ翻訳します。お金・暮らし・美容をデータで読み解くメディア。",
    en: "A Tokyo-based bilingual editorial team. We decode global trends for Japan, and translate Japan's wisdom for the world — through money, lifestyle, and beauty.",
  },

  statement: "Decoding the world from Tokyo, decoding Japan for the world.",
  statementJa: "東京から世界を読み解き、日本を世界へ翻訳する編集部。",

  social: [
    {
      id: "instagram-ja",
      platform: "instagram",
      locale: "ja",
      handle: "@tokyo_decoded_jp",
      url: "https://www.instagram.com/tokyo_decoded_jp/",
      label: "Instagram（日本語）",
    },
    {
      id: "instagram-en",
      platform: "instagram",
      locale: "en",
      handle: "@tokyo_decoded.team",
      url: "https://www.instagram.com/tokyo_decoded.team/",
      label: "Instagram (English)",
    },
    {
      id: "x-ja",
      platform: "x",
      locale: "ja",
      handle: "@TokyoDecoded_jp",
      url: "https://x.com/TokyoDecoded_jp",
      label: "X（日本語）",
    },
    {
      id: "x-en",
      platform: "x",
      locale: "en",
      handle: "@Tokyo_decoded_",
      url: "https://x.com/Tokyo_decoded_",
      label: "X (English)",
    },
  ] as const satisfies readonly SocialAccount[],

  nav: [
    { href: "/", label_ja: "ホーム", label_en: "Home" },
    { href: "/about", label_ja: "編集部について", label_en: "About" },
    { href: "/posts", label_ja: "投稿", label_en: "Posts" },
    { href: "/tools", label_ja: "Editor's Tools", label_en: "Editor's Tools" },
    { href: "/contact", label_ja: "お問い合わせ", label_en: "Contact" },
  ] as const satisfies readonly NavItem[],

  footer: {
    copyright_ja: "© 2026 Tokyo Decoded 編集部",
    copyright_en: "© 2026 Tokyo Decoded Editorial Team",
    disclosureNote_ja:
      "本サイトはアフィリエイト広告を掲載しています。広告収益によって運営されており、掲載内容に関して対価を受け取る場合があります。",
    disclosureNote_en:
      "This site contains affiliate links. We may earn a commission from purchases made through these links, at no extra cost to you.",
  },
} as const;
