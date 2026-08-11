import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Berita } from '@/lib/types'

// Aligned high-fidelity fallback sample data matching the main page
const sampleBerita: Berita[] = [
  {
    id: '1',
    judul: 'Transformasi Hijau: Tingkir Tengah Menuju Destinasi Eco-Tourism Kelas Dunia',
    slug: 'transformasi-hijau-tingkir-tengah',
    konten: 'Melalui kolaborasi antara masyarakat lokal dan pakar lingkungan, desa kami memulai inisiatif baru untuk melestarikan sumber daya air sembari meningkatkan ekonomi warga melalui wisata edukasi. Langkah strategis ini diharapkan dapat memosisikan desa Tingkir Tengah sebagai kiblat percontohan bagi pengembangan ekowisata mandiri di kancah nasional.\n\n<h2>Melestarikan Tradisi Lewat Inovasi UMKM</h2>\n\nAcara ini melibatkan lebih dari 50 pelaku UMKM lokal yang menyajikan berbagai olahan ikan nila, lele, hingga gurame dengan sentuhan modern namun tetap menjaga cita rasa autentik rempah nusantara. Pengunjung tidak hanya dimanjakan oleh lidah, tetapi juga mendapatkan edukasi mengenai sistem budidaya ikan ramah lingkungan yang diterapkan oleh komunitas pembudidaya setempat.\n\n<blockquote>"Festival ini bukan sekadar perayaan rasa, melainkan manifesto kemandirian pangan desa kami. Melalui air, kami menghidupi mimpi ribuan warga Tingkir Tengah."<br/>— Ketua Pengelola Ekowisata</blockquote>\n\nSelain bazaar kuliner, agenda festival mencakup workshop pengolahan limbah organik kolam menjadi pupuk cair, lomba memasak antar pemuda desa, dan pertunjukan seni rakyat yang menceritakan hubungan harmonis antara manusia dan ekosistem air. Panitia memprediksi kenaikan kunjungan wisatawan hingga 40% dibandingkan tahun sebelumnya, memberikan dampak langsung pada pendapatan rumah tangga warga.\n\n<h2>Komitmen Keberlanjutan</h2>\n\nSatu hal yang unik dari festival tahun ini adalah penggunaan kemasan ramah lingkungan yang terbuat dari pelepah pisang dan daun jati, mengurangi penggunaan plastik sekali pakai hingga ke titik nol. Inisiatif ini selaras dengan visi Tingkir Tengah sebagai destinasi ekowisata percontohan di tingkat nasional.',
    author: 'Admin',
    tanggal_publikasi: '2024-05-24',
    foto_cover: '/images/about-hero.png',
    is_sorotan: true,
    created_at: '2024-05-24T00:00:00.000Z',
    updated_at: '2024-05-24T00:00:00.000Z',
  },
  {
    id: '2',
    judul: 'Pemberdayaan Wanita Melalui Kerajinan Serat Alam',
    slug: 'pemberdayaan-wanita-kerajinan-serat-alam',
    konten: 'Kelompok UMKM \'Melati Wangi\' berhasil memasarkan produk ramah lingkungan mereka ke pasar internasional, membuktikan kualitas kerajinan tangan lokal. Inovasi produk ini memadukan keindahan seni rajut tradisional dengan bahan baku serat alam organik yang melimpah di lingkungan sekitar.\n\n<h2>Pemberdayaan Gender dan Kelestarian Alam</h2>\n\nPara perajin wanita di desa ini mendapatkan pelatihan intensif mengenai pengolahan serat pelepah pisang, daun pandan, dan eceng gondok menjadi tas premium, hiasan dinding, dan perlengkapan rumah tangga estetis yang memiliki nilai jual tinggi di pasar global.\n\n<blockquote>"Kami tidak hanya merajut serat alam, kami merajut masa depan keluarga kami dengan tetap menjaga kelestarian bumi."<br/>— Ibu Sumarni, Ketua Kelompok UMKM Melati Wangi</blockquote>\n\nProyek ini tidak hanya berkontribusi pada penambahan pendapatan keluarga perajin secara langsung, melainkan juga menumbuhkan rasa kepedulian lingkungan yang lebih tinggi melalui pemanfaatan tanaman liar dan limbah perkebunan lokal secara bijak.',
    author: 'Admin',
    tanggal_publikasi: '2024-05-20',
    foto_cover: '/images/community.png',
    is_sorotan: false,
    created_at: '2024-05-20T00:00:00.000Z',
    updated_at: '2024-05-20T00:00:00.000Z',
  },
  {
    id: '3',
    judul: 'Festival Budaya \'Tingkir Harmoni\' Kembali Digelar',
    slug: 'festival-budaya-tingkir-harmoni-2024',
    konten: 'Rayakan kekayaan budaya desa dengan pertunjukan musik tradisional, workshop kuliner, dan pameran teknologi tepat guna. Kegiatan ini dihadiri ratusan warga dan wisatawan dari luar daerah yang antusias mengapresiasi kearifan lokal.\n\n<h2>Panggung Ekspresi Kreatif Komunitas</h2>\n\nAcara yang berlangsung selama tiga hari berturut-turut ini menampilkan parade kostum karnaval berbahan daur ulang, panggung apresiasi musik lesung, serta demo masak olahan pangan lokal berbasis air tawar yang dipandu oleh chef terkemuka.\n\n<blockquote>"Melalui seni dan budaya, kita merayakan akar identitas kita sembali menatap masa depan yang harmonis."<br/>— Panitia Pelaksana Festival</blockquote>\n\nSelain melestarikan tradisi luhur, festival ini juga menjadi ajang promosi efektif bagi produk-produk UMKM lokal yang terbukti mendongkrak perputaran ekonomi desa secara signifikan selama perhelatan berlangsung.',
    author: 'Admin',
    tanggal_publikasi: '2024-05-18',
    foto_cover: '/images/hero-banner.png',
    is_sorotan: false,
    created_at: '2024-05-18T00:00:00.000Z',
    updated_at: '2024-05-18T00:00:00.000Z',
  },
  {
    id: '4',
    judul: 'Inovasi Sistem Irigasi Pintar untuk Sawah Desa',
    slug: 'inovasi-sistem-irigasi-pintar-sawah-desa',
    konten: 'Mengadopsi teknologi IoT, petani lokal kini dapat memantau kualitas air dan kelembapan tanah langsung dari smartphone mereka. Sistem cerdas ini terbukti meningkatkan efisiensi penggunaan sumber daya air serta meminimalkan risiko gagal panen akibat kekeringan.\n\n<h2>Implementasi Pertanian Cerdas (Smart Farming)</h2>\n\nProyek uji coba irigasi pintar ini merupakan wujud kerja sama antara kelompok tani desa Tingkir Tengah dengan perguruan tinggi setempat dalam rangka implementasi smart farming berbasis komunitas.\n\n<blockquote>"IoT bukan lagi mimpi petani kota, tapi sudah menjadi sahabat sehari-hari kami di sawah Tingkir Tengah."<br/>— Pak Joko, Ketua Kelompok Tani Makmur</blockquote>\n\nDengan data yang terpantau secara real-time, petani dapat mengambil keputusan pemupukan dan pengairan secara presisi, yang pada gilirannya menghemat biaya operasional hingga 30% dan mendongkrak hasil panen padi organik lokal.',
    author: 'Admin',
    tanggal_publikasi: '2024-05-12',
    foto_cover: '/images/about-hero.png',
    is_sorotan: false,
    created_at: '2024-05-12T00:00:00.000Z',
    updated_at: '2024-05-12T00:00:00.000Z',
  },
  {
    id: '5',
    judul: 'Kebun Komunal: Mandiri Pangan di Tengah Pandemi',
    slug: 'kebun-komunal-mandiri-pangan',
    konten: 'Melihat keberhasilan warga dalam mengelola lahan tidur menjadi kebun sayur produktif yang menyuplai kebutuhan harian warga. Kolaborasi gotong royong ini menginspirasi gerakan mandiri pangan skala rukun tetangga di seluruh wilayah.\n\n<h2>Ketahanan Pangan Berbasis Rukun Tetangga</h2>\n\nHasil panen sayuran segar seperti bayam, kangkung, cabai, dan tomat dibagikan secara gratis kepada warga terdampak, sementara sebagian kecil dijual ke pasar tradisional untuk kas pengelolaan bibit kebun periode berikutnya.\n\n<blockquote>"Dari sejengkal tanah tidur, lahir kemandirian yang mengenyangkan perut dan mempererat jalinan kerukunan warga."<br/>— Koordinator Kebun Komunal</blockquote>\n\nKeberhasilan ini membuktikan bahwa inisiatif kecil yang dikelola secara konsisten dan transparan dapat menciptakan ketahanan sosial dan pangan yang tangguh di tingkat akar rumput.',
    author: 'Admin',
    tanggal_publikasi: '2024-05-10',
    foto_cover: '/images/community.png',
    is_sorotan: false,
    created_at: '2024-05-10T00:00:00.000Z',
    updated_at: '2024-05-10T00:00:00.000Z',
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
            <span className="flex items-center gap-1 text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {new Date(berita.tanggal_publikasi).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-primary leading-tight mb-sm">
            {berita.judul}
          </h1>
          <div className="flex items-center text-on-surface-variant text-base">
            <span className="material-symbols-outlined text-[18px] mr-1">person</span>
            <span>Ditulis oleh <span className="font-semibold text-on-surface">{berita.author}</span></span>
          </div>
        </div>

        {/* Cover Image or Document */}
        {berita.foto_cover && (
          <div className="w-full mb-xl flex justify-center">
            {berita.foto_cover.toLowerCase().endsWith('.pdf') ? (
              <iframe 
                src={`${berita.foto_cover}#toolbar=0`} 
                className="w-full aspect-[1/1.4] md:aspect-auto md:h-[800px] rounded-xl" 
              />
            ) : (
              <img
                src={berita.foto_cover}
                alt={berita.judul}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              />
            )}
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none text-justify prose-p:text-justify prose-p:text-on-surface-variant prose-p:leading-relaxed prose-headings:text-primary prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-xl prose-h2:mb-md prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary-container/30 prose-blockquote:p-md prose-blockquote:rounded-r-xl prose-blockquote:text-primary prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:shadow-sm mb-2xl"
          dangerouslySetInnerHTML={{ __html: formatContent(berita.konten) }}
        />


      </div>

      {/* Related News Section */}
      {beritaTerkait.length > 0 && (
        <div className="bg-surface-container-lowest py-2xl border-t border-outline-variant">
          <div className="max-w-[1600px] mx-auto px-gutter">
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
                    <span className="text-on-surface-variant/60 text-xs font-semibold mb-xs">
                      {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <h4 className="text-lg font-bold text-[#003d37] leading-tight mb-xs group-hover:text-primary transition-colors line-clamp-2">
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
