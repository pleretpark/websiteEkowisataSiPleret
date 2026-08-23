/**
 * app/robots.ts
 *
 * Next.js 16 App Router – programmatic robots.txt generator.
 * Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md
 *
 * NOTE: Set NEXT_PUBLIC_SITE_URL in .env.local and Vercel env vars.
 */

import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekowisata-sipleret.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─── Allow all crawlers on all public content ──────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",          // Admin dashboard – never indexed
          "/api/",            // API routes – not meant for search engines
          "/_next/",          // Next.js internals
        ],
      },
      // ─── Googlebot – explicit permissions for maximum crawl budget ─
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/admin/", "/api/"],
        crawlDelay: 2,        // Be polite on a small hosting plan
      },
    ],
    // ─── Point to the programmatic sitemap ──────────────────────────────
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
