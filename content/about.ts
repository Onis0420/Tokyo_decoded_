// content/about.ts
// Tokyo Decoded LP — /about ページ本文
// C-5 管理ファイル。Codex は読み取り専用。

export const aboutContent = {
  meta: {
    heading: {
      ja: "編集部について",
      en: "About Us",
    },
  },

  mission: {
    heading: {
      ja: "私たちのミッション",
      en: "Our Mission",
    },
    body: {
      ja: "世界中に散らばる「次に来るもの」を、東京というフィルターを通して日本語と英語に翻訳すること。トレンドを追うだけでなく、データと文脈を丁寧に整理して届ける——それが Tokyo Decoded 編集部の仕事です。",
      en: "Our job is to translate what's coming — from around the world — through a Tokyo lens, into Japanese and English. We don't just chase trends. We bring the data and context that make them make sense.",
    },
  },

  strategy: {
    heading: {
      ja: "トレンドアービトラージという戦略",
      en: "The Trend Arbitrage Approach",
    },
    body: {
      ja: "米国・中国・韓国で生まれたトレンドが日本に浸透するまでには、平均3〜12ヶ月のタイムラグがあります。私たちはそのリードタイムを活用し、まだ日本語で語られていないコンセプトやデータを、いちはやくミレニアル世代に届けています。体験談ではなく「世界の情報を分析・整理して届ける編集部」として、情報の質と出典を最優先にしています。",
      en: "Global trends typically take three to twelve months to reach Japan from the US, China, or Korea. We use that lead time to surface concepts and data that haven't yet been covered in Japanese — bringing them to millennial readers while they're still fresh. We position ourselves not as personal reviewers, but as an editorial team that researches, synthesizes, and delivers with sources.",
    },
  },

  pillars: [
    {
      id: "beauty",
      name: {
        ja: "柱1：美容・健康の情報解説",
        en: "Pillar 1: Beauty & Health Intelligence",
      },
      share: "30%",
      body: {
        ja: "韓国の低速老化（저속노화）トレンドや米国皮膚科医の知見など、海外の美容データを日本語に翻訳。「成分」「データ」「専門家の見解」を軸に、先回り型のスキンケア情報を届けています。薬機法に配慮し、効能効果の断定は行いません。",
        en: "We translate international beauty data — from Korea's slow-aging movement to US dermatologist insights — into usable Japanese. We focus on ingredients, data, and expert perspectives to help readers get ahead of trends. We never make efficacy claims and stay fully compliant with Japanese pharmaceutical regulations.",
      },
    },
    {
      id: "lifestyle",
      name: {
        ja: "柱2：データで暮らしを設計",
        en: "Pillar 2: Data-Driven Lifestyle Design",
      },
      share: "30%",
      body: {
        ja: "中国・欧米で話題の生活雑貨から、睡眠・健康管理アプリまで、「忙しい大人の選択肢を世界中のデータで絞り込む」コンテンツを制作。比較表・ランキング・データ可視化を通して、個人の体験に頼らない情報設計を心がけています。",
        en: "From trending home goods in China and Europe to sleep and health apps, we narrow down the options for busy adults using global data. Comparison tables, rankings, and data visualizations help us stay factual and stay away from anecdote-based recommendations.",
      },
    },
    {
      id: "money-ai",
      name: {
        ja: "柱3：お金とAIの活用術",
        en: "Pillar 3: Money & AI in Practice",
      },
      share: "40%",
      body: {
        ja: "米国発「Loud Budgeting」「Soft Saving」など、新しいお金の価値観をデータとともに解説。ChatGPT・Claudeを使った家計管理の実演、海外の家計簿アプリ比較など、PC完結型のコンテンツを中心に発信。金融商品・投資に関する断定的な表現は使用しません。",
        en: "We explain new financial mindsets — like Loud Budgeting and Soft Saving — with the data behind them. We demonstrate AI-powered budgeting tools like ChatGPT and Claude, and compare household finance apps from around the world. We make no definitive investment or financial advice claims.",
      },
    },
  ],

  pillarsHeading: {
    ja: "コンテンツの3本柱",
    en: "Three Editorial Pillars",
  },

  postsLink: {
    label_ja: "投稿を見る",
    label_en: "View Posts",
    href: "/posts",
  },

  editorialStance: {
    heading: {
      ja: "編集スタンス",
      en: "Our Editorial Stance",
    },
    points: {
      ja: [
        {
          label: "データと出典を明記",
          body: "数値を使う場合は必ず出典を示します。推測と事実を混同しない文章を心がけています。",
        },
        {
          label: "断定より「見えてきました」",
          body: "「絶対」「最強」「100%」といった過度な表現は使いません。私たちが見てきたものをそのまま届けます。",
        },
        {
          label: "親しみやすさを大切に",
          body: "難しいテーマも、読んで「わかった」と思えるよう、やさしい言葉で構成します。",
        },
      ],
      en: [
        {
          label: "Sources cited, always",
          body: "Every figure comes with a source. We keep facts and speculation clearly separated.",
        },
        {
          label: "Observations, not absolutes",
          body: "We don't use words like 'absolutely,' 'best,' or 'guaranteed.' We share what we've seen.",
        },
        {
          label: "Written to be understood",
          body: "Even complex topics are written so that anyone can read them and walk away with something useful.",
        },
      ],
    },
  },

  team: {
    heading: {
      ja: "編集スタッフ",
      en: "The Editorial Team",
    },
    body: {
      ja: "東京・ベルリン・メキシコシティ・ロサンゼルス・ソウル出身の5名が、それぞれの担当分野で記事を執筆しています。全員が「数字は一次資料まで辿る」「やっていない検証は書かない」という同じ編集ルールで書き、公開前に編集部で出典と事実を確認します。",
      en: "Five editors from Tokyo, Berlin, Mexico City, Los Angeles and Seoul write within their own beats. Everyone follows the same rules — every figure traces to a primary source, and we never describe testing we did not do — and each piece is source-checked before it goes out.",
    },
    linkLabel: {
      ja: "記事一覧へ",
      en: "View articles",
    },
  },

  socialIntro: {
    heading: {
      ja: "SNSでも発信しています",
      en: "Follow Us on Social Media",
    },
    body: {
      ja: "Instagram と X で、日本語アカウントと英語アカウントの計4つを運用しています。記事の要点をカードや短い動画にして、プラットフォームごとに最適なかたちでお届けしています。",
      en: "We run four accounts — Instagram and X, each in Japanese and English. Article highlights become cards and short videos, shaped for how each platform is actually used.",
    },
  },

  contactCta: {
    heading: {
      ja: "取材・コラボのご相談",
      en: "Media & Collaboration Inquiries",
    },
    body: {
      ja: "メディア取材・PR案件・ASP提案など、お気軽にご連絡ください。",
      en: "For media inquiries, PR partnerships, or ASP proposals, please reach out anytime.",
    },
    link: {
      label_ja: "お問い合わせフォームへ",
      label_en: "Contact Us",
      href: "/contact",
    },
  },
} as const;
