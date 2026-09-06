// content/tools.ts
// 編集部のテンプレート（旧 Editor's Tools）。
// 2026-09-07: メールゲートと /tools ページを廃止。Research Brief / Trend Worksheet は引退し、
// Digital Kakeibo だけを /about と関連記事から登録不要の直リンクで案内する。

import type { Tool } from "./types";

export const tools = [
  {
    slug: "digital-kakeibo",
    name: {
      ja: "Digital Kakebo — お金の流れを可視化する",
      en: "Digital Kakebo — Visualise Your Money Flow",
    },
    category: "money-ai",
    description_ja:
      "Notion で使える家計簿テンプレート。100年以上の歴史を持つ日本の「家計簿（Kakeibo）」をデジタル化し、月に1度、4つの問いに答えるだけでお金の流れが見えてくる月次レビューシートです。登録不要で、そのまま複製して使えます。",
    description_en:
      "A budgeting template for Notion. We digitised the Japanese Kakeibo method — over a century old — into a monthly review sheet: answer four questions once a month and your money habits start to clarify. No sign-up; duplicate it and use it.",
    preview: "/images/tools/digital-kakeibo-preview.webp",
    previewAlt_ja:
      "Digital Kakebo テンプレートのプレビュー画像。月次レビューシートと4カテゴリの支出分類表",
    previewAlt_en:
      "Preview of the Digital Kakebo template, showing the monthly review sheet and four spending category columns",
    notionUrl:
      "https://pinnate-gum-0b7.notion.site/Digital-Kakebo-37ed3574d1a981b59eefe2334cfa0d9a?source=copy_link",
    relatedSlugs: [
      "016-kakeibo-app-comparison",
      "034-pay-yourself-first",
      "018-sinking-funds",
      "005-cash-stuffing",
      "031-subscription-cancel-audit",
    ],
  },
] as const satisfies readonly Tool[];

export const digitalKakeibo = tools[0];

export function toolsForPost(slug: string): readonly Tool[] {
  return tools.filter((t) => (t.relatedSlugs as readonly string[]).includes(slug));
}
