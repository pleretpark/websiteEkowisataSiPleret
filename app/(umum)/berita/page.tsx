import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ScrollReveal from '@/app/_components/ScrollReveal'

// High-fidelity fallback sample data based on the design mockup
const sampleBerita = [
  {
    id: '1',
    judul: 'Transformasi Hijau: Tingkir Tengah Menuju Destinasi Eco-Tourism Kelas Dunia',
    slug: 'transformasi-hijau-tingkir-tengah',
    konten: 'Melalui kolaborasi antara masyarakat lokal dan pakar lingkungan, desa kami memulai inisiatif baru untuk melestarikan sumber daya air sembari meningkatkan ekonomi warga melalui wisata edukasi. Langkah strategis ini diharapkan dapat memosisikan desa Tingkir Tengah sebagai kiblat percontohan bagi pengembangan ekowisata mandiri di kancah nasional.',
    author: 'Admin',
    tanggal_publikasi: new Date('2024-05-24'),
    foto_cover: '/images/about-hero.png',
    is_sorotan: true,
  },
  {
    id: '2',
    judul: 'Pemberdayaan Wanita Melalui Kerajinan Serat Alam',
    slug: 'pemberdayaan-wanita-kerajinan-serat-alam',
    konten: 'Kelompok UMKM \'Melati Wangi\' berhasil memasarkan produk ramah lingkungan mereka ke pasar internasional, membuktikan kualitas kerajinan tangan lokal. Inovasi produk ini memadukan keindahan seni rajut tradisional dengan bahan baku serat alam organik yang melimpah di lingkungan sekitar.',
    author: 'Admin',
    tanggal_publikasi: new Date('2024-05-20'),
    foto_cover: '/images/community.png',
    is_sorotan: false,
  },
  {
    id: '3',
    judul: 'Festival Budaya \'Tingkir Harmoni\' Kembali Digelar',
    slug: 'festival-budaya-tingkir-harmoni-2024',
    konten: 'Rayakan kekayaan budaya desa dengan pertunjukan musik tradisional, workshop kuliner, dan pameran teknologi tepat guna. Kegiatan ini dihadiri ratusan warga dan wisatawan dari luar daerah yang antusias mengapresiasi kearifan lokal.',
    author: 'Admin',
    tanggal_publikasi: new Date('2024-05-18'),
    foto_cover: '/images/hero-banner.png',
    is_sorotan: false,
  },
  {
    id: '4',
    judul: 'Inovasi Sistem Irigasi Pintar untuk Sawah Desa',
    slug: 'inovasi-sistem-irigasi-pintar-sawah-desa',
    konten: 'Mengadopsi teknologi IoT, petani lokal kini dapat memantau kualitas air dan kelembapan tanah langsung dari smartphone mereka. Sistem cerdas ini terbukti meningkatkan efisiensi penggunaan sumber daya air serta meminimalkan risiko gagal panen akibat kekeringan.',
    author: 'Admin',
    tanggal_publikasi: new Date('2024-05-12'),
    foto_cover: '/images/about-hero.png',
    is_sorotan: false,
  },
  {
    id: '5',
    judul: 'Kebun Komunal: Mandiri Pangan di Tengah Pandemi',
    slug: 'kebun-komunal-mandiri-pangan',
    konten: 'Melihat keberhasilan warga dalam mengelola lahan tidur menjadi kebun sayur produktif yang menyuplai kebutuhan harian warga. Kolaborasi gotong royong ini menginspirasi gerakan mandiri pangan skala rukun tetangga di seluruh wilayah.',
    author: 'Admin',
    tanggal_publikasi: new Date('2024-05-10'),
    foto_cover: '/images/community.png',
    is_sorotan: false,
  },
]

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1
  const itemsPerPage = 6

  let beritaList = sampleBerita

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('berita')
      .select('*')
      .order('is_sorotan', { ascending: false })
      .order('tanggal_publikasi', { ascending: false })

    if (data && data.length > 0) {
      beritaList = data
    }
  } catch {
    // Use fallback sample data
  }

  // Spotlight logic: only show on first page
  const isFirstPage = currentPage === 1
  const spotlightNews = isFirstPage ? beritaList[0] : null
  const listToRender = spotlightNews ? beritaList.slice(1) : beritaList

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedNews = listToRender.slice(startIndex, endIndex)
  const totalPages = Math.ceil(listToRender.length / itemsPerPage)

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Title Header Section */}
      <header className="px-gutter max-w-[1000px] mx-auto pt-lg pb-xl mt-12 text-center">
        <ScrollReveal variant="fade-down" duration={700}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight tracking-tight mt-xs mb-sm">
            Berita <span className="text-[#003d37] italic font-medium">& Acara</span>
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
            Pusat informasi resmi mengenai kegiatan, pembangunan, dan pengumuman terkini di lingkungan Ekowisata Tingkir Tengah.
          </p>
        </ScrollReveal>
      </header>

      {/* Spotlight Card */}
      {spotlightNews && (
        <section className="mb-lg px-gutter max-w-[1600px] mx-auto">
          <Link
            href={`/berita/${spotlightNews.slug}`}
            className="group flex flex-col md:flex-row bg-white border border-outline-variant/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-ambient transition-all duration-500"
          >
            {/* Image (left) */}
            <div className="w-full md:w-3/5 relative h-[250px] md:h-[400px] overflow-hidden">
              <Image
                src={spotlightNews.foto_cover && !spotlightNews.foto_cover.includes('unsplash') ? spotlightNews.foto_cover : '/images/sosialisasi.jpg'}
                alt={spotlightNews.judul}
                fill
                priority
                className="object-cover group-hover:scale-102 transition-transform duration-700"
              />
            </div>
            {/* Content (right) */}
            <div className="w-full md:w-2/5 p-lg md:p-xl flex flex-col justify-center bg-white">
              <div className="flex items-center mb-sm">
                <span className="text-on-surface-variant/70 text-xs font-semibold">
                  {new Date(spotlightNews.tanggal_publikasi).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#003d37] group-hover:text-primary transition-colors leading-tight mb-sm">
                {spotlightNews.judul}
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-md line-clamp-3">
                {spotlightNews.konten}
              </p>
              <span className="inline-flex items-center gap-xs text-primary font-bold text-sm group-hover:underline">
                Baca Selengkapnya
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Main Grid Content */}
      <section className="pb-xl">
        <div className="max-w-[1600px] mx-auto px-gutter">
          {paginatedNews.length === 0 ? (
            <div className="text-center py-xl bg-white border border-outline-variant/60 rounded-3xl">
              <span className="material-symbols-outlined text-6xl text-outline-variant">
                newspaper
              </span>
              <p className="text-on-surface-variant text-lg mt-md">
                Belum ada berita yang tersedia.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-md">
                {paginatedNews.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-ambient-hover transition-all duration-500 flex flex-col h-full"
                    >
                      <div className="relative h-52 overflow-hidden bg-surface-container flex-shrink-0">
                        <Image
                          src={item.foto_cover && !item.foto_cover.includes('unsplash') ? item.foto_cover : '/images/sosialisasi.jpg'}
                          alt={item.judul}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Date Badge */}
                        <div className="absolute bottom-3 left-3 bg-primary text-on-primary text-xs font-bold px-sm py-1 rounded-full shadow-sm">
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
                      <div className="p-md flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                            {item.judul}
                          </h3>
                          <p className="text-on-surface-variant text-sm mt-xs line-clamp-2">
                            {item.konten ? item.konten.substring(0, 120) + (item.konten.length > 120 ? '...' : '') : ''}
                          </p>
                        </div>
                        <Link
                          href={`/berita/${item.slug}`}
                          className="inline-flex items-center gap-1 text-primary font-semibold text-sm mt-md hover:underline"
                        >
                          Baca Selengkapnya
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-lg flex justify-center items-center gap-xs">
                  {/* Previous Page */}
                  <Link
                    href={`/berita?page=${currentPage - 1}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-surface-container ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </Link>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <Link
                        key={pageNum}
                        href={`/berita?page=${pageNum}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-full border font-bold text-sm transition-colors ${currentPage === pageNum
                            ? 'bg-primary border-primary text-on-primary shadow-sm'
                            : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                          }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  })}
                  {/* Next Page */}
                  <Link
                    href={`/berita?page=${currentPage + 1}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-surface-container ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
