import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF first, WebP as the fallback; originals are at most 1280px wide.
    formats: ["image/avif", "image/webp"],
  },
  // Sections of the old site that only had placeholder content.
  // Redirect to "/" — the proxy then picks the visitor's language.
  async redirects() {
    return [
      { source: "/news/:path*", destination: "/", permanent: true },
      { source: "/vacancies", destination: "/", permanent: true },
      { source: "/details/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
