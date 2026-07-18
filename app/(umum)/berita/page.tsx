import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// Sample data
const sampleBerita = [
  {
    id: '1',
    judul: 'Pelatihan Budidaya Bioflok untuk Warga',
    slug: 'pelatihan-budidaya-bioflok',
    konten: 'Inisiatif meningkatkan produktivitas kolam rakyat dengan teknologi ramah lingkungan. Program ini melibatkan 30 warga dari 5 RT yang berbeda untuk mengembangkan metode budidaya ikan yang lebih efisien dan berkelanjutan.',
    author: 'Admin',
    tanggal_publikasi: new Date('2024-01-24'),
    foto_cover: '/images/community.png',
    is_sorotan: false,
  },
  {
    id: '2',
    judul: 'Festival Kuliner Ikan Nusantara 2024',
    slug: 'festival-kuliner-ikan-2024',
    konten: 'Ajang pameran masakan ikan khas Tingkir Tengah yang menarik wisatawan mancanegara. Festival ini menampilkan lebih dari 50 jenis olahan ikan dari berbagai daerah di Indonesia.',
    author: 'Admin',
    tanggal_publikasi: new Date('2024-02-02'),
    foto_cover: '/images/hero-banner.png',
    is_sorotan: false,
  },
  {
    id: '3',
    judul: 'Kunjungan Studi KKN Tematik UNDIP',
    slug: 'kunjungan-studi-kkn-undip',
    konten: 'Kolaborasi mahasiswa dalam pemetaan digital potensi ekonomi kreatif desa. Tim KKN melakukan pendampingan langsung kepada pelaku UMKM untuk meningkatkan pemasaran produk lokal.',
    author: 'Admin',
    tanggal_publikasi: new Date('2024-02-15'),
    foto_cover: '/images/about-hero.png',
    is_sorotan: false,
  },
]

export default async function BeritaPage() {
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
    // Use sample data if Prisma/DB not ready
  }

  return (
    <>
      {/* Hero */}
      <section className="mt-md px-gutter max-w-[1280px] mx-auto">
        <div className="py-xl">
          <span className="inline-block bg-primary-fixed text-on-primary-fixed text-sm font-bold px-md py-1 rounded-full mb-md">
            📰 Kabar Terkini
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
            Berita & Kabar Wisata
          </h1>
          <p className="text-on-surface-variant text-lg mt-md leading-relaxed max-w-[36rem]">
            Ikuti perkembangan terbaru seputar ekowisata, event komunitas, dan
            aktivitas pemberdayaan di Kelurahan Tingkir Tengah.
          </p>
        </div>
      </section>

      {/* Berita Grid */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-gutter">
          {beritaList.length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-6xl text-outline-variant">
                newspaper
              </span>
              <p className="text-on-surface-variant text-lg mt-md">
                Belum ada berita yang dipublikasikan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {beritaList.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-ambient-hover transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-52 overflow-hidden">
                    {item.foto_cover ? (
                      <Image
                        src={item.foto_cover}
                        alt={item.judul}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline-variant">
                          image
                        </span>
                      </div>
                    )}
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
                    <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-on-surface-variant text-sm mt-xs line-clamp-2">
                      {item.konten.substring(0, 120)}...
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm mt-md group-hover:underline">
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
