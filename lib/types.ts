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
  kategori: 'Pemancingan' | 'Kuliner' | 'Edukasi' | 'Budidaya' | 'Lainnya'
  latitude: number
  longitude: number
  deskripsi: string
  gambar_url: string | null
  jam_operasional: string | null
  status: 'published' | 'draft'
  created_at: string
  updated_at: string
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
}

export interface DashboardStats {
  totalUmkm: number
  totalSpotWisata: number
  totalBerita: number
}
