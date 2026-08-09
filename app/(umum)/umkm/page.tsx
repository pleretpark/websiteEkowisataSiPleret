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
      {/* Hero */}
      <section className="mt-md px-gutter max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center py-xl">
          <div>
            <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed text-sm font-bold px-md py-1 rounded-full mb-md">
              Kearifan Lokal & Ekonomi
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
              Katalog UMKM
              <br />
              Tingkir Tengah
            </h1>
            <p className="text-on-surface-variant text-lg mt-md leading-relaxed max-w-[28rem]">
              Temukan produk asli buatan pengrajin dan produsen lokal. Dari ikan
              asap tradisional hingga kerajinan bambu berkelanjutan.
            </p>
            <a
              href="#catalog"
              className="inline-flex items-center gap-xs mt-lg bg-primary text-on-primary font-bold px-xl py-sm rounded-full hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Jelajahi Katalog
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
          <div className="relative">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-tertiary/10 rounded-full animate-float blur-2xl" />
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-ambient-lg">
              <Image
                src="/images/umkm-ikan-asap.png"
                alt="Produk UMKM Tingkir Tengah"
                width={600}
                height={400}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="py-xl bg-surface-container-low">
        <div className="max-w-[1600px] mx-auto px-gutter">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">
                Jelajahi Produk Lokal
              </h2>
              <p className="text-on-surface-variant text-base mt-xs">
                Mendukung lebih dari 50 pelaku usaha mikro lokal
              </p>
            </div>
            {/* Category Chips */}
            <div className="flex flex-wrap gap-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-md py-2 rounded-full font-medium text-sm transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
                  }`}
                  id={`filter-${cat.toLowerCase()}`}
                >
                  {cat === 'Semua' ? 'Semua Produk' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="mb-lg relative max-w-[28rem]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk atau toko..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface placeholder:text-outline transition-all"
              id="search-input"
            />
          </div>

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
                  href={`/umkm/detail-produk?id=${item.id}`}                  className="block"
                >
                  <div
                    className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm hover:shadow-ambient transition-all duration-300 flex flex-col h-full animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                <div className="relative overflow-hidden rounded-xl h-48 mb-sm bg-surface-container">
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
                    <div className="mt-md flex items-center justify-between gap-xs">
                      <span className="text-primary font-bold text-lg">
                        {formatPrice(item.harga)}
                      </span>
                    <span
                        className="bg-primary text-on-primary font-bold px-md py-2 rounded-full transition-all flex items-center gap-xs text-sm"
                    >
                      Detail Produk
                      <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span>
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
<section className="py-xl">
  <div className="max-w-[1600px] mx-auto px-gutter">
    <div className="bg-surface-container rounded-3xl p-xl flex flex-col md:flex-row items-center gap-lg">
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
          Dukung Kearifan Lokal
        </h2>

        <p className="text-on-surface-variant text-lg mt-md leading-relaxed">
          Setiap pembelian langsung mendukung mata pencaharian keluarga di
          Tingkir Tengah. Bersama, kita melestarikan tradisi dan membangun
          masa depan yang berkelanjutan.
        </p>

        <div className="mt-lg">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20mendaftarkan%20produk%20UMKM%20ke%20website%20Ekowisata%20Tingkir%20Tengah."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-xs bg-primary text-on-primary font-bold px-xl py-sm rounded-full hover:shadow-xl transition-all"
          >
            Daftarkan Produk
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </a>
        </div>
      </div>

      <div className="w-32 h-32 bg-tertiary-fixed-dim rounded-full flex items-center justify-center shadow-ambient">
        <span className="material-symbols-outlined text-5xl text-on-tertiary-fixed">
          eco
        </span>
      </div>
    </div>
  </div>
</section>
    </>
  )
}
