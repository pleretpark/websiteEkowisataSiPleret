import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function DashboardPage() {
  let stats = { totalProduk: 0, totalSpotWisata: 0, totalBerita: 0, totalIkan: 0 }
  let topUmkm: any[] = []
  let latestBerita: any = null
  let visitorStats = { hariIni: 0, mingguIni: 0, bulanIni: 0, total: 0 }

  try {
    const supabase = await createClient()

    const [umkmRes, spotRes, beritaRes, ikanRes, topUmkmRes, latestBeritaRes, visitorRes] = await Promise.all([
      supabase.from('umkm').select('*', { count: 'exact', head: true }),
      supabase.from('spot_wisata').select('*', { count: 'exact', head: true }),
      supabase.from('berita').select('*', { count: 'exact', head: true }),
      supabase.from('ikan').select('*', { count: 'exact', head: true }),
      supabase.from('umkm').select('id, nama_produk, kategori, harga, gambar_url').order('created_at', { ascending: false }).limit(5),
      supabase.from('berita').select('id, judul, konten, foto_cover, author, tanggal_publikasi').order('tanggal_publikasi', { ascending: false }).limit(1),
      supabase.from('Visitor').select('*'),
    ])

    if (visitorRes.data) {
      const today = new Date()
      const localTime = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}))
      const currentYear = localTime.getFullYear()
      const currentMonth = localTime.getMonth()
      const todayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(localTime.getDate()).padStart(2, '0')}`

      visitorRes.data.forEach((v: any) => {
        if (!v.date) return
        const count = v.count || 0
        visitorStats.total += count
        
        if (v.date === todayStr) {
          visitorStats.hariIni += count
        }
        
        const [vYear, vMonth, vDay] = v.date.split('-').map(Number)
        
        if (vYear === currentYear && vMonth === currentMonth + 1) {
          visitorStats.bulanIni += count
        }
        
        const vDateObj = new Date(vYear, vMonth - 1, vDay)
        const todayDateObj = new Date(currentYear, currentMonth, localTime.getDate())
        const diffDays = Math.floor((todayDateObj.getTime() - vDateObj.getTime()) / (1000 * 3600 * 24))
        
        if (diffDays >= 0 && diffDays <= 6) {
          visitorStats.mingguIni += count
        }
      })
    }

    stats = {
      totalProduk: umkmRes.count || 0,
      totalSpotWisata: spotRes.count || 0,
      totalBerita: beritaRes.count || 0,
      totalIkan: ikanRes.count || 0,
    }
    
    topUmkm = topUmkmRes.data || []
    latestBerita = latestBeritaRes.data?.[0] || null
  } catch {
    // Supabase not configured or failed
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const statCards = [
    {
      label: 'JUMLAH PRODUK',
      value: stats.totalProduk,
      href: '/admin/umkm',
    },
    {
      label: 'JUMLAH LOKASI',
      value: stats.totalSpotWisata,
      href: '/admin/spot-wisata',
    },
    {
      label: 'JUMLAH DATA IKAN',
      value: stats.totalIkan,
      href: '/admin/ikan',
    },
    {
      label: 'JUMLAH KABAR DESA',
      value: stats.totalBerita,
      href: '/admin/berita',
    },
  ]

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Section 1: 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="relative bg-[#f6f7f2] rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-center min-h-[100px]">
            <Link href={card.href} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#064e3b] text-white flex items-center justify-center hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[16px]">add</span>
            </Link>
            <p className="text-xs md:text-sm font-bold text-on-surface-variant tracking-wider uppercase mb-1 md:mb-2 max-w-[80%]">{card.label}</p>
            <p className="text-3xl md:text-5xl font-black text-[#1c1c1c]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Section 2: 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Produk Terbaru */}
        <div className="bg-[#f6f7f2] rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1c1c1c]">Produk Terbaru</h2>
            <Link href="/admin/umkm" className="text-[#067160] text-sm font-bold hover:underline">Lihat Semua</Link>
          </div>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {topUmkm.length === 0 ? (
               <p className="text-on-surface-variant text-sm text-center">Belum ada produk terdaftar.</p>
            ) : (
              topUmkm.map((produk) => (
                <div key={produk.id} className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0">
                    <Image 
                      src={produk.gambar_url || `/images/${produk.kategori?.toLowerCase() || 'makanan'}.jpg`} 
                      alt={produk.nama_produk}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1c1c1c] text-sm truncate">{produk.nama_produk}</h3>
                    <p className="text-on-surface-variant text-xs truncate">UMKM {produk.kategori}</p>
                  </div>
                  <div className="font-bold text-[#067160] text-sm shrink-0">
                    Rp {produk.harga ? (produk.harga / 1000) + 'k' : '0k'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Col 2: Berita Sorotan */}
        <div className="bg-[#f6f7f2] rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1c1c1c]">Kabar Terbaru</h2>
            <Link href="/admin/berita" className="text-[#067160] text-sm font-bold hover:underline">Lihat Semua</Link>
          </div>
          {latestBerita ? (
            <div className="flex flex-col flex-1">
              <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4 bg-surface-container">
                <Image 
                  src={latestBerita.foto_cover || '/images/hero-banner.png'} 
                  alt={latestBerita.judul}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs font-bold text-[#067160] mb-2">
                {formatDate(latestBerita.tanggal_publikasi)} &bull; {latestBerita.author || 'Komunitas'}
              </p>
              <h3 className="text-lg font-black text-[#1c1c1c] leading-tight mb-2 line-clamp-2">
                {latestBerita.judul}
              </h3>
              <div className="text-sm text-on-surface-variant line-clamp-3 mb-2" dangerouslySetInnerHTML={{ __html: latestBerita.konten || 'Baca berita selengkapnya mengenai perkembangan ekowisata Tingkir Tengah...' }} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
               <p className="text-on-surface-variant text-sm">Belum ada berita dipublikasikan.</p>
            </div>
          )}
        </div>

        {/* Col 3: Statistika Pengunjung */}
        <div className="bg-[#f6f7f2] rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1c1c1c]">Statistika Pengunjung</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex justify-between items-center">
               <span className="text-sm font-medium text-on-surface-variant">Hari Ini</span>
               <span className="text-xl font-bold text-[#067160]">{visitorStats.hariIni}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex justify-between items-center">
               <span className="text-sm font-medium text-on-surface-variant">Minggu Ini (7 Hari)</span>
               <span className="text-xl font-bold text-[#067160]">{visitorStats.mingguIni}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex justify-between items-center">
               <span className="text-sm font-medium text-on-surface-variant">Bulan Ini</span>
               <span className="text-xl font-bold text-[#067160]">{visitorStats.bulanIni}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex justify-between items-center">
               <span className="text-sm font-medium text-on-surface-variant">Total Keseluruhan</span>
               <span className="text-xl font-bold text-[#067160]">{visitorStats.total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
