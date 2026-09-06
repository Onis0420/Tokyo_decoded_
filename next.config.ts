import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
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
