'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UMKM } from '@/lib/types'

const sampleUmkm: UMKM[] = [
  {
    id: '1', nama_produk: 'Ikan Asap Premium Arwana', kategori: 'Makanan', harga: 45000,
    deskripsi: 'Olahan ikan asap tradisional dengan bumbu rempah rahasia Tingkir Tengah.',
    gambar_url: '/images/umkm-ikan-asap.png', nomor_wa: '6281234567890', nama_toko: 'Toko Ikan Pak Budi',
    created_at: '', updated_at: '',
  },
  {
    id: '2', nama_produk: 'Keripik Kulit Ikan Nila', kategori: 'Makanan', harga: 25000,
    deskripsi: 'Camilan renyah kaya protein, diproses secara higienis dari kolam budidaya mandiri.',
    gambar_url: '/images/umkm-keripik.png', nomor_wa: '6281234567891', nama_toko: 'Keripik Bu Siti',
    created_at: '', updated_at: '',
  },
  {
    id: '3', nama_produk: 'Kerajinan Anyaman Bambu', kategori: 'Kerajinan', harga: 85000,
    deskripsi: 'Wadah multifungsi estetik buatan pengrajin lokal untuk gaya hidup berkelanjutan.',
    gambar_url: '/images/umkm-anyaman.png', nomor_wa: '6281234567892', nama_toko: 'Anyaman Ibu Karjo',
    created_at: '', updated_at: '',
  },
  {
    id: '4', nama_produk: 'Madu Hutan Organik', kategori: 'Makanan', harga: 95000,
    deskripsi: 'Madu hutan murni tanpa pengolahan, dipanen dari lebah lokal yang berkelanjutan.',
    gambar_url: '/images/umkm-ikan-asap.png', nomor_wa: '6281234567893', nama_toko: 'Madu Pak Joko',
    created_at: '', updated_at: '',
  },
  {
    id: '5', nama_produk: 'Sabun Herbal Alami', kategori: 'Lainnya', harga: 35000,
    deskripsi: 'Sabun batangan yang dibuat dengan tumbuhan herbal dan minyak esensial alami.',
    gambar_url: '/images/umkm-anyaman.png', nomor_wa: '6281234567894', nama_toko: 'Herbal Bu Ani',
    created_at: '', updated_at: '',
  },
  {
    id: '6', nama_produk: 'Batik Cap Tingkir', kategori: 'Kerajinan', harga: 175000,
    deskripsi: 'Desain batik kontemporer menggunakan pewarna alami dari tumbuhan lokal.',
    gambar_url: '/images/umkm-keripik.png', nomor_wa: '6281234567895', nama_toko: 'Batik Mas Eko',
    created_at: '', updated_at: '',
  },
]

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
  const [products, setProducts] = useState<UMKM[]>(sampleUmkm)
  const [filteredProducts, setFilteredProducts] = useState<UMKM[]>(sampleUmkm)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('umkm')
          .select('*')
          .order('created_at', { ascending: false })

        if (data && data.length > 0) {
          setProducts(data)
          setFilteredProducts(data)
        }
      } catch {
        // Supabase not configured, use sample data
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
      <section className="mt-md px-gutter max-w-container-max mx-auto">
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
        <div className="max-w-container-max mx-auto px-gutter">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
              {filteredProducts.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-sm shadow-sm hover:shadow-ambient-hover transition-all duration-500 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-xl h-48 mb-sm">
                    {item.gambar_url && (
                      <Image
                        src={item.gambar_url}
                        alt={item.nama_produk}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`${getCategoryStyle(item.kategori)} text-xs px-sm py-1 rounded-full font-bold backdrop-blur-md`}
                      >
                        {item.kategori}
                      </span>
                    </div>
                  </div>
                  <div className="px-xs">
                    <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight">
                      {item.nama_produk}
                    </h3>
                    <p className="text-on-surface-variant text-sm mt-xs line-clamp-2">
                      {item.deskripsi}
                    </p>
                    <div className="mt-md flex items-center justify-between gap-xs">
                      <span className="text-primary font-bold text-lg">
                        {formatPrice(item.harga)}
                      </span>
                      <a
                        href={`https://wa.me/${item.nomor_wa}?text=Halo, saya tertarik dengan produk ${item.nama_produk}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-on-primary font-bold px-sm py-2 rounded-full transition-all flex items-center gap-1 text-xs hover:shadow-lg active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          shopping_cart
                        </span>
                        Beli via WA
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xl">
        <div className="max-w-container-max mx-auto px-gutter">
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
              <div className="flex flex-wrap gap-sm mt-lg">
                <a
                  href="#"
                  className="bg-primary text-on-primary font-bold px-xl py-sm rounded-full hover:shadow-xl transition-all"
                >
                  Jadi Mitra
                </a>
                <a
                  href="/tentang"
                  className="border-2 border-primary text-primary font-bold px-xl py-sm rounded-full hover:bg-primary hover:text-on-primary transition-all"
                >
                  Pelajari Dampak Kami
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
