/**
 * app/(umum)/detail-ikan/[id]/page.tsx  –  SERVER COMPONENT
 *
 * KEY ARCHITECTURE RULE (from Next.js 16 docs):
 *     `generateMetadata` and the `metadata` export are ONLY supported in
 *     Server Components. A page cannot be both 'use client' AND export metadata.
 *
 * SOLUTION: This file is the Server Component shell.
 *  1. It runs `generateMetadata` on the server (fetches fish name for SEO).
 *  2. It passes the pre-fetched data as props to the Client Component,
 *     so the client does NOT need to re-fetch.
 *
 * The interactive UI lives in `_client.tsx` (marked 'use client').
 */

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Ikan } from "@/lib/types";
import IkanDetailClient from "./_client";

// ─── Types ────────────────────────────────────────────────────────────────────
// Next.js 16: params is a Promise (breaking change from v14).
// Docs: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
type Props = {
  params: Promise<{ id: string }>;
};

// ─── SEO: generateMetadata ────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: ikan } = await supabase
    .from("ikan")
    .select("nama_ikan, nama_ilmiah, deskripsi, gambar_url")
    .eq("id", id)
    .single<Pick<Ikan, "nama_ikan" | "nama_ilmiah" | "deskripsi" | "gambar_url">>();

  // If the fish doesn't exist, Next.js will render not-found.tsx
  if (!ikan) {
    return {
      title: "Ikan Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }

  // Extend (not overwrite) parent OG images so the site-level fallback
  // is preserved on pages that don't have their own image.
  const previousImages = (await parent).openGraph?.images ?? [];

  const ogImages = ikan.gambar_url
    ? [
        {
          url: ikan.gambar_url,
          width: 1200,
          height: 630,
          alt: `Foto ikan ${ikan.nama_ikan} di Ekowisata Bendungan Si Pleret`,
        },
        ...previousImages,
      ]
    : previousImages;

  // Short, punchy description (≤ 155 chars) for the SERP snippet
  const shortDesc = ikan.deskripsi
    ? ikan.deskripsi.slice(0, 140).trimEnd() + "…"
    : `Pelajari fakta menarik tentang ikan ${ikan.nama_ikan} di ensiklopedia perikanan Ekowisata Bendungan Si Pleret, Tingkir Tengah.`;

  return {
    // Resolves via root layout's title.template:
    // "Ikan Lele | Ekowisata Bendungan Si Pleret"
    title: ikan.nama_ikan,

    description: shortDesc,

    // Per-page canonical URL prevents duplicate-content penalties
    alternates: {
      canonical: `/detail-ikan/${id}`,
    },

    keywords: [
      ikan.nama_ikan,
      ikan.nama_ilmiah ?? "",
      "ikan air tawar",
      "ensiklopedia ikan",
      "wisata edukasi perikanan Salatiga",
      "Ekowisata Bendungan Si Pleret",
    ].filter(Boolean),

    openGraph: {
      title: `${ikan.nama_ikan} — Ensiklopedia Ikan Air Tawar`,
      description: shortDesc,
      url: `/detail-ikan/${id}`,
      type: "article",
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title: `${ikan.nama_ikan} — Ensiklopedia Ikan Air Tawar`,
      description: shortDesc,
      images: ikan.gambar_url ? [ikan.gambar_url] : [],
    },
  };
}

// ─── Page Component (Server Component shell) ──────────────────────────────────
export default async function IkanDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch once on the server – data is automatically memoized by Next.js
  // so this does NOT cause a second network round-trip vs generateMetadata.
  const { data: ikan, error } = await supabase
    .from("ikan")
    .select("*, spot_wisata(*)")
    .eq("id", id)
    .single<Ikan>();

  if (error || !ikan) {
    notFound(); // Renders app/(umum)/not-found.tsx (or global not-found)
  }

  // Delegate all interactivity to the Client Component
  return <IkanDetailClient ikan={ikan} />;
}
