export interface UMKM {
  id: string
  nama_produk: string
  kategori: 'Makanan' | 'Kerajinan' | 'Minuman' | 'Lainnya'
  harga: number
  deskripsi: string
  gambar_url: string | null
  nomor_wa: string
  nama_toko: string
  created_at: string
  updated_at: string
}

export interface SpotWisata {
  id: string
  nama_lokasi: string
  kategori: 'Pemancingan' | 'UMKM' | 'Wisata' | 'Budidaya' | 'Lainnya'
  latitude: number
  longitude: number
  deskripsi: string
  gambar_url: string | null
  jam_operasional: string | null
  status: 'published' | 'draft'
  created_at: string
  updated_at: string
}

export interface Ikan {
  id: string
  spot_wisata_id: string | null
  nama_ikan: string
  nama_ilmiah: string | null
  deskripsi: string
  kandungan_gizi: string | null
  fakta_menarik: string | null
  gambar_url: string | null
  created_at: string
  updated_at: string
  // Joined data (when querying with spot_wisata)
  spot_wisata?: SpotWisata
}

export interface Berita {
  id: string
  judul: string
  slug: string
  konten: string
  author: string
  tanggal_publikasi: string
  foto_cover: string | null
  is_sorotan: boolean
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalUmkm: number
  totalSpotWisata: number
  totalBerita: number
  totalIkan: number
}
