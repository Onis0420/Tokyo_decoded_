// content/home.ts
// Tokyo Decoded LP — トップページ文言
// C-5 管理ファイル。Codex は読み取り専用。

export const homeContent = {
  hero: {
    h1: {
      ja: "東京から世界を読み解き、日本を世界へ翻訳する編集部。",
      en: "Decoding the world from Tokyo, decoding Japan for the world.",
    },
    subcopy: {
      ja: "お金・暮らし・美容——世界中のトレンドをデータで読み解き、あなたの日常を豊かにするヒントを届けています。",
      en: "Money, lifestyle, beauty — we read global trends through data and bring you the insights that make everyday life a little smarter.",
    },
    cta: {
      primary: {
        label_ja: "最新投稿を見る",
        label_en: "See Latest Posts",
        href: "/posts",
      },
      secondary: {
        label_ja: "編集部について",
        label_en: "About the Team",
        href: "/about",
      },
    },
  },

  aboutMini: {
    heading: {
      ja: "私たちは何者か",
      en: "About Us",
    },
    body: {
      ja: "Tokyo Decoded編集部は、東京を拠点とするバイリンガルのリサーチチームです。米国・中国・韓国など世界のトレンドを分析し、日本のミレニアル世代が使える言葉に翻訳して届けています。データと出典を大切にしながら、「知ってよかった」と思える情報を探し続けています。",
      en: "We're a bilingual research team based in Tokyo. We track trends from the US, China, Korea, and beyond — then translate them into something useful for millennial audiences in Japan and around the world. Data, sources, and real-world relevance come first.",
    },
    link: {
      label_ja: "編集部について詳しく見る",
      label_en: "More about us",
      href: "/about",
    },
  },

  latestPosts: {
    heading: {
      ja: "最新投稿",
      en: "Latest Posts",
    },
    viewAll: {
      label_ja: "すべての投稿を見る",
      label_en: "View All Posts",
      href: "/posts",
    },
  },

  tools: {
    heading: {
      ja: "Editor's Tools — 無料配布中",
      en: "Editor's Tools — Free Download",
    },
    lede: {
      ja: "私たちが実際に使っているリサーチ・家計管理のフレームワークを、だれでも使えるかたちで配布しています。メールアドレスを登録するとダウンロードリンクをお送りします。",
      en: "We're sharing the research and budgeting frameworks we actually use — packaged for anyone to download. Register your email and we'll send you the link.",
    },
    pillars: {
      ja: [
        {
          label: "世界のデータを整理する",
          body: "海外のリサーチを読み解くための構造化テンプレート",
        },
        {
          label: "お金の流れを可視化する",
          body: "家計管理をシンプルに続けるためのDigital Kakeibo",
        },
        {
          label: "トレンドを日常に落とし込む",
          body: "SNS発のトレンドを自分の生活に応用するワークシート",
        },
      ],
      en: [
        {
          label: "Organize global data",
          body: "A structured template for making sense of international research",
        },
        {
          label: "Visualize your money flow",
          body: "A Digital Kakeibo for simple, lasting household budgeting",
        },
        {
          label: "Apply trends to everyday life",
          body: "A worksheet for translating SNS trends into your own daily habits",
        },
      ],
    },
    formLabel: {
      ja: "メールアドレスを入力してダウンロード",
      en: "Enter your email to download",
    },
    formCta: {
      ja: "無料でダウンロード",
      en: "Download for free",
    },
    formSuccess: {
      ja: "送信しました。受信ボックスをご確認ください。（迷惑メールフォルダにある場合があります）",
      en: "Sent! Please check your inbox. (It might land in your spam folder.)",
    },
    formError: {
      ja: "送信に失敗しました。時間をおいて再度お試しください。",
      en: "Something went wrong. Please try again in a moment.",
    },
  },

  recommended: {
    heading: {
      ja: "Tokyo Decoded厳選 推奨ツール",
      en: "Tokyo Decoded Picks",
    },
    lede: {
      ja: "編集部が実際に調査・検証したサービスやツールをカテゴリ別に紹介しています。アフィリエイトリンクを含む場合があります（PR）。",
      en: "Services and tools we've researched and verified — organized by category. Some links may be affiliate links (sponsored).",
    },
    viewAll: {
      label_ja: "すべて見る",
      label_en: "View All",
      href: "/recommended",
    },
  },

  contact: {
    heading: {
      ja: "お問い合わせ",
      en: "Get in Touch",
    },
    body: {
      ja: "メディア取材・ASP案件・コラボのご相談など、お気軽にどうぞ。",
      en: "Media inquiries, partnership opportunities, and collaboration ideas — we'd love to hear from you.",
    },
    cta: {
      label_ja: "お問い合わせフォームへ",
      label_en: "Contact Us",
      href: "/contact",
    },
  },
} as const;
