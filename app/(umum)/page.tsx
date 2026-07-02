import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { UMKM, Berita } from '@/lib/types'

// Sample data for when Supabase isn't configured yet
const sampleUmkm: UMKM[] = [
  {
    id: '1',
    nama_produk: 'Ikan Asap Premium Arwana',
    kategori: 'Makanan',
    harga: 45000,
    deskripsi: 'Olahan ikan asap tradisional dengan bumbu rempah rahasia Tingkir Tengah.',
    gambar_url: '/images/umkm-ikan-asap.png',
    nomor_wa: '6281234567890',
    nama_toko: 'Toko Ikan Pak Budi',
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    nama_produk: 'Keripik Kulit Ikan Nila',
    kategori: 'Makanan',
    harga: 25000,
    deskripsi: 'Camilan renyah kaya protein, diproses secara higienis dari kolam budidaya mandiri.',
    gambar_url: '/images/umkm-keripik.png',
    nomor_wa: '6281234567891',
    nama_toko: 'Keripik Bu Siti',
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    nama_produk: 'Kerajinan Anyaman Bambu',
    kategori: 'Kerajinan',
    harga: 85000,
    deskripsi: 'Wadah multifungsi estetik buatan pengrajin lokal untuk gaya hidup berkelanjutan.',
    gambar_url: '/images/umkm-anyaman.png',
    nomor_wa: '6281234567892',
    nama_toko: 'Anyaman Ibu Karjo',
    created_at: '',
    updated_at: '',
  },
]

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

function getCategoryLabel(kategori: string) {
  switch (kategori) {
    case 'Makanan':
      return 'Kuliner'
    case 'Kerajinan':
      return 'Kerajinan'
    case 'Minuman':
      return 'Minuman'
    default:
      return 'Lainnya'
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function HomePage() {
  let umkmData: UMKM[] = sampleUmkm
  let beritaData: Berita[] = []

  try {
    const supabase = await createClient()
    const { data: umkm } = await supabase
      .from('umkm')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    if (umkm && umkm.length > 0) {
      umkmData = umkm
    }

    const { data: berita } = await supabase
      .from('berita')
      .select('*')
      .eq('status', 'published')
      .order('tanggal_publikasi', { ascending: false })
      .limit(3)

    if (berita) {
      beritaData = berita
    }
  } catch {
    // Supabase not configured yet, use sample data
  }

  return (
    <>
      {/* ==============================
          HERO SECTION
          ============================== */}
      <section className="relative px-sm md:px-lg mt-md">
        <div className="relative w-full h-[500px] md:h-[700px] lg:h-[870px] overflow-hidden hero-clip shadow-2xl">
          <Image
            src="/images/hero-banner.png"
            alt="Pesona Air Tawar Tingkir Tengah - kolam ikan dan vegetasi tropis"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-1000 hover:scale-105"
            priority
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center items-start px-gutter md:px-xl max-w-container-max mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl lg:text-[48px] leading-tight md:leading-[56px] font-bold text-white mb-sm drop-shadow-lg tracking-tight">
                Pesona Air Tawar Tingkir
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-lg leading-relaxed max-w-lg drop-shadow-md">
                Temukan harmoni alam dan kearifan lokal dalam setiap tetes air.
                Ekowisata berkelanjutan yang memberdayakan masyarakat dan
                melestarikan ekosistem perikanan darat.
              </p>
              <Link
                href="/peta-wisata"
                className="inline-flex items-center gap-xs bg-primary-fixed text-on-primary-fixed text-lg md:text-2xl font-semibold px-xl py-sm rounded-full shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-all transform active:scale-95"
              >
                Mulai Penjelajahan
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-gutter z-20">
          <div className="glass rounded-xl p-md shadow-2xl flex flex-col md:flex-row items-center gap-md">
            <div className="flex-1 w-full relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                search
              </span>
              <input
                className="w-full bg-white/50 border-none rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-outline"
                placeholder="Cari kolam pancing atau UMKM..."
                type="text"
                id="hero-search-input"
              />
            </div>
            <div className="flex-1 w-full relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                category
              </span>
              <select
                className="w-full bg-white/50 border-none rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary text-on-surface appearance-none"
                id="hero-category-select"
              >
                <option>Semua Kategori</option>
                <option>Olahan Ikan</option>
                <option>Kerajinan Tangan</option>
                <option>Wisata Edukasi</option>
              </select>
            </div>
            <Link
              href="/umkm"
              className="w-full md:w-auto bg-secondary-container text-on-secondary-container px-xl py-3 rounded-full font-bold flex items-center justify-center gap-xs hover:shadow-lg transition-all active:scale-95"
              id="hero-search-btn"
            >
              <span className="material-symbols-outlined">search</span>
              Cari
            </Link>
          </div>
        </div>
      </section>

      {/* ==============================
          UMKM SECTION
          ============================== */}
      <section className="mt-32 md:mt-40 py-xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-xs block">
                Produk Lokal
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
                Geliat Ekonomi UMKM
              </h2>
            </div>
            <Link
              href="/umkm"
              className="text-primary font-semibold flex items-center gap-xs hover:underline decoration-2 underline-offset-4"
            >
              Lihat Semua Produk
              <span className="material-symbols-outlined">trending_flat</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {umkmData.map((item, index) => (
              <div
                key={item.id}
                className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-sm shadow-sm hover:shadow-ambient-hover transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl h-64 mb-sm">
                  {item.gambar_url && (
                    <Image
                      src={item.gambar_url}
                      alt={item.nama_produk}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`${getCategoryStyle(item.kategori)} text-sm px-md py-1 rounded-full font-bold backdrop-blur-md`}
                    >
                      {getCategoryLabel(item.kategori)}
                    </span>
                  </div>
                </div>
                <div className="px-xs">
                  <h3 className="text-xl font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight">
                    {item.nama_produk}
                  </h3>
                  <p className="text-on-surface-variant text-base mt-xs line-clamp-2">
                    {item.deskripsi}
                  </p>
                  <div className="mt-md flex items-center justify-between">
                    <span className="text-primary font-bold text-xl">
                      {formatPrice(item.harga)}
                    </span>
                    <a
                      href={`https://wa.me/${item.nomor_wa}?text=Halo, saya tertarik dengan produk ${item.nama_produk}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-on-primary font-bold px-md py-2 rounded-full transition-all flex items-center gap-xs text-sm"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        shopping_cart
                      </span>
                      Beli via WA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================
          COMMUNITY / STATISTICS SECTION
          ============================== */}
      <section className="py-xl overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full animate-float blur-2xl" />
            <div
              className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full animate-float blur-3xl"
              style={{ animationDelay: '2s' }}
            />
            <div className="relative z-10 glass p-sm rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/community.png"
                alt="Komunitas UMKM Tingkir Tengah bekerja bersama"
                width={600}
                height={400}
                className="rounded-xl shadow-inner w-full"
              />
            </div>
          </div>
          <div className="space-y-md">
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight tracking-tight">
              Bersama Membangun Negeri dari Desa
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Tingkir Tengah bukan sekadar destinasi, tapi sebuah gerakan. Kami
              menggabungkan pariwisata berbasis alam dengan pemberdayaan ekonomi
              mikro untuk menciptakan masa depan yang lebih hijau.
            </p>
            <div className="grid grid-cols-2 gap-md">
              <div className="p-md bg-white rounded-2xl shadow-ambient">
                <span className="text-secondary font-bold text-4xl block">25+</span>
                <span className="text-on-surface-variant text-sm font-medium">
                  UMKM Aktif
                </span>
              </div>
              <div className="p-md bg-white rounded-2xl shadow-ambient">
                <span className="text-tertiary font-bold text-4xl block">150k</span>
                <span className="text-on-surface-variant text-sm font-medium">
                  Pengunjung/Thn
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================
          NEWS/ARTICLES SECTION
          ============================== */}
      {beritaData.length > 0 && (
        <section className="py-xl bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-xl">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-xs block">
                Informasi Terkini
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
                Berita & Artikel
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {beritaData.map((item) => (
                <div
                  key={item.id}
                  className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-ambient-hover transition-all duration-500"
                >
                  {item.gambar_sampul_url && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.gambar_sampul_url}
                        alt={item.judul}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-md">
                    <p className="text-sm text-outline mb-xs">
                      {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-on-surface-variant text-sm mt-xs line-clamp-3">
                      {item.konten.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
