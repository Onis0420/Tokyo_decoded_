// lib/text.ts — 本文の段落分割（描画専用・データは変えない）
//
// 記事JSONの各セクションは 600〜1,000 字の単一文字列で、改行（\n）が入っていても
// 以前の描画は 1 つの <p> に潰していた（スマホで画面3枚分の「壁」になっていた・2026-09-07）。
// ここでは (1) 改行で段落に分け、(2) 改行が無い長い段落は 3 文前後で自動分割する。

type Locale = "ja" | "en";

const JA_MAX = 320;   // これより長い段落は文単位で分ける
const EN_MAX = 600;

function splitJaSentences(text: string): string[] {
  // 「。」の後で区切る。ただし直後が閉じ括弧（」）』）の場合は区切らない
  return text.split(/(?<=。)(?![」』）\)])/).map((s) => s.trim()).filter(Boolean);
}

function splitEnSentences(text: string): string[] {
  // ピリオド等 + 空白 + 大文字/引用符 の位置で区切る（4.9% のような小数では区切らない）
  return text.split(/(?<=[.!?]["'”)\]]?)\s+(?=[A-Z"“'(\[])/).map((s) => s.trim()).filter(Boolean);
}

function groupSentences(sentences: string[], perGroup: number, minChars: number, joiner: string): string[] {
  const out: string[] = [];
  let buf: string[] = [];
  for (const s of sentences) {
    buf.push(s);
    const joined = buf.join(joiner);
    if (buf.length >= perGroup && joined.length >= minChars) {
      out.push(joined);
      buf = [];
    }
  }
  if (buf.length) {
    const rest = buf.join(joiner);
    // 末尾が短すぎる場合は前の段落に吸収する
    if (out.length && rest.length < minChars / 2) out[out.length - 1] += joiner + rest;
    else out.push(rest);
  }
  return out;
}

export function splitParagraphs(text: string, locale: Locale): string[] {
  const chunks = text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const out: string[] = [];
  for (const c of chunks) {
    if (locale === "ja") {
      if (c.length <= JA_MAX) { out.push(c); continue; }
      out.push(...groupSentences(splitJaSentences(c), 3, 160, ""));
    } else {
      if (c.length <= EN_MAX) { out.push(c); continue; }
      out.push(...groupSentences(splitEnSentences(c), 3, 300, " "));
    }
  }
  return out.length ? out : [text];
}
