import { createClient } from '@/lib/supabase/server'

export default async function  DashboardPage() {
  let stats = { totalUmkm: 0, totalSpotWisata: 0, totalBerita: 0, totalIkan: 0 }

  try {
    const supabase = await createClient()

    const [umkmRes, spotRes, beritaRes, ikanRes] = await Promise.all([
      supabase.from('umkm').select('*', { count: 'exact', head: true }),
      supabase.from('spot_wisata').select('*', { count: 'exact', head: true }),
      supabase.from('berita').select('*', { count: 'exact', head: true }),
      supabase.from('ikan').select('*', { count: 'exact', head: true }),
    ])

    stats = {
      totalUmkm: umkmRes.count || 0,
      totalSpotWisata: spotRes.count || 0,
      totalBerita: beritaRes.count || 0,
      totalIkan: ikanRes.count || 0,
    }
  } catch {
    // Supabase not configured
  }

  const statCards = [
    {
      label: 'Total UMKM',
      value: stats.totalUmkm,
      icon: 'storefront',
      color: 'text-primary',
      bg: 'bg-primary-fixed/20',
      href: '/admin/umkm',
    },
    {
      label: 'Spot Wisata',
      value: stats.totalSpotWisata,
      icon: 'eco',
      color: 'text-tertiary',
      bg: 'bg-tertiary-fixed/20',
      href: '/admin/spot-wisata',
    },
    {
      label: 'Berita & Artikel',
      value: stats.totalBerita,
      icon: 'newspaper',
      color: 'text-secondary',
      bg: 'bg-secondary-fixed/20',
      href: '/admin/berita',
    },
    {
      label: 'Data Ikan',
      value: stats.totalIkan,
      icon: 'phishing',
      color: 'text-tertiary',
      bg: 'bg-tertiary-fixed/20',
      href: '/admin/ikan',
    },
  ]

  return (
    <div>
      <div className="mb-lg">
        <h1 className="text-5xl font-bold text-on-surface">Dashboard</h1>
        <p className="text-on-surface-variant text-xl mt-xs">
          Ringkasan data dan kelola konten Ekowisata Tingkir Tengah.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {statCards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-surface-container-lowest rounded-3xl p-xl border border-outline-variant shadow-sm hover:shadow-ambient-hover transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-md">
              <span
                className={`material-symbols-outlined text-5xl ${card.color} ${card.bg} p-sm rounded-2xl`}
              >
                {card.icon}
              </span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </div>
            <p className="text-6xl font-bold text-on-surface">{card.value}</p>
            <p className="text-on-surface-variant text-lg font-medium mt-xs">
              {card.label}
            </p>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-container-lowest rounded-3xl p-xl border border-outline-variant shadow-sm">
        <h2 className="text-3xl font-bold text-on-surface mb-md">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
          <a
            href="/admin/umkm"
            className="flex items-center gap-sm p-md rounded-2xl border border-outline-variant hover:bg-primary-fixed/10 hover:border-primary transition-all"
          >
            <span className="material-symbols-outlined text-primary">add_circle</span>
            <span className="text-lg font-medium text-on-surface">Tambah UMKM Baru</span>
          </a>
          <a
            href="/admin/spot-wisata"
            className="flex items-center gap-sm p-md rounded-2xl border border-outline-variant hover:bg-tertiary-fixed/10 hover:border-tertiary transition-all"
          >
            <span className="material-symbols-outlined text-tertiary">add_location</span>
            <span className="text-lg font-medium text-on-surface">Tambah Spot Wisata</span>
          </a>
          <a
            href="/admin/berita"
            className="flex items-center gap-sm p-md rounded-2xl border border-outline-variant hover:bg-secondary-fixed/10 hover:border-secondary transition-all"
          >
            <span className="material-symbols-outlined text-secondary">edit_note</span>
            <span className="text-lg font-medium text-on-surface">Tulis Artikel Baru</span>
          </a>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-lg bg-primary/5 rounded-3xl p-xl border border-primary/20">
        <div className="flex items-start gap-md">
          <span className="material-symbols-outlined text-primary text-4xl mt-1">info</span>
          <div>
            <h3 className="font-semibold text-on-surface text-xl">Panduan Penggunaan</h3>
            <p className="text-on-surface-variant text-xl mt-xs leading-relaxed">
              Gunakan menu di sidebar kiri untuk mengelola data UMKM, Spot Wisata, dan Berita.
              Setiap perubahan akan langsung ditampilkan di website publik setelah disimpan.
              Pastikan untuk mengisi semua kolom wajib sebelum menyimpan data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
