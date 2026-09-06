import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 2026-09-07: Editor's Tools ページ廃止。旧URLは編集部ページへ
  async redirects() {
    return [
      { source: "/tools", destination: "/about", permanent: true },
      { source: "/en/tools", destination: "/en/about", permanent: true },
    ];
  },
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // 2026-09-07: WebP のみ（既定の AVIF はエンコードが重く、スクリーンショット系の取得経路で描画されない事例あり）
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
