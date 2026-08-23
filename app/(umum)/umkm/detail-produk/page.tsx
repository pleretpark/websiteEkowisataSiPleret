/**
 * app/(umum)/umkm/detail-produk/page.tsx  –  SERVER COMPONENT SHELL
 *
 * ─── PATTERN EXPLANATION ──────────────────────────────────────────────────
 * Your UMKM detail page uses a QUERY PARAM (?id=...) rather than a path
 * segment (/umkm/[id]). This means:
 *
 *  generateMetadata CAN read `searchParams` – this works fine.
 *  Query-param URLs are harder for Google to index than clean paths.
 *      RECOMMENDATION: Migrate to /umkm/[id]/page.tsx at some point for
 *      best SEO. See the commented-out section at the bottom of this file
 *      for the [id] pattern.
 *
 * ─── ARCHITECTURE ─────────────────────────────────────────────────────────
 *  This file    = Server Component (exports generateMetadata + page shell)
 *  _client.tsx  = Client Component (all useState / useEffect / interactivity)
 * ──────────────────────────────────────────────────────────────────────────
 */

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UMKM } from "@/lib/types";
import DetailProdukClient from "./_client";

// ─── Types ────────────────────────────────────────────────────────────────────
// Next.js 16: searchParams is a Promise (breaking change from v14).
type Props = {
  searchParams: Promise<{ id?: string }>;
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// ─── SEO: generateMetadata ────────────────────────────────────────────────────
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await searchParams;

  if (!id) {
    return { title: "Produk Tidak Ditemukan", robots: { index: false, follow: false } };
  }

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("umkm")
    .select("nama_produk, nama_toko, deskripsi, kategori, harga, gambar_url")
    .eq("id", id)
    .single<
      Pick<UMKM, "nama_produk" | "nama_toko" | "deskripsi" | "kategori" | "harga" | "gambar_url">
    >();

  if (!product) {
    return { title: "Produk Tidak Ditemukan", robots: { index: false, follow: false } };
  }

  const previousImages = (await parent).openGraph?.images ?? [];
  const ogImages = product.gambar_url
    ? [
        {
          url: product.gambar_url,
          width: 1200,
          height: 630,
          alt: `Foto produk ${product.nama_produk} dari ${product.nama_toko}`,
        },
        ...previousImages,
      ]
    : previousImages;

  // Craft a rich description that includes the price for click-through rate
  const priceStr = formatPrice(product.harga);
  const shortDesc =
    product.deskripsi.slice(0, 100).trimEnd() +
    `… Harga mulai ${priceStr}. Produk UMKM lokal dari ${product.nama_toko}, Tingkir Tengah Salatiga.`;

  return {
    // Resolves with title.template → "Keripik Lele Bu Siti | Ekowisata Bendungan Si Pleret"
    title: product.nama_produk,

    description: shortDesc,

    alternates: {
      canonical: `/umkm/detail-produk?id=${id}`,
    },

    keywords: [
      product.nama_produk,
      product.nama_toko,
      `produk ${product.kategori} Salatiga`,
      "UMKM Tingkir Tengah",
      "olahan ikan lele Salatiga",
      "belanja produk lokal Salatiga",
    ],

    openGraph: {
      title: `${product.nama_produk} — ${product.nama_toko} | UMKM Tingkir Tengah`,
      description: shortDesc,
      url: `/umkm/detail-produk?id=${id}`,
      type: "website",
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
      title: `${product.nama_produk} — ${product.nama_toko}`,
      description: shortDesc,
      images: product.gambar_url ? [product.gambar_url] : [],
    },
  };
}

// ─── Page Component (Server shell) ────────────────────────────────────────────
export default async function DetailProdukPage({ searchParams }: Props) {
  const { id } = await searchParams;
  if (!id) notFound();

  const supabase = await createClient();

  // Fetch full product – memoized with generateMetadata's fetch above
  const { data: product, error } = await supabase
    .from("umkm")
    .select("*")
    .eq("id", id)
    .single<UMKM>();

  if (error || !product) notFound();

  // Fetch 3 related products (different from current)
  const { data: allProducts } = await supabase
    .from("umkm")
    .select("*")
    .neq("id", id)
    .limit(3)
    .returns<UMKM[]>();

  return (
    <DetailProdukClient
      product={product}
      relatedProducts={allProducts ?? []}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BONUS: If you ever migrate to /umkm/[id], the generateMetadata
//    signature changes slightly (params instead of searchParams):
//
// type Props = { params: Promise<{ id: string }> }
//
// export async function generateMetadata({ params }: Props, ...): Promise<Metadata> {
//   const { id } = await params;   // ← comes from the URL path, not query string
//   ...
// }
// ─────────────────────────────────────────────────────────────────────────────