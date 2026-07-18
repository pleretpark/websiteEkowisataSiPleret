import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Berita } from '@/lib/types'

// Sample data as fallback
const sampleBerita: Berita[] = [
  {
    id: '1',
    judul: 'Pelatihan Budidaya Bioflok untuk Warga',
    slug: 'pelatihan-budidaya-bioflok',
    konten: 'Inisiatif meningkatkan produktivitas kolam rakyat dengan teknologi ramah lingkungan. Program ini melibatkan 30 warga dari 5 RT yang berbeda untuk mengembangkan metode budidaya ikan yang lebih efisien dan berkelanjutan. Pelatihan ini merupakan langkah awal dari program jangka panjang untuk menjadikan desa Tingkir Tengah sebagai percontohan budidaya ikan air tawar modern di wilayah Salatiga.\n\nDalam pelatihan ini, warga diajarkan mulai dari penyiapan kolam, pembuatan probiotik, hingga manajemen pakan. Antusiasme warga sangat tinggi, terlihat dari banyaknya pertanyaan dan diskusi interaktif selama sesi berlangsung.',
    author: 'Admin',
    tanggal_publikasi: '2024-01-24',
    foto_cover: '/images/community.png',
    is_sorotan: false,
  },
  {
    id: '2',
    judul: 'Festival Kuliner Ikan Nusantara 2024',
    slug: 'festival-kuliner-ikan-2024',
    konten: 'Ekowisata Tingkir Tengah kembali menggelar perhelatan tahunan yang dinanti-nantikan oleh para pecinta kuliner dan pegiat keberlanjutan. Festival Kuliner Ikan Nusantara 2024 resmi dibuka dengan semangat pemberdayaan ekonomi lokal berbasis potensi air tawar yang melimpah di kawasan ini.\n\n<h2>Melestarikan Tradisi Lewat Inovasi UMKM</h2>\n\nAcara ini melibatkan lebih dari 50 pelaku UMKM lokal yang menyajikan berbagai olahan ikan nila, lele, hingga gurame dengan sentuhan modern namun tetap menjaga cita rasa autentik rempah nusantara. Pengunjung tidak hanya dimanjakan oleh lidah, tetapi juga mendapatkan edukasi mengenai sistem budidaya ikan ramah lingkungan yang diterapkan oleh komunitas pembudidaya setempat.\n\n<blockquote>"Festival ini bukan sekadar perayaan rasa, melainkan manifesto kemandirian pangan desa kami. Melalui air, kami menghidupi mimpi ribuan warga Tingkir Tengah."<br/>— Ketua Pengelola Ekowisata</blockquote>\n\nSelain bazaar kuliner, agenda festival mencakup workshop pengolahan limbah organik kolam menjadi pupuk cair, lomba memasak antar pemuda desa, dan pertunjukan seni rakyat yang menceritakan hubungan harmonis antara manusia dan ekosistem air. Panitia memprediksi kenaikan kunjungan wisatawan hingga 40% dibandingkan tahun sebelumnya, memberikan dampak langsung pada pendapatan rumah tangga warga.\n\n<h2>Komitmen Keberlanjutan</h2>\n\nSatu hal yang unik dari festival tahun ini adalah penggunaan kemasan ramah lingkungan yang terbuat dari pelepah pisang dan daun jati, mengurangi penggunaan plastik sekali pakai hingga ke titik nol. Inisiatif ini selaras dengan visi Tingkir Tengah sebagai destinasi ekowisata percontohan di tingkat nasional.',
    author: 'Admin',
    tanggal_publikasi: '2024-02-02',
    foto_cover: '/images/hero-banner.png',
    is_sorotan: true,
  },
  {
    id: '3',
    judul: 'Kunjungan Studi KKN Tematik UNDIP',
    slug: 'kunjungan-studi-kkn-undip',
    konten: 'Kolaborasi mahasiswa dalam pemetaan digital potensi ekonomi kreatif desa. Tim KKN melakukan pendampingan langsung kepada pelaku UMKM untuk meningkatkan pemasaran produk lokal melalui platform digital dan e-commerce.\n\nSelain itu, para mahasiswa juga membantu menyusun modul tata kelola organisasi pemuda desa agar lebih aktif dalam menggerakkan roda ekonomi kerakyatan. Kepala Desa menyambut baik inisiatif ini dan berharap kerjasama dengan perguruan tinggi dapat terus berlanjut di tahun-tahun mendatang.',
    author: 'Admin',
    tanggal_publikasi: '2024-02-15',
    foto_cover: '/images/about-hero.png',
    is_sorotan: false,
  },
]

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  let berita: Berita | undefined = sampleBerita.find((b) => b.slug === slug)
  let beritaTerkait: Berita[] = sampleBerita.filter((b) => b.slug !== slug).slice(0, 3)
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .eq('slug', slug)
      .single()
      
    if (error) {
      console.log('Supabase query error or not found:', error.message)
    } else if (data) {
      berita = data as Berita
      
      // Fetch related
      const { data: relatedData } = await supabase
        .from('berita')
        .select('*')
        .neq('id', berita.id)
        .order('tanggal_publikasi', { ascending: false })
        .limit(3)
        
      if (relatedData && relatedData.length > 0) {
        beritaTerkait = relatedData
      } else {
        beritaTerkait = []
      }
    }
  } catch (err) {
    console.log('Supabase client error:', err)
  }

  if (!berita) {
    notFound()
  }

  // Fungsi untuk memformat konten HTML (menangani h2, blockquote, dll jika ada tag html dasar)
  const formatContent = (content: string) => {
    // Jika konten sudah mengandung tag HTML (seperti sampel kita), kita biarkan
    // Jika tidak, kita wrap tiap baris dengan <p>
    if (content.includes('<h2>') || content.includes('<p>')) {
      return content
    }
    return content.split('\n').filter(p => p.trim() !== '').map(p => `<p class="mb-md leading-relaxed text-on-surface-variant">${p}</p>`).join('')
  }

  return (
    <article className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[800px] mx-auto px-gutter py-xl">
        
        {/* Header Section */}
        <div className="mb-lg">
          <div className="flex items-center gap-sm mb-md text-sm">
            <span className="bg-[#38bdf8] text-white px-md py-1 rounded-full font-semibold shadow-sm">
              Berita Desa
            </span>
            <span className="flex items-center gap-1 text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {new Date(berita.tanggal_publikasi).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-primary leading-tight mb-xl">
            {berita.judul}
          </h1>
        </div>

        {/* Cover Image */}
        {berita.foto_cover && (
          <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl mb-xl">
            <Image
              src={berita.foto_cover}
              alt={berita.judul}
              fill
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none prose-p:text-on-surface-variant prose-p:leading-relaxed prose-headings:text-primary prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-xl prose-h2:mb-md prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary-container/30 prose-blockquote:p-md prose-blockquote:rounded-r-xl prose-blockquote:text-primary prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:shadow-sm mb-2xl"
          dangerouslySetInnerHTML={{ __html: formatContent(berita.konten) }}
        />

        {/* Tags & Share */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md py-lg border-b border-outline-variant mb-2xl">
          <div className="flex flex-wrap items-center gap-sm text-xs font-semibold">
            <span className="bg-surface-variant text-on-surface-variant px-sm py-1 rounded-full">#KulinerDesa</span>
            <span className="bg-surface-variant text-on-surface-variant px-sm py-1 rounded-full">#Sustainability</span>
            <span className="bg-surface-variant text-on-surface-variant px-sm py-1 rounded-full">#TingkirTengah</span>
          </div>
          <div className="flex items-center gap-md text-sm font-medium text-on-surface-variant">
            <span>Bagikan:</span>
            <button className="hover:text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button className="hover:text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related News Section */}
      {beritaTerkait.length > 0 && (
        <div className="bg-surface-container-lowest py-2xl border-t border-outline-variant">
          <div className="max-w-[1280px] mx-auto px-gutter">
            <h3 className="text-2xl font-bold text-on-surface mb-xl">
              Berita Terkait
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {beritaTerkait.map((item) => (
                <div key={item.id} className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                  {item.foto_cover ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={item.foto_cover}
                        alt={item.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-outline-variant">image</span>
                    </div>
                  )}
                  <div className="p-md flex flex-col flex-grow">
                    <span className="text-primary text-xs font-bold mb-xs">
                      {item.is_sorotan ? 'Sorotan Utama' : 'Kabar Desa'}
                    </span>
                    <h4 className="text-lg font-bold text-on-surface leading-tight mb-xs group-hover:text-primary transition-colors line-clamp-2">
                      {item.judul}
                    </h4>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-md flex-grow">
                      {item.konten.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                    </p>
                    <Link
                      href={`/berita/${item.slug}`}
                      className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline"
                    >
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
