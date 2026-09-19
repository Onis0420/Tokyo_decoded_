import type { Metadata } from "next";
import Link from "next/link";
import RootShell from "@/app/_shared/root-shell";

// ルートレイアウトを日英で分けたため、どのルートにも一致しないURLの404はここで描画する。
// 以前と同じく、サイトのヘッダー・フッター付きで日本語の外枠に載せる。
export const metadata: Metadata = {
  title: "404: This page could not be found.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootShell lang="ja">
      <section style={{ padding: "96px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>404</h1>
        <p style={{ marginTop: 12 }}>
          This page could not be found. / ページが見つかりませんでした。
        </p>
        <p style={{ marginTop: 24 }}>
          <Link href="/">Tokyo Decoded トップへ</Link>
          {" ・ "}
          <Link href="/en">English top</Link>
        </p>
      </section>
    </RootShell>
  );
}
