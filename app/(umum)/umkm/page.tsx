'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UMKM } from '@/lib/types'

const categories = ['Semua', 'Makanan', 'Kerajinan', 'Minuman', 'Lainnya']

function getCategoryStyle(kategori: string) {
  switch (kategori) {
    case 'Makanan':
    case 'Minuman':
      return 'bg-secondary-fixed text-on-secondary-fixed'
    case 'Kerajinan':
      return 'bg-tertiary-fixed text-on-tertiary-fixed'
    default:
      return 'bg-primary-fixed text-on-primary-fixed'
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(price)
}

export default function UMKMPage() {
  const [products, setProducts] = useState<UMKM[]>([])
  const [filteredProducts, setFilteredProducts] = useState<UMKM[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('umkm')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) {
          setProducts(data)
          setFilteredProducts(data)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (activeCategory !== 'Semua') {
      filtered = filtered.filter((p) => p.kategori === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.nama_produk.toLowerCase().includes(q) ||
          p.nama_toko.toLowerCase().includes(q) ||
          p.deskripsi.toLowerCase().includes(q)
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, activeCategory, products])

  return (
    <>
      {/* Header */}
      <header className="px-gutter max-w-[1000px] mx-auto pt-lg pb-xl mt-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight tracking-tight mt-xs mb-sm">
          Katalog <span className="text-[#003d37] italic font-medium">UMKM</span>
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-md max-w-[800px] mx-auto">
          Temukan produk asli buatan pengrajin dan produsen lokal di Tingkir Tengah. Dari ikan asap tradisional hingga kerajinan bambu berkelanjutan.
        </p>

        {/* Search */}
        <div className="mb-md relative max-w-[40rem] mx-auto">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant text-[24px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk atau toko..."
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-full pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface placeholder:text-outline-variant transition-all shadow-sm text-base md:text-lg"
            id="search-input"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-xs mt-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-md py-2 rounded-full font-medium text-sm transition-all flex items-center gap-xs ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              {cat === 'Semua' ? 'Semua Produk' : cat}
            </button>
          ))}
        </div>
      </header>

      {/* Catalog Grid */}
      <section id="catalog" className="py-xl bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto px-gutter">

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-lg">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-surface-container-lowest rounded-2xl p-sm">
                  <div className="h-48 rounded-xl animate-shimmer mb-sm" />
                  <div className="h-5 w-3/4 rounded animate-shimmer mb-xs" />
                  <div className="h-4 w-full rounded animate-shimmer mb-xs" />
                  <div className="h-6 w-1/2 rounded animate-shimmer" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-6xl text-outline-variant">
                inventory_2
              </span>
              <p className="text-on-surface-variant text-lg mt-md">
                Tidak ada produk ditemukan untuk pencarian tersebut.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-lg">
              {filteredProducts.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/umkm/detail-produk?id=${item.id}`} className="block"
                >
                  <div
                    className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm hover:shadow-ambient transition-all duration-300 flex flex-col h-full animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden rounded-xl h-48 mb-sm bg-surface-container shrink-0">
                      <Image
                        src={item.gambar_url && !item.gambar_url.includes('unsplash') ? item.gambar_url : `/images/${item.kategori.toLowerCase()}.jpg`}
                        alt={item.nama_produk}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`${getCategoryStyle(item.kategori)} text-xs px-sm py-1 rounded-full font-bold backdrop-blur-md`}
                        >
                          {item.kategori}
                        </span>
                      </div>
                    </div>
                    <div className="px-xs flex flex-col flex-grow justify-between mt-sm">
                      <div>
                        <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight">
                          {item.nama_produk}
                        </h3>
                        <p className="text-on-surface-variant text-sm mt-xs line-clamp-2">
                          {item.deskripsi}
                        </p>
                      </div>
                      <div className="mt-auto pt-md flex items-center justify-between gap-xs">
                        <span className="text-primary font-bold text-lg">
                          {formatPrice(item.harga)}
                        </span>
                        <span
                          className="bg-primary text-on-primary font-bold px-md py-2 rounded-full transition-all flex items-center gap-xs text-sm"
                        >
                          Detail
                          {/* <span className="material-symbols-outlined text-base">
                            arrow_forward
                          </span> */}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xl mb-xl">
        <div className="max-w-[1400px] mx-auto px-gutter">
          <div className="bg-surface-container rounded-3xl py-lg px-md flex flex-col items-center text-center">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-xs">
              Dukung UMKM Lokal
            </h2>

            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed max-w-[55rem] mb-md">
              Setiap pembelian langsung mendukung mata pencaharian keluarga di Tingkir Tengah. Bersama, kita melestarikan tradisi dan membangun masa depan yang berkelanjutan.
            </p>

            <a
              href="https://wa.me/6281392382113?text=Halo%20Admin,%20saya%20ingin%20mendaftarkan%20produk%20UMKM%20ke%20website%20Ekowisata%20Tingkir%20Tengah."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-xs border-2 border-primary text-primary hover:bg-primary hover:text-on-primary font-medium px-lg py-2.5 rounded-full transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">
                storefront
              </span>
              Daftarkan Produk Anda
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
