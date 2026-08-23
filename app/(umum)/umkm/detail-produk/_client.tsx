'use client'

/**
 * app/(umum)/umkm/detail-produk/_client.tsx  –  CLIENT COMPONENT
 *
 * Handles all interactive UI for the UMKM product detail page.
 * Data is passed as props from the Server Component parent – no re-fetch needed.
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { UMKM } from '@/lib/types'

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

interface Props {
  product: UMKM
  relatedProducts: UMKM[]
}

export default function DetailProdukClient({ product, relatedProducts }: Props) {
  const initialImage =
    product.gambar_urls?.[0] ?? product.gambar_url ?? '/images/produk.jpg'

  const [selectedImage, setSelectedImage] = useState(initialImage)

  return (
    <main className="max-w-[1600px] mx-auto px-gutter py-xl">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-on-surface-variant mb-lg">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:underline">Beranda</Link></li>
          <li aria-hidden="true">&gt;</li>
          <li><Link href="/umkm" className="hover:underline">UMKM</Link></li>
          <li aria-hidden="true">&gt;</li>
          <li aria-current="page">{product.nama_produk}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-xl">

        {/* Gallery */}
        <div>
          <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-md">
            <Image
              src={selectedImage}
              alt={`Foto produk ${product.nama_produk} dari ${product.nama_toko}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {(product.gambar_urls?.length ?? 0) > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto" role="tablist" aria-label="Pilih foto produk">
              {product.gambar_urls!.map((img, index) => (
                <button
                  key={index}
                  role="tab"
                  aria-selected={selectedImage === img}
                  aria-label={`Foto ${index + 1} dari ${product.nama_produk}`}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-primary'
                      : 'border-outline-variant'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.nama_produk} gambar ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <article className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-xl">

          <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-sm px-md py-1 rounded-full font-medium">
            {product.kategori}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-on-surface mt-md">
            {product.nama_produk}
          </h1>

          <p className="text-primary font-bold text-4xl mt-lg" aria-label={`Harga: ${formatPrice(product.harga)}`}>
            {formatPrice(product.harga)}
          </p>

          <p className="text-on-surface-variant mt-lg leading-relaxed">
            {product.deskripsi}
          </p>

          <div className="border border-outline-variant rounded-2xl p-md mt-xl">
            <div className="text-sm text-on-surface-variant">Nama UMKM</div>
            <div className="font-semibold text-on-surface">{product.nama_toko}</div>
          </div>

          <a
            href={`https://wa.me/${product.nomor_wa}?text=${encodeURIComponent(
              `Halo ${product.nama_toko}, saya tertarik untuk memesan produk ${product.nama_produk} yang ada di website Ekowisata Tingkir Tengah`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Hubungi ${product.nama_toko} via WhatsApp untuk memesan ${product.nama_produk}`}
            className="block mt-xl bg-primary text-on-primary rounded-2xl py-4 text-center font-bold hover:shadow-lg transition-all"
          >
            Hubungi Penjual via WhatsApp
          </a>
        </article>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20" aria-labelledby="related-heading">
          <div className="mb-lg">
            <h2 id="related-heading" className="text-3xl font-bold text-on-surface">
              Produk Terkait
            </h2>
            <p className="text-on-surface-variant mt-xs">
              Produk UMKM lainnya yang mungkin Anda sukai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/umkm/detail-produk?id=${item.id}`}
                aria-label={`Lihat detail produk ${item.nama_produk}`}
              >
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full">
                  <div className="relative h-64">
                    <Image
                      src={
                        item.gambar_urls?.[0] ??
                        item.gambar_url ??
                        `/images/${item.kategori.toLowerCase()}.jpg`
                      }
                      alt={`Foto produk ${item.nama_produk}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-md">
                    <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-xs px-sm py-1 rounded-full">
                      {item.kategori}
                    </span>
                    <h3 className="font-semibold text-xl mt-sm">{item.nama_produk}</h3>
                    <p className="text-sm text-on-surface-variant mt-sm line-clamp-2">
                      {item.deskripsi}
                    </p>
                    <p className="mt-md text-primary font-bold text-xl">
                      {formatPrice(item.harga)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
