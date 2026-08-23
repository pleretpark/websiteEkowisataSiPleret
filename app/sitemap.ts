/**
 * app/sitemap.ts
 *
 * Next.js 16 App Router – programmatic sitemap generator.
 * Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md
 *
 * HOW TO ADD DYNAMIC RECORDS:
 *  1. Call your Supabase helper (server-side) to fetch IDs / slugs.
 *  2. Spread the mapped array into the returned Sitemap array.
 *  3. The function is async so `await` is allowed.
 *
 * NOTE: Set NEXT_PUBLIC_SITE_URL in your .env.local (and Vercel env vars)
 *     to match the production domain exactly (no trailing slash).
 */

import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server"; // server-side Supabase client

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekowisata-sipleret.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─── 1. Static routes ─────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/peta-wisata`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/umkm`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/detail-ikan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // ─── 2. Dynamic routes – fetch from Supabase ──────────────────────────────
  //
  // NOTE: createClient() here is the SERVER-SIDE helper (uses cookies / service
  // role key). Do NOT import the browser client here.

  let ikanRoutes: MetadataRoute.Sitemap = [];
  let beritaRoutes: MetadataRoute.Sitemap = [];
  let umkmRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();

    // --- Fish detail pages (/detail-ikan/[id]) ---
    const { data: ikanList } = await supabase
      .from("ikan")
      .select("id, updated_at")
      .order("created_at", { ascending: false });

    if (ikanList) {
      ikanRoutes = ikanList.map((ikan) => ({
        url: `${BASE_URL}/detail-ikan/${ikan.id}`,
        lastModified: new Date(ikan.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }

    // --- News article pages (/berita/[slug]) ---
    const { data: beritaList } = await supabase
      .from("berita")
      .select("slug, updated_at")
      .order("tanggal_publikasi", { ascending: false });

    if (beritaList) {
      beritaRoutes = beritaList.map((berita) => ({
        url: `${BASE_URL}/berita/${berita.slug}`,
        lastModified: new Date(berita.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
    }

    // --- UMKM product detail pages (/umkm/detail-produk?id=...) ---
    // Note: query-param pages are harder to index than path segments.
    // Consider migrating to /umkm/[id] for better SEO.
    const { data: umkmList } = await supabase
      .from("umkm")
      .select("id, updated_at")
      .order("created_at", { ascending: false });

    if (umkmList) {
      umkmRoutes = umkmList.map((umkm) => ({
        url: `${BASE_URL}/umkm/detail-produk?id=${umkm.id}`,
        lastModified: new Date(umkm.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    // Never crash the build due to a sitemap fetch error.
    console.error("[sitemap.ts] Failed to fetch dynamic routes:", err);
  }

  // ─── 3. Merge & return ────────────────────────────────────────────────────
  return [...staticRoutes, ...ikanRoutes, ...beritaRoutes, ...umkmRoutes];
}
