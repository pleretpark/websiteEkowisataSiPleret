import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekowisata-sipleret.vercel.app";

export const metadata: Metadata = {
  // ─── metadataBase is REQUIRED for all absolute OG/Twitter URLs ───
  metadataBase: new URL(APP_URL),

  // ─── Title Template ───────────────────────────────────────────────
  // Child pages set `title: 'Detail Ikan Lele'` → renders as:
  // "Detail Ikan Lele | Ekowisata Bendungan Si Pleret"
  title: {
    default: "Ekowisata Bendungan Si Pleret — Wisata Alam & Edukasi Perikanan Salatiga",
    template: "%s | Ekowisata Bendungan Si Pleret",
  },

  // ─── Description (max ~155 chars) ────────────────────────────────
  description:
    "Jelajahi Ekowisata Bendungan Si Pleret di Tingkir Tengah, Salatiga. Wisata alam pemancingan, edukasi ikan air tawar, katalog UMKM lokal, peta wisata digital, dan paket jelajah desa yang ramah keluarga.",

  // ─── Long-tail Keywords ───────────────────────────────────────────
  keywords: [
    // Destination & Location
    "Ekowisata Bendungan Si Pleret",
    "wisata Tingkir Tengah Salatiga",
    "ekowisata Tingkir Tengah",
    "wisata alam Bendungan Si Pleret",
    "destinasi wisata Salatiga terbaru",
    "wisata alam tersembunyi Salatiga",
    // Fishing & Water
    "tempat pemancingan terdekat Salatiga",
    "pemancingan ikan air tawar Tingkir",
    "spot mancing ikan nila Salatiga",
    "spot mancing ikan lele Salatiga",
    "wisata memancing keluarga Salatiga",
    // Education
    "wisata edukasi perikanan Salatiga",
    "edukasi ikan air tawar Jawa Tengah",
    "ensiklopedia ikan air tawar",
    "belajar budidaya ikan lele",
    "belajar budidaya ikan nila",
    "wisata edukasi anak Salatiga",
    // Family & Budget
    "wisata keluarga murah Salatiga",
    "wisata alam murah meriah Jawa Tengah",
    "piknik keluarga di Salatiga",
    "wisata weekend Salatiga murah",
    // UMKM & Products
    "katalog UMKM Tingkir Tengah",
    "produk UMKM Salatiga",
    "olahan ikan lele Tingkir",
    "olahan ikan nila Tingkir",
    "produk unggulan UMKM Salatiga",
    "belanja produk lokal Salatiga",
    // Map & Tour
    "peta wisata digital Salatiga",
    "peta wisata Tingkir Tengah",
    "paket wisata jelajah desa Salatiga",
    "paket wisata desa Tingkir",
    "tour ekowisata Jawa Tengah",
    // Nature & Eco
    "wisata ekologi bendungan Salatiga",
    "ekowisata berbasis masyarakat",
    "wisata alam air tawar Jawa Tengah",
    "kearifan lokal Tingkir Tengah",
    // Broader
    "KKN Tingkir Tengah",
    "potensi wisata Kelurahan Tingkir Tengah",
    "wisata halal Salatiga",
    "tempat wisata hits Salatiga",
  ],

  // ─── Canonical URL ────────────────────────────────────────────────
  alternates: {
    canonical: "/",
    languages: { "id-ID": "/" },
  },

  // ─── Robots ───────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Open Graph (Facebook, WhatsApp, etc.) ────────────────────────
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: APP_URL,
    siteName: "Ekowisata Bendungan Si Pleret",
    title: "Ekowisata Bendungan Si Pleret — Wisata Alam & Edukasi Perikanan Salatiga",
    description:
      "Jelajahi Ekowisata Bendungan Si Pleret di Tingkir Tengah, Salatiga. Wisata alam pemancingan, edukasi ikan air tawar, katalog UMKM lokal, dan paket jelajah desa ramah keluarga.",
    images: [
      {
        url: "/og-image.jpg",          // Place a 1200×630 JPG at /public/og-image.jpg
        width: 1200,
        height: 630,
        alt: "Pemandangan Bendungan Si Pleret, Ekowisata Tingkir Tengah Salatiga",
      },
    ],
  },

  // ─── Twitter / X Card ─────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@sipleret_wisata",          // Ganti dengan handle Twitter/X Anda
    creator: "@sipleret_wisata",
    title: "Ekowisata Bendungan Si Pleret — Wisata Alam & Edukasi Perikanan Salatiga",
    description:
      "Wisata alam pemancingan, edukasi ikan air tawar, katalog UMKM lokal, dan paket jelajah desa ramah keluarga di Tingkir Tengah, Salatiga.",
    images: ["/og-image.jpg"],
  },

  // ─── Verification (isi setelah verifikasi Google Search Console) ──
  verification: {
    google: "V_8hQjcW7d9dVKx-7I7sC9K7_EKAqdWB7z3ePYPWbe0",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${lexend.variable} antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col font-[var(--font-lexend)]">

        {children}
      </body>
    </html>
  );
}
