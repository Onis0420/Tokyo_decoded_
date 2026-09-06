"use client";
// components/redesign/FooterTD.tsx — REDESIGN フッター（黒背景・主要メニュー/補足ページ・ロゴ入り）
// 2026-09-07: Editor's Tools の黒帯とメニューを撤去し、フッター全体を黒背景に
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function FooterTD() {
  const pathname = usePathname() ?? "/";
  const ja = !pathname.startsWith("/en");
  const b = ja ? "" : "/en";

  const mainMenu = [
    { href: `${b}/posts`, label: ja ? "記事一覧" : "Articles" },
    { href: `${b}/about`, label: ja ? "編集部について" : "About" },
    { href: `${b}/authors/mina-kiryu`, label: ja ? "編集スタッフ" : "Editors" },
    { href: `${b}/contact`, label: ja ? "お問い合わせ" : "Contact" },
  ];
  const legal = [
    { href: `${b}/editorial-policy`, label: ja ? "編集ポリシー" : "Editorial Policy" },
    { href: `${b}/disclosure`, label: ja ? "開示" : "Disclosure" },
    { href: `${b}/privacy`, label: ja ? "プライバシー" : "Privacy" },
  ];

  return (
    <footer className="td-scope td-footer" role="contentinfo">
      <div className="td-wrap">
        <div className="td-fmain">
          <div className="td-fbrand">
            <Link href={`${b}/`} aria-label="Tokyo Decoded ホーム">
              <Image className="td-logo" src="/brand/logo-horizontal.svg" alt="Tokyo Decoded" width={230} height={30} />
            </Link>
            <p className="td-ftag">
              {ja ? (
                <>東京拠点のバイリンガル編集部。海外⇄日本のトレンドを、<br />データと出典で読み解いて届けています。</>
              ) : (
                "A Tokyo-based bilingual editorial team, decoding global trends for Japan with data and sources."
              )}
            </p>
          </div>
          <nav className="td-fnav" aria-label={ja ? "フッター主要メニュー" : "Footer menu"}>
            <span className="td-fnavh">{ja ? "メニュー" : "Menu"}</span>
            {mainMenu.map((m) => (
              <Link key={m.href} className="td-fmenu" href={m.href}>{m.label}</Link>
            ))}
          </nav>
        </div>

        <div className="td-fbottom">
          <div className="td-flegal">
            {legal.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </div>
          <span className="td-fcopy">© 2026 Tokyo Decoded</span>
          <span className="td-en">DECODE THE WORLD FROM TOKYO</span>
        </div>
      </div>
    </footer>
  );
}
