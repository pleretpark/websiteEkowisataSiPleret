import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { UMKM, Berita } from '@/lib/types'

// Sample data for when Supabase isn't configured yet
const sampleUmkm: UMKM[] = [
  
]

const sampleBerita: Berita[] = [
  
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
  let beritaData: Berita[] = sampleBerita

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
      .order('is_sorotan', { ascending: false })
      .order('tanggal_publikasi', { ascending: false })
      .limit(3)

    if (berita && berita.length > 0) {
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
      <section className="relative">
        <div className="relative w-full h-[500px] md:h-[700px] lg:h-[870px] overflow-hidden">
          <video
            src="/data/video-landing.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Dark and warm overlay */}
          <div className="absolute inset-0 bg-[#3d2314]/30 mix-blend-multiply z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-0" />
          <div className="absolute inset-0 flex flex-col justify-center items-center px-gutter md:px-xl max-w-[1600px] mx-auto text-center pt-20 md:pt-0">
            <div className="flex flex-col items-center max-w-[48rem]">
              <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 italic font-medium mb-2 drop-shadow-md tracking-wide uppercase">
                Selamat Datang di Wisata
              </h2>
              <h1 className="text-4xl md:text-6xl lg:text-[72px] leading-tight md:leading-tight font-bold text-white mb-6 drop-shadow-lg tracking-tight">
                Bendungan Si Pleret
              </h1>
              <div className="mb-6">
                <Image 
                  src="/images/logo-warna.png" 
                  alt="Logo Bendungan Si Pleret" 
                  width={100} 
                  height={100} 
                  className="rounded-full"
                />
              </div>
              <p className="text-base md:text-xl text-white/95 mb-10 leading-relaxed max-w-[40rem] drop-shadow-md">
                Temukan harmoni alam dan kearifan lokal dalam setiap tetes air.
                Ekowisata berkelanjutan yang memberdayakan masyarakat dan
                melestarikan ekosistem perikanan darat.
              </p>
              <a
                href="#jelajahi"
                className="inline-flex items-center justify-center text-white/90 hover:text-white transition-colors animate-bounce mt-4"
                aria-label="Scroll down"
              >
                <span className="material-symbols-outlined text-[48px] drop-shadow-md">
                  expand_more
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================
          TENTANG SINGKAT / ABOUT SECTION
          ============================== */}
      <section id="jelajahi" className="mt-0 md:mt-0 py-xl">
        <div className="max-w-[1500px] mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
            {/* Wrapper kembali mengambil lebar penuh dari kolom grid */}
            <div className="relative rounded-3xl overflow-hidden shadow-ambient-lg w-full aspect-video bg-surface-container-low border border-outline-variant">
              {/* Ganti URL src di bawah dengan link YouTube yang asli jika sudah selesai */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/kaCPjx0F3aw"
                title="Video Profil Ekowisata Tingkir Tengah"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className="space-y-md">
              <h2 className="text-2xl md:text-4xl font-bold text-on-surface leading-tight tracking-tight">
                Ekowisata Tingkir Tengah
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                <strong className="text-on-surface font-semibold block mb-2">Dipersembahkan oleh Tim KKN-T 96 Universitas Diponegoro</strong>
                Terletak di jantung Kota Salatiga, Tingkir Tengah menyajikan harmoni sempurna antara pelestarian alam dan pemberdayaan masyarakat. Saksikan video profil ini untuk mengenal lebih dekat pesona, budaya, dan potensi ekowisata yang kami kembangkan bersama warga setempat.
              </p>
              <Link
                href="/tentang"
                className="inline-flex items-center gap-xs text-primary font-semibold hover:underline decoration-2 underline-offset-4"
              >
                Selengkapnya Tentang Kami
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================
          UMKM SECTION
          ============================== */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-[1500px] mx-auto px-gutter">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-lg">
            {umkmData.map((item, index) => (
              <div
                key={item.id}
                className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-sm shadow-sm hover:shadow-ambient-hover transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl h-64 mb-sm bg-surface-container">
                  <Image
                    src={item.gambar_url && !item.gambar_url.includes('unsplash') ? item.gambar_url : `/images/${item.kategori.toLowerCase()}.jpg`}
                    alt={item.nama_produk}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`${getCategoryStyle(item.kategori)} text-sm px-md py-1 rounded-full font-bold backdrop-blur-md`}
                    >
                      {getCategoryLabel(item.kategori)}
                    </span>
                  </div>
                </div>
                <div className="px-xs flex flex-col flex-grow justify-between mt-sm">
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight">
                      {item.nama_produk}
                    </h3>
                    <p className="text-on-surface-variant text-base mt-xs line-clamp-2">
                      {item.deskripsi}
                    </p>
                  </div>
                  <div className="mt-md flex items-center justify-between">
                    <span className="text-primary font-bold text-xl">
                      {formatPrice(item.harga)}
                    </span>
                    <Link
                      href={`/umkm/detail-produk?id=${item.id}`}
                      className="bg-primary text-on-primary hover:shadow-lg active:scale-95 font-bold px-md py-2 rounded-full transition-all flex items-center gap-xs text-sm"
                    >
                      Detail

                      {/* <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span> */}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================
          KABAR DESA & ACARA SECTION
          ============================== */}
      <section className="py-xl">
        <div className="max-w-[1500px] mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-xs block">
                Kabar Desa & Acara
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
                Informasi Terbaru
              </h2>
            </div>
            <Link
              href="/berita"
              className="text-primary font-semibold flex items-center gap-xs hover:underline decoration-2 underline-offset-4"
            >
              Lihat Semua Berita
              <span className="material-symbols-outlined">trending_flat</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-lg">
            {beritaData.map((item) => (
              <div
                key={item.id}
                className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-ambient-hover transition-all duration-500"
              >
                <div className="relative h-52 overflow-hidden bg-surface-container">
                  <Image
                    src={item.foto_cover && !item.foto_cover.includes('unsplash') ? item.foto_cover : '/images/sosialisasi.jpg'}
                    alt={item.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                    {/* Date Badge */}
                    <div className="absolute bottom-3 left-3 bg-primary text-on-primary text-xs font-bold px-sm py-1 rounded-full">
                      {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    {item.is_sorotan && (
                      <div className="absolute top-3 left-3 bg-tertiary text-on-tertiary text-xs font-bold px-sm py-1 rounded-full flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        Sorotan
                      </div>
                    )}
                  </div>
                <div className="p-md">
                  <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-xs line-clamp-2">
                    {item.konten.substring(0, 120)}...
                  </p>
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-1 text-primary font-semibold text-sm mt-md group-hover:underline"
                  >
                    Baca Selengkapnya
                    {/* <span className="material-symbols-outlined text-[16px]">arrow_forward</span> */}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================
          COMMUNITY / STATISTICS SECTION
          ============================== */}
      <section className="py-xl bg-surface-container-low overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full animate-float blur-2xl" />
            <div
              className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full animate-float blur-3xl"
              style={{ animationDelay: '2s' }}
            />
            <div className="relative z-10 glass p-sm rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 w-4/5 lg:w-3/4 mx-auto">
              <Image
                src="/images/foto-pleret.jpeg"
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
            {/* <div className="grid grid-cols-2 gap-md">
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
            </div> */}
          </div>
        </div>
      </section>
    </>
  )
}
