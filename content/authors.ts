// content/authors.ts
// Tokyo Decoded LP — 編集スタッフ（記事の著者）
//
// 方針（2026-09-06）:
// - 多国籍5名の編集スタッフ（ペンネーム）が、担当分野ごとに記事を書く。
//   人物は /about のイラスト（public/brand/editorial-team.png）の5人に対応する
//   （左から 編集長／ライター／デザイナー／フォトグラファー／SNS担当）
// - 資格・職歴は名乗らない（医師・FP等の肩書きは絶対に書かない）。役割は編集上のもののみ
// - 顔写真は使わない。イラストから切り出したアバター（public/brand/staff/*.jpg）を使う
// - 記事は posts.ts の `author`（slug）で紐づく。未設定の記事は編集部名義で表示

import type { Author } from "./types";

export const authors = [
  {
    slug: "mina-kiryu",
    name_ja: "桐生 ミナ",
    name_en: "Mina Kiryu",
    initials: "MK",
    image: "/brand/staff/mina-kiryu.jpg",
    role_ja: "編集長／お金・家計担当",
    role_en: "Editor-in-Chief / Money & Household Finance",
    origin_ja: "東京",
    origin_en: "Tokyo, Japan",
    categories: ["money-ai"],
    focus_ja: ["家計管理", "貯蓄の仕組み化", "固定費の見直し", "家計簿アプリ"],
    focus_en: ["Household budgeting", "Savings systems", "Fixed-cost audits", "Budgeting apps"],
    bio_ja:
      "東京生まれ。婦人之友社の家計簿文化から米国のシンキングファンドまで、「貯める仕組み」を日本の家計に翻訳するのが担当領域。統計は必ず一次資料に当たり、断定より「見えてきたこと」を書く編集方針の責任者でもあります。",
    bio_en:
      "Born in Tokyo. Mina covers the systems behind saving — from Japan's century-old kakeibo culture to sinking funds and pay-yourself-first — and translates them for Japanese households. She owns the editorial rule that every figure traces back to a primary source.",
  },
  {
    slug: "lukas-weber",
    name_ja: "ルーカス・ウェーバー",
    name_en: "Lukas Weber",
    initials: "LW",
    image: "/brand/staff/lukas-weber.jpg",
    role_ja: "ライター／睡眠・ウェルネス担当・データ検証",
    role_en: "Writer / Sleep & Wellness, Data Verification",
    origin_ja: "ベルリン出身・東京在住",
    origin_en: "From Berlin, based in Tokyo",
    categories: ["lifestyle"],
    focus_ja: ["睡眠環境の設計", "休息とミニマリズム", "住まいの心地よさ", "統計・出典の検証"],
    focus_en: ["Sleep environment", "Rest & minimalism", "Home comfort", "Statistics & source checks"],
    bio_ja:
      "ベルリン出身。スリープマキシングや睡眠離婚、コージーマキシングといった「休み方」のトレンドを、公的統計と海外の調査に照らして整理します。編集部の出典チェックも担当し、数字の出どころが辿れない記述は本文に残しません。",
    bio_en:
      "From Berlin. Lukas covers how people rest — sleepmaxxing, sleep divorce, cozymaxxing — and checks them against public statistics and surveys. He also runs the team's source verification: a figure that cannot be traced does not stay in the text.",
  },
  {
    slug: "sofia-reyes",
    name_ja: "ソフィア・レイエス",
    name_en: "Sofia Reyes",
    initials: "SR",
    image: "/brand/staff/sofia-reyes.jpg",
    role_ja: "デザイナー／暮らし・比較記事担当",
    role_en: "Designer / Lifestyle & Comparison Guides",
    origin_ja: "メキシコシティ出身",
    origin_en: "From Mexico City",
    categories: ["lifestyle", "guides"],
    focus_ja: ["生活家電・生活雑貨の方式比較", "サブスクの選び方", "防災備蓄", "図解・比較表の設計"],
    focus_en: ["Home appliance comparisons", "Choosing subscriptions", "Disaster preparedness", "Infographics & comparison tables"],
    bio_ja:
      "メキシコシティ出身。浄水器や加湿器の方式、花や食のサブスクなど「どれを選ぶか」を、公開情報の条件を揃えて整理する比較記事と、その図解・比較表を担当。実機テストはしない代わりに、仕様・価格・方式の違いを一枚の表で見えるようにします。",
    bio_en:
      "From Mexico City. Sofia writes the comparison guides — water filters, humidifiers, flower and food subscriptions — and designs the infographics and tables behind them. No hands-on testing; instead, differences in method, price and fit are laid out on equal terms.",
  },
  {
    slug: "marcus-bennett",
    name_ja: "マーカス・ベネット",
    name_en: "Marcus Bennett",
    initials: "MB",
    image: "/brand/staff/marcus-bennett.jpg",
    role_ja: "フォトグラファー／米国トレンド担当・英語版エディター",
    role_en: "Photographer / US Trends, English Edition Editor",
    origin_ja: "ロサンゼルス出身・東京在住",
    origin_en: "From Los Angeles, based in Tokyo",
    categories: ["money-ai", "lifestyle"],
    focus_ja: ["TikTok発のお金トレンド", "Z世代の消費観", "デインフルエンシング", "英語版の編集・ビジュアル"],
    focus_en: ["TikTok money trends", "Gen Z consumer culture", "Deinfluencing", "English edition & visuals"],
    bio_ja:
      "ロサンゼルス出身。米国のSNSで生まれる「お金の言葉」——ラウドバジェティング、ソフトセービング、ノーバイ——が日本に届く前の文脈を追いかけています。記事のビジュアルと英語版の編集も担当し、日本語版との主張のズレをなくす役です。",
    bio_en:
      "Originally from Los Angeles. Marcus tracks the vocabulary of money that emerges on US social platforms — loud budgeting, soft saving, no-buy — before it lands in Japan. He also handles the site's visuals and edits the English edition so both languages make the same argument.",
  },
  {
    slug: "jiwoo-seo",
    name_ja: "ソ・ジウ",
    name_en: "Jiwoo Seo",
    initials: "JS",
    image: "/brand/staff/jiwoo-seo.jpg",
    role_ja: "SNS担当／美容・スキンケア担当",
    role_en: "Social Media / Beauty & Skincare",
    origin_ja: "ソウル出身",
    origin_en: "From Seoul, South Korea",
    categories: ["beauty"],
    focus_ja: ["スキンケアの順番設計", "韓国発の美容トレンド", "皮膚科学の公開研究の読み解き", "SNS向けの要約カード"],
    focus_en: ["Skincare routines", "K-beauty trends", "Reading dermatology research", "Social summary cards"],
    bio_ja:
      "ソウル出身。韓国の「低速老化」や米国皮膚科医発のスキンサイクリングなど、海外の美容トレンドを公開研究と照らして日本語に翻訳しています。効能を断定せず薬機法に沿った書き方を守るのが基本姿勢。SNS向けの要約カードも担当しています。",
    bio_en:
      "From Seoul. Jiwoo translates beauty trends — Korea's slow aging, dermatologist-led skin cycling — against published research, for Japanese readers. She never asserts efficacy and keeps claims within Japan's cosmetics regulations. She also runs the team's social summary cards.",
  },
] as const satisfies readonly Author[];

export type AuthorSlug = (typeof authors)[number]["slug"];

export function getAuthor(slug?: string | null): Author | undefined {
  if (!slug) return undefined;
  return authors.find((a) => a.slug === slug);
}

// 記事に author が無いときのカテゴリ既定担当（ops 側 site.py と同じ表）
export const DEFAULT_AUTHOR_BY_CATEGORY: Record<string, AuthorSlug> = {
  "money-ai": "mina-kiryu",
  beauty: "jiwoo-seo",
  lifestyle: "lukas-weber",
  guides: "sofia-reyes",
};
