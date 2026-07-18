import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ekowisata Tingkir Tengah - Pesona Air Tawar",
  description:
    "Platform digital ekowisata dan pemetaan potensi Kelurahan Tingkir Tengah. Temukan harmoni alam dan kearifan lokal dalam setiap tetes air.",
  keywords: [
    "ekowisata",
    "tingkir tengah",
    "air tawar",
    "UMKM",
    "salatiga",
    "wisata",
  ],
};
import VisitorTracker from "./_components/VisitorTracker";

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
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
