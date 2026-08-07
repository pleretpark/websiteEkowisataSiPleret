'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UMKM } from '@/lib/types'

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

function DetailProdukContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [product, setProduct] = useState<UMKM | null>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [relatedProducts, setRelatedProducts] = useState<UMKM[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()

      const { data: currentProduct } = await supabase
        .from('umkm')
        .select('*')
        .eq('id', id)
        .single()

      if (currentProduct) {
        setProduct(currentProduct)
          setSelectedImage(
            currentProduct.gambar_urls?.[0] ||
            currentProduct.gambar_url
          )

        const { data: allProducts } = await supabase
          .from('umkm')
          .select('*')

        if (allProducts) {
          const filtered = allProducts
            .filter((item) => item.id !== currentProduct.id)
            .slice(0, 3)

          setRelatedProducts(filtered)
        }
      }

      setLoading(false)
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        Produk tidak ditemukan
      </div>
    )
  }

  return (
    <main className="max-w-[1600px] mx-auto px-gutter py-xl">

      <div className="text-sm text-on-surface-variant mb-lg">
        UMKM &gt; {product.kategori} &gt; {product.nama_produk}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-xl">

<div>
  <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-md">
    <Image
      src={selectedImage}
      alt={product.nama_produk}
      fill
      priority
      className="object-cover"
    />
  </div>

  {(product.gambar_urls?.length ?? 0) > 1 && (
    <div className="flex gap-3 mt-4 overflow-x-auto">
      {product.gambar_urls!.map((img, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(img)}
          className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
            selectedImage === img
              ? 'border-primary'
              : 'border-outline-variant'
          }`}
        >
          <Image
            src={img}
            alt={`${product.nama_produk}-${index}`}
            fill
            className="object-cover"
          />
        </button>
      ))}
    </div>
  )}
</div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-xl">

          <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-sm px-md py-1 rounded-full font-medium">
            {product.kategori}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-on-surface mt-md">
            {product.nama_produk}
          </h1>

          <div className="text-primary font-bold text-5xl mt-lg">
            {formatPrice(product.harga)}
          </div>

          <p className="text-on-surface-variant mt-lg leading-relaxed">
            {product.deskripsi}
          </p>

          <div className="border border-outline-variant rounded-2xl p-md mt-xl">
            <div className="text-sm text-on-surface-variant">
              Nama UMKM
            </div>

            <div className="font-semibold text-on-surface">
              {product.nama_toko}
            </div>
          </div>

          <a
            href={`https://wa.me/${product.nomor_wa}?text=${encodeURIComponent(
            `Halo ${product.nama_toko}, saya tertarik untuk memesan produk ${product.nama_produk} yang ada di website Ekowisata Tingkir Tengah`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-xl bg-primary text-on-primary rounded-2xl py-4 text-center font-bold hover:shadow-lg transition-all"
          >
          Hubungi Penjual
          </a>

        </div>
      </div>

      <section className="mt-20">

        <div className="mb-lg">
          <h2 className="text-3xl font-bold text-on-surface">
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
            >
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full">

                <div className="relative h-64">
                  <Image
                    src={
    item.gambar_urls?.[0]
      || item.gambar_url
      || `/images/${item.kategori.toLowerCase()}.jpg`
  }
                    alt={item.nama_produk}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-md">

                  <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-xs px-sm py-1 rounded-full">
                    {item.kategori}
                  </span>

                  <h3 className="font-semibold text-xl mt-sm">
                    {item.nama_produk}
                  </h3>

                  <p className="text-sm text-on-surface-variant mt-sm line-clamp-2">
                    {item.deskripsi}
                  </p>

                  <div className="mt-md text-primary font-bold text-xl">
                    {formatPrice(item.harga)}
                  </div>

                </div>
              </div>
            </Link>
          ))}

        </div>

      </section>

    </main>
  )
}

export default function DetailProdukPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <DetailProdukContent />
    </Suspense>
  )
}