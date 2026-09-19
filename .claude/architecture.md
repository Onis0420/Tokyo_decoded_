# Tokyo Decoded LP — フロントエンドアーキテクチャ設計書

> 作成：C-3（フロントエンドテクニカルリード）
> 作成日：2026-06-04
> 対象フェーズ：Phase 1 DESIGN
> 参照元：brief.md, AGENTS.md, package.json, app/layout.tsx

> **2026-09-20 構成変更（この文書の `app/...` のパスは変更前のもの）**
> ルートレイアウトを日英で分けた。`app/layout.tsx` は廃止し、外枠は `app/_shared/root-shell.tsx`（`RootShell` と `rootMetadata`）。
> 日本語ページは `app/(ja)/` 配下（URL は変わらない）で `app/(ja)/layout.tsx` が `<html lang="ja">`、
> 英語ページは `app/en/layout.tsx` が `<html lang="en">`。未マッチURLの404は `app/global-not-found.tsx`
> （`next.config.ts` の `experimental.globalNotFound`）。理由：/en 配下が英語本文なのに `lang="ja"` を宣言していたため。
> 注意：ルートレイアウトと同じ階層のページ（`app/en/page.tsx`）には `title.template` が掛からないので、absolute で固定している。

---

## 1. プロジェクト構造

```
tokyo-decoded-lp/
├── app/
│   ├── layout.tsx                    # ルートレイアウト（next/font 注入・GA スクリプト）
│   ├── page.tsx                      # / トップページ（Server Component）
│   ├── globals.css                   # @import "tailwindcss" + @theme inline {}（C-2 管理）
│   │
│   ├── about/
│   │   └── page.tsx                  # /about 編集部について
│   │
│   ├── posts/
│   │   ├── page.tsx                  # /posts 投稿アーカイブ（ISR）
│   │   └── [slug]/
│   │       └── page.tsx              # /posts/[slug] 個別投稿（generateStaticParams + ISR）
│   │
│   ├── tools/
│   │   └── page.tsx                  # /tools Editor's Tools
│   │
│   ├── recommended/
│   │   └── page.tsx                  # /recommended 推奨ツール
│   │
│   ├── privacy/
│   │   └── page.tsx                  # /privacy プライバシーポリシー
│   │
│   ├── disclosure/
│   │   └── page.tsx                  # /disclosure アフィリエイト開示
│   │
│   ├── contact/
│   │   └── page.tsx                  # /contact お問い合わせ
│   │
│   ├── en/                           # 英語版（同構造をミラー）
│   │   ├── layout.tsx                # lang="en" 上書き
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── tools/page.tsx
│   │   ├── recommended/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── disclosure/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── api/
│   │   ├── subscribe/
│   │   │   └── route.ts              # POST: メールリスト登録（Resend + Google Sheets）
│   │   ├── contact/
│   │   │   └── route.ts              # POST: 問い合わせ転送（Resend + reCAPTCHA）
│   │   └── og/
│   │       └── route.tsx             # GET: 動的OGP生成（@vercel/og, edge runtime）
│   │
│   ├── sitemap.ts                    # sitemap.xml 自動生成（X-4 担当）
│   └── robots.ts                     # robots.txt（X-4 担当）
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Server Component（X-1）
│   │   ├── Footer.tsx                # Server Component（X-1）
│   │   └── Navigation.tsx            # Server Component / ハンバーガー部分は Client 分離（X-1）
│   │
│   ├── ui/                           # 汎用 UI（X-1/X-2 共通）
│   │   ├── Button.tsx                # Server Component
│   │   ├── Card.tsx                  # Server Component
│   │   ├── CategoryTag.tsx           # Server Component
│   │   └── Logo.tsx                  # Server Component
│   │
│   ├── sections/                     # トップページ各セクション（X-2 担当）
│   │   ├── HeroSection.tsx           # Server Component
│   │   ├── AboutMiniSection.tsx      # Server Component
│   │   ├── LatestPostsSection.tsx    # Server Component
│   │   ├── ToolsSection.tsx          # Server Component（フォームは SubscribeForm に委譲）
│   │   ├── RecommendedSection.tsx    # Server Component
│   │   └── ContactCtaSection.tsx     # Server Component
│   │
│   ├── forms/                        # Client Components（X-2 担当）
│   │   ├── SubscribeForm.tsx         # "use client" — メールリスト登録フォーム
│   │   └── ContactForm.tsx           # "use client" — お問い合わせフォーム
│   │
│   └── common/                       # インタラクティブ共通部品（X-1 担当）
│       ├── LangToggle.tsx            # "use client" — 言語切替トグル
│       ├── CategoryFilter.tsx        # "use client" — 投稿カテゴリフィルタ
│       ├── CookieBanner.tsx          # "use client" — Cookie 同意バナー
│       ├── MobileMenu.tsx            # "use client" — ハンバーガーメニュー
│       └── GoogleAnalytics.tsx       # "use client" — GA4 gtag 計測
│
├── content/                          # C-5 管理（as const + satisfies）
│   ├── hero.ts
│   ├── about.ts
│   ├── posts.ts                      # 投稿メタデータ一覧
│   ├── tools.ts                      # Editor's Tools 一覧
│   ├── recommended.ts                # 推奨ツール一覧
│   ├── navigation.ts                 # ナビゲーションリンク
│   ├── footer.ts                     # フッターリンク・SNS アカウント
│   └── legal.ts                      # privacy / disclosure テキスト
│
├── lib/
│   ├── types.ts                      # 共通型定義（C-3 管理）
│   ├── utils.ts                      # 汎用ユーティリティ（C-3 シグネチャ）
│   ├── resend.ts                     # Resend クライアント初期化
│   ├── sheets.ts                     # Google Sheets API クライアント
│   └── recaptcha.ts                  # reCAPTCHA v3 検証ユーティリティ
│
├── public/
│   ├── brand/
│   │   ├── logo-mark-red.svg
│   │   ├── logo-mark-black.svg
│   │   ├── logo-mark-white.svg
│   │   ├── logo-horizontal.svg
│   │   └── ogp-1200x630.png
│   └── fonts/                        # next/font が自動キャッシュするため不要（参照のみ）
│
├── .claude/
│   ├── CLAUDE.md
│   ├── AGENTS.md
│   ├── design.md                     # C-2 管理
│   └── architecture.md               # 本ファイル（C-3 管理）
│
├── next.config.ts                    # C-3 管理
├── tsconfig.json                     # C-3 管理
├── vercel.json
└── package.json
```

---

## 2. "use client" 境界設計

### 原則

- `"use client"` はリーフコンポーネント（末端の最小単位）に閉じ込める
- Server Component から Client Component へのデータ渡しは props 経由のみ
- ページコンポーネント（`page.tsx`）は常に Server Component のまま維持する
- フォームのみを Client Component に切り出し、ページは Server のままにする

### Server Components（デフォルト）

| コンポーネント | 理由 |
|---|---|
| `app/**/page.tsx`（全ページ） | データフェッチ・静的レンダリングのため |
| `app/**/layout.tsx` | レイアウト・metadata 管理のため |
| `components/layout/Header.tsx` | 静的マークアップのみ |
| `components/layout/Footer.tsx` | 静的マークアップのみ |
| `components/layout/Navigation.tsx` | リンク一覧は静的（MobileMenu を子に持つ） |
| `components/ui/*` | Button / Card / CategoryTag / Logo はすべて静的 UI |
| `components/sections/*` | Hero / AboutMini / LatestPosts / Tools / Recommended / ContactCta |

### Client Components（`"use client"` 必須）

| コンポーネント | トリガー | 備考 |
|---|---|---|
| `components/common/LangToggle.tsx` | `useRouter` / Cookie 操作 | 言語切替、右上配置 |
| `components/common/MobileMenu.tsx` | `useState`（開閉状態） | Header から分離 |
| `components/common/CategoryFilter.tsx` | `useState`（選択カテゴリ） | /posts ページで使用 |
| `components/common/CookieBanner.tsx` | `useState` / `localStorage` | GA 同意管理 |
| `components/common/GoogleAnalytics.tsx` | `window.gtag` / `usePathname` | ページ遷移追跡 |
| `components/forms/SubscribeForm.tsx` | `useState` / fetch / フォームイベント | メールリスト登録 |
| `components/forms/ContactForm.tsx` | `useState` / fetch / reCAPTCHA / フォームイベント | お問い合わせ送信 |

### 境界パターン例

```
// ToolsSection.tsx（Server）
import SubscribeForm from "@/components/forms/SubscribeForm";

export default function ToolsSection({ tools }) {
  return (
    <section>
      {/* 静的コンテンツは Server で描画 */}
      <h2>Editor's Tools</h2>
      {/* インタラクティブ部分のみ Client に委譲 */}
      <SubscribeForm />
    </section>
  );
}
```

---

## 3. 型定義方針

### 正本：`content/types.ts`（C-5 管理、Codex 読み取り専用）

コンテンツ表示に関わるすべての型は `content/types.ts` を正本とする。
Codex はこのファイルを直接編集してはならない（読み取り専用）。

`content/types.ts` が確定している型（C-5 定義済み）：

| 型名 | 概要 |
|---|---|
| `Locale` | `"ja" \| "en"` |
| `LocalizedString` | `{ ja: string; en: string }` |
| `NavItem` | ナビゲーション項目 |
| `SocialAccount` | platform / locale / handle / url / label |
| `Category` | slug / label_ja / label_en / color |
| `Post` | slug / title_ja / title_en / category: string / publishedAt / thumbnail / excerpt_ja / excerpt_en / body: PostBody / relatedToolSlug / affiliateLinks / tags_ja / tags_en |
| `PostBody` | hook / data / explanation / practice / cta（各 `LocalizedString`） |
| `AffiliateLink` | アフィリエイトリンク情報 |
| `Tool` | slug / name: LocalizedString / category / description_ja\/en / preview / previewAlt_ja\/en / downloadType: `"email-gate"` |
| `RecommendedCategory` | 推奨カテゴリ |
| `RecommendedItem` | 推奨ツール項目 |
| `StructuredDataWebSite` | JSON-LD 用 |
| `StructuredDataOrganization` | JSON-LD 用 |
| `StructuredDataArticle` | JSON-LD 用 |
| `StructuredDataBreadcrumb` | JSON-LD 用 |

### 再エクスポート層・補助型：`lib/types.ts`（C-3 管理）

`lib/types.ts` は以下のみを担当する。コンテンツ型の再定義は行わない。

**役割 1: `content/types.ts` からの barrel 再エクスポート**

Codex が `@/lib/types` 単一パスで型を読み込めるようにするための薄い再エクスポート層。

```typescript
// lib/types.ts
export type {
  Locale,
  LocalizedString,
  NavItem,
  SocialAccount,
  Category,
  Post,
  PostBody,
  AffiliateLink,
  Tool,
  RecommendedCategory,
  RecommendedItem,
  StructuredDataWebSite,
  StructuredDataOrganization,
  StructuredDataArticle,
  StructuredDataBreadcrumb,
} from "@/content/types";
```

**役割 2: フォーム用 DTO（API 境界の型）**

```typescript
// lib/types.ts — フォーム・API I/O 型（content 側には置かない）

export type SubscribeFormInput = {
  email: string;
};

export type ContactFormInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ApiResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

**役割 3: サーバ側補助型（API Route / OG 生成用）**

```typescript
// lib/types.ts — サーバ専用型

export type SubscribeRequest = {
  email: string;
  recaptchaToken?: string;
};

export type ContactRequest = {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken: string;
};

export type OgImageParams = {
  title: string;
  category: string;
};
```

### `content/*.ts` の型安全パターン

```typescript
// content/posts.ts（例）
import type { Post } from "@/lib/types";

export const posts = [
  {
    slug: "001-loud-budgeting",
    // ...
  },
] as const satisfies Post[];
```

### `lib/utils.ts` シグネチャ（実装は Codex）

```typescript
// lib/utils.ts

/** CSS クラス名の条件結合（clsx 相当） */
export function cn(...classes: (string | undefined | false | null)[]): string;

/** 日付フォーマット（例: "2026年6月1日" / "June 1, 2026"） */
export function formatDate(date: string | Date, locale?: Locale): string;

/** スラッグから Post を取得（content/posts.ts を参照） */
export function getPostBySlug(slug: string): Post | undefined;

/** カテゴリでフィルタリング（Category.slug ベース） */
export function filterPostsByCategory(
  posts: Post[],
  categorySlug: string | "all"
): Post[];
```

---

## 4. API Route 設計

> **型の棲み分け：** コンテンツ表示用の型は `content/types.ts`（正本）が管理する。API Route のリクエスト/レスポンス DTO（`SubscribeRequest`, `ContactRequest`, `OgImageParams`, `ApiResult<T>` 等）は `lib/types.ts` で定義する。Codex は `@/lib/types` から両方を import できる。

### 4.1 `app/api/subscribe/route.ts`

**用途：** Editor's Tools のメールリスト登録

```typescript
// Request
// POST /api/subscribe
// Content-Type: application/json
// Body: { email: string }

// Response: ApiResponse<void>
// 200: 登録成功 + DL リンクメール送信
// 400: バリデーションエラー（メアド形式不正）
// 409: 既登録（重複）
// 429: レート制限（同一 IP: 5回/時）
// 500: Resend / Sheets API エラー
```

**処理フロー：**
1. メアドの形式バリデーション（正規表現）
2. Resend API で DL リンク付き自動応答メール送信（`RESEND_FROM` → 登録者）
3. Google Sheets API でメアドをリストに追記
4. `ApiResponse<void>` を返す

**ランタイム：** Node.js（デフォルト）

---

### 4.2 `app/api/contact/route.ts`

**用途：** お問い合わせフォーム転送

```typescript
// Request
// POST /api/contact
// Content-Type: application/json
// Body: { name: string; email: string; subject: string; message: string; recaptchaToken: string }

// Response: ApiResponse<void>
// 200: 送信成功
// 400: バリデーションエラー
// 403: reCAPTCHA スコア不足（閾値 0.5 未満）
// 429: レート制限（同一 IP: 3回/時）
// 500: Resend API エラー
```

**処理フロー：**
1. `recaptchaToken` を Google reCAPTCHA v3 API で検証（`RECAPTCHA_SECRET_KEY`）
2. スコア 0.5 未満は 403 を返す
3. フォームデータの全フィールドをバリデーション
4. Resend API で `CONTACT_TO`（hello@tokyo-decoded.com）へメール転送
5. 送信者への自動返信メールを送信
6. `ApiResponse<void>` を返す

**ランタイム：** Node.js（デフォルト）

---

### 4.3 `app/api/og/route.tsx`

**用途：** `/posts/[slug]` の OGP 画像動的生成

```typescript
// Request
// GET /api/og?title=...&category=...
// Query: { title: string; category: string }

// Response: PNG 画像（1200×630px）
// Content-Type: image/png
// Cache-Control: public, max-age=31536000, immutable
```

**処理フロー：**
1. `searchParams` から `title` / `category` を取得
2. `@vercel/og` の `ImageResponse` でブランドロゴ + タイトル + カテゴリを合成
3. フォント：Space Grotesk（英語）/ Noto Sans JP（日本語）を fetch で注入
4. 1200×630px PNG を返す

**ランタイム：** Edge（`export const runtime = "edge"` 必須）

---

### 4.4 レート制限方針

- 実装は Vercel の IP-based rate limiting（`vercel.json` の `ratelimit` 設定）を優先
- API Route 側でも簡易的な IP チェックを実装（`x-forwarded-for` ヘッダー参照）
- 超過時は `429 Too Many Requests` + `Retry-After` ヘッダーを返す

---

## 5. 環境変数

### `.env.local` 雛形（ローカル開発用）

```bash
# ----- Resend（メール配信）-----
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=noreply@tokyo-decoded.com
CONTACT_TO=hello@tokyo-decoded.com

# ----- reCAPTCHA v3 -----
RECAPTCHA_SITE_KEY=6Le...（公開鍵、NEXT_PUBLIC_ 不要・フロント用は別途）
RECAPTCHA_SECRET_KEY=6Le...（秘密鍵、サーバー専用）

# ----- Google Analytics 4 -----
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ----- サイト URL -----
NEXT_PUBLIC_SITE_URL=https://tokyo-decoded.com

# ----- Google Sheets（メールリスト管理）-----
GOOGLE_SHEETS_SPREADSHEET_ID=1xxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_SHEETS_CLIENT_EMAIL=serviceaccount@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
```

### 環境変数一覧（計 9 件）

| 変数名 | 公開 | 用途 |
|---|---|---|
| `RESEND_API_KEY` | 非公開 | Resend メール送信認証 |
| `RESEND_FROM` | 非公開 | 送信元アドレス |
| `CONTACT_TO` | 非公開 | 問い合わせ転送先アドレス |
| `RECAPTCHA_SITE_KEY` | 非公開（サーバー参照） | reCAPTCHA v3 サイトキー |
| `RECAPTCHA_SECRET_KEY` | 非公開 | reCAPTCHA v3 秘密鍵 |
| `NEXT_PUBLIC_GA_ID` | 公開（クライアント） | Google Analytics 4 測定 ID |
| `NEXT_PUBLIC_SITE_URL` | 公開（クライアント） | サイト正規 URL（OGP / sitemap 生成） |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | 非公開 | スプレッドシート ID |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | 非公開 | サービスアカウント |
| `GOOGLE_SHEETS_PRIVATE_KEY` | 非公開 | サービスアカウント秘密鍵 |

※ `RECAPTCHA_SITE_KEY` はフロントエンドの reCAPTCHA スクリプトでも必要なため、`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` として公開変数に昇格させることを検討する（Codex 実装時に確定）。

**合計：10 変数（NEXT_PUBLIC_ 2〜3 件、非公開 7〜8 件）**

### Vercel ダッシュボード登録

- 上記すべてを Vercel Project Settings > Environment Variables に登録
- `GOOGLE_SHEETS_PRIVATE_KEY` は改行を `\n` に変換して登録
- `NEXT_PUBLIC_*` はすべての環境（Production / Preview / Development）で有効化

---

## 6. i18n 戦略

### ルーティング設計

Next.js App Router の **ディレクトリベース多言語分離** を採用する。
`next.config.ts` の `i18n` オプションは App Router では非推奨のため使用しない。

```
/          → 日本語版（デフォルト）
/en/       → 英語版
/en/about
/en/posts
/en/posts/[slug]
...
```

### `app/en/layout.tsx`

```typescript
// app/en/layout.tsx
// lang 属性を "en" に上書きするレイアウト
// app/layout.tsx の metadata は日本語用のため、英語用を個別定義
export default function EnLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 言語切替トグル（`LangToggle.tsx`）

- `"use client"` コンポーネント
- 現在の URL パス（`usePathname`）から言語プレフィックスを判定
- 切替時は `router.push()` で `/en/...` ⇆ `/...` を対応パスに置換
- 現在の言語を Cookie（`lang`）に保存し、次回アクセス時に維持（有効期限 365日）
- 配置：Header 右上（Desktop）/ MobileMenu 内（Mobile）

### metadata の `alternates.languages`

各ページで以下のパターンを適用する（X-4 が実装）：

```typescript
// app/about/page.tsx（例）
export const metadata: Metadata = {
  alternates: {
    canonical: "https://tokyo-decoded.com/about",
    languages: {
      "ja": "https://tokyo-decoded.com/about",
      "en": "https://tokyo-decoded.com/en/about",
    },
  },
};
```

### コンテンツ分離方針

- `content/` 配下のファイルは `ja` / `en` キーで両言語を持つ構造とする（C-5 と整合）
- 例：`{ ja: "編集部について", en: "About Us" }` 形式を `content/navigation.ts` で定義

---

## 7. フォント読み込み

### next/font 設定（`app/layout.tsx` に実装）

```typescript
// app/layout.tsx に記述する宣言（Codex 向け参照仕様）

import { Space_Grotesk, Inter, Noto_Sans_JP } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",  // C-2 globals.css と整合
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",     // C-2 globals.css と整合
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "900"],
  variable: "--font-jp",       // C-2 globals.css と整合
  display: "swap",
});
```

### `body` への className 適用

```typescript
// layout.tsx RootLayout の body
<body
  className={`${spaceGrotesk.variable} ${inter.variable} ${notoSansJP.variable}`}
  suppressHydrationWarning
>
```

### C-2 (`globals.css`) との整合確認

C-2 は `@theme inline {}` 内で以下の CSS 変数を参照する。

| CSS 変数名 | next/font の variable | 用途 |
|---|---|---|
| `--font-display` | Space Grotesk | 英語見出し・ロゴ |
| `--font-sans` | Inter | 英語本文 |
| `--font-jp` | Noto Sans JP | 日本語見出し・本文 |

C-2 が `globals.css` で `font-family: var(--font-display)` と記述したとき、next/font が注入した CSS カスタムプロパティが適用される。

---

## 8. パフォーマンス方針

### 画像

- すべての画像は `next/image` コンポーネントを使用（`<img>` タグ禁止）
- `alt` テキスト必須（装飾目的の場合は `alt=""`）
- 投稿サムネイル（`/posts` 一覧の上位3件）には `priority` prop を付与
- アセットは WebP 形式で提供。`next/image` が自動変換するが、ソースも WebP 推奨
- `sizes` prop を適切に指定し、不要な大サイズ画像の配信を防ぐ

### Route Segment Config

| ページ | `dynamic` | `revalidate` | 理由 |
|---|---|---|---|
| `/` | `"force-static"` | 未指定（完全静的） | コンテンツ変更頻度低 |
| `/about` | `"force-static"` | 未指定 | 静的コンテンツ |
| `/posts` | デフォルト | `3600`（1時間 ISR） | 投稿追加に追従 |
| `/posts/[slug]` | デフォルト | `86400`（1日 ISR） | `generateStaticParams` で初期生成 |
| `/tools` | デフォルト | `86400` | ツール追加に追従 |
| `/recommended` | `"force-static"` | 未指定 | 初期は Coming Soon |
| `/privacy` | `"force-static"` | 未指定 | 静的テキスト |
| `/disclosure` | `"force-static"` | 未指定 | 静的テキスト |
| `/contact` | `"force-static"` | 未指定 | フォームのみ |
| `/api/og` | Edge | — | `runtime = "edge"` |

### `generateStaticParams` の設定

```typescript
// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  // content/posts.ts の全スラッグを静的生成対象に登録
  return posts.map((post) => ({ slug: post.slug }));
}
```

### その他

- Google Fonts は `next/font` 経由のためサードパーティリクエストなし（self-hosted）
- `GoogleAnalytics.tsx` は `<Suspense>` でラップし、初期レンダリングをブロックしない
- `CookieBanner.tsx` は `dynamic()` + `{ ssr: false }` で遅延ロードを検討

---

## 9. Codex 向け実装順序と責任境界

### X-1（`feature/components-layout`）

**担当ファイル：**
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/Navigation.tsx`
- `components/common/MobileMenu.tsx`（`"use client"`）
- `components/common/LangToggle.tsx`（`"use client"`）
- `components/common/CookieBanner.tsx`（`"use client"`）
- `components/common/GoogleAnalytics.tsx`（`"use client"`）
- `components/ui/Logo.tsx`
- `components/ui/Button.tsx`
- `app/layout.tsx`（next/font 注入 + GoogleAnalytics 配置）
- `app/en/layout.tsx`（lang="en" 設定）

**インタフェース（X-2 / X-3 が依存）：**
- `Button` props: `{ children: React.ReactNode; href?: string; variant?: "primary" | "outline" }`
- `Logo` props: `{ variant?: "color" | "black" | "white"; size?: "sm" | "md" | "lg" }`

---

### X-2（`feature/components-sections`）

**担当ファイル：**
- `components/sections/HeroSection.tsx`
- `components/sections/AboutMiniSection.tsx`
- `components/sections/LatestPostsSection.tsx`
- `components/sections/ToolsSection.tsx`
- `components/sections/RecommendedSection.tsx`
- `components/sections/ContactCtaSection.tsx`
- `components/ui/Card.tsx`
- `components/ui/CategoryTag.tsx`
- `components/forms/SubscribeForm.tsx`（`"use client"`）
- `components/forms/ContactForm.tsx`（`"use client"`）
- `components/common/CategoryFilter.tsx`（`"use client"`）

**依存関係（X-1 完了後に実装開始）：**
- `Button` / `Logo` / `LangToggle` の型・インタフェースが確定していること
- `content/types.ts` を正本とし、`lib/types.ts` で再エクスポートする構成が確定していること

---

### X-3（`feature/pages-and-api`）

**担当ファイル：**
- `app/page.tsx`（全セクションの組み立て）
- `app/about/page.tsx`
- `app/posts/page.tsx`
- `app/posts/[slug]/page.tsx`（`generateStaticParams`）
- `app/tools/page.tsx`
- `app/recommended/page.tsx`
- `app/privacy/page.tsx`
- `app/disclosure/page.tsx`
- `app/contact/page.tsx`
- `app/en/**/page.tsx`（英語版ページ群）
- `app/api/subscribe/route.ts`
- `app/api/contact/route.ts`
- `app/api/og/route.tsx`（`runtime = "edge"`）
- `lib/resend.ts`
- `lib/sheets.ts`
- `lib/recaptcha.ts`
- `lib/utils.ts`

**依存関係（X-1 / X-2 完了・main マージ後に実装開始）：**
- すべての sections / layout コンポーネントの import パスが確定していること
- `lib/types.ts` が確定していること

---

### X-4（`feature/metadata-seo`）

**担当ファイル：**
- `app/sitemap.ts`
- `app/robots.ts`
- 各 `page.tsx` への `metadata` / `generateMetadata` 追記（X-3 が空けたプレースホルダを埋める）
- JSON-LD の `<script>` タグ挿入（WebSite / Article / BreadcrumbList / Organization）

**依存関係：**
- `NEXT_PUBLIC_SITE_URL` 環境変数が設定済みであること
- X-3 の全ページが実装済みであること
- `content/posts.ts` のスラッグ一覧が確定していること

---

## 10. `next.config.ts` 更新仕様

現在の `next.config.ts` に以下を追加する（C-3 管理）：

```typescript
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  // @vercel/og（Edge Runtime）のための設定
  experimental: {
    // Next.js 16.x では特段の設定不要、Edge Runtime は route.tsx で宣言
  },

  // 外部画像ドメインの許可（アフィリエイト画像等が必要になった場合）
  images: {
    remotePatterns: [
      // 必要に応じて追加（Phase 2 確定時に更新）
    ],
  },

  // www → apex リダイレクト（Vercel の設定で対応するため不要な場合あり）
  // async redirects() {
  //   return [
  //     {
  //       source: "/:path*",
  //       has: [{ type: "host", value: "www.tokyo-decoded.com" }],
  //       destination: "https://tokyo-decoded.com/:path*",
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
```

---

## C-2 / C-5 との整合確認ポイント

### C-2（デザインシステム設計者）との整合

| 確認項目 | 本文書での定義 | C-2 が globals.css で参照する変数 |
|---|---|---|
| 見出しフォント変数名 | `--font-display` | `font-family: var(--font-display)` |
| 本文フォント変数名 | `--font-sans` | `font-family: var(--font-sans)` |
| 日本語フォント変数名 | `--font-jp` | `font-family: var(--font-jp)` |
| カラートークン命名 | brief.md §7.2 参照（`--color-ink` 等） | C-2 が `@theme inline {}` で定義 |

### C-5（コンテンツ・SEOストラテジスト）との整合

| 確認項目 | 本文書での定義 | C-5 への要求 |
|---|---|---|
| `content/*.ts` の型 | `lib/types.ts` に定義済み | `satisfies Post[]` 等で型チェックを通すこと |
| i18n コンテンツ | `ja` / `en` キーを持つオブジェクト構造 | 各 content ファイルに両言語を含めること |
| 投稿スラッグ | `posts.ts` に定義 | `generateStaticParams` で参照するため命名を固定すること |
| SNS アカウント情報 | `content/types.ts` の `SocialAccount` 型を `lib/types.ts` から再エクスポート | `content/footer.ts` に 8 アカウント分を記載すること |
```
