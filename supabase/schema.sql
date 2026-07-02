-- =============================================
-- SUPABASE DATABASE SCHEMA
-- Ekowisata Air Tawar Tingkir Tengah
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. TABEL UMKM
-- =============================================
CREATE TABLE IF NOT EXISTS umkm (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_produk TEXT NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN ('Makanan', 'Kerajinan', 'Minuman', 'Lainnya')),
  harga INTEGER NOT NULL DEFAULT 0,
  deskripsi TEXT NOT NULL,
  gambar_url TEXT,
  nomor_wa TEXT NOT NULL,
  nama_toko TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. TABEL SPOT WISATA
-- =============================================
CREATE TABLE IF NOT EXISTS spot_wisata (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_lokasi TEXT NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN ('Pemancingan', 'Kuliner', 'Edukasi', 'Budidaya', 'Lainnya')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  deskripsi TEXT NOT NULL,
  gambar_url TEXT,
  jam_operasional TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. TABEL BERITA
-- =============================================
CREATE TABLE IF NOT EXISTS berita (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  author TEXT NOT NULL,
  tanggal_publikasi DATE NOT NULL DEFAULT CURRENT_DATE,
  gambar_sampul_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_wisata ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

-- PUBLIC: Allow anonymous SELECT (Read) on all tables
CREATE POLICY "Public can read umkm" ON umkm
  FOR SELECT USING (true);

CREATE POLICY "Public can read spot_wisata" ON spot_wisata
  FOR SELECT USING (true);

CREATE POLICY "Public can read berita" ON berita
  FOR SELECT USING (true);

-- ADMIN: Allow authenticated users full CRUD
CREATE POLICY "Authenticated users can insert umkm" ON umkm
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update umkm" ON umkm
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete umkm" ON umkm
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert spot_wisata" ON spot_wisata
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update spot_wisata" ON spot_wisata
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete spot_wisata" ON spot_wisata
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert berita" ON berita
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update berita" ON berita
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete berita" ON berita
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKET (run in Supabase Dashboard)
-- =============================================
-- 1. Create a public bucket called "images"
-- 2. Set it to public so images can be served without auth
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- =============================================
-- SAMPLE DATA (optional, for testing)
-- =============================================
INSERT INTO umkm (nama_produk, kategori, harga, deskripsi, nomor_wa, nama_toko) VALUES
  ('Ikan Asap Premium Arwana', 'Makanan', 45000, 'Olahan ikan asap tradisional dengan bumbu rempah rahasia Tingkir Tengah.', '6281234567890', 'Toko Ikan Pak Budi'),
  ('Keripik Kulit Ikan Nila', 'Makanan', 25000, 'Camilan renyah kaya protein, diproses secara higienis dari kolam budidaya mandiri.', '6281234567891', 'Keripik Bu Siti'),
  ('Kerajinan Anyaman Bambu', 'Kerajinan', 85000, 'Wadah multifungsi estetik buatan pengrajin lokal untuk gaya hidup berkelanjutan.', '6281234567892', 'Anyaman Ibu Karjo');

INSERT INTO spot_wisata (nama_lokasi, kategori, latitude, longitude, deskripsi, jam_operasional, status) VALUES
  ('Mina Wisata Kolam', 'Pemancingan', -7.316, 110.488, 'Kolam pemancingan keluarga dengan suasana asri dan nyaman.', '08:00 - 17:00', 'published'),
  ('Dapoer Ekowisata', 'Kuliner', -7.318, 110.490, 'Restoran ikan segar dengan menu olahan tradisional.', '10:00 - 21:00', 'published'),
  ('Taman Edukasi Air', 'Edukasi', -7.314, 110.486, 'Pusat edukasi budidaya ikan air tawar untuk anak-anak.', '09:00 - 16:00', 'published');

INSERT INTO berita (judul, konten, author, tanggal_publikasi, status) VALUES
  ('Festival Ikan Tawar Tingkir 2024', 'Kelurahan Tingkir Tengah akan menggelar Festival Ikan Tawar tahunan yang menampilkan berbagai produk olahan perikanan, atraksi budaya, dan lomba memancing. Festival ini bertujuan untuk memperkenalkan potensi ekowisata air tawar kepada wisatawan domestik dan mancanegara.', 'Admin KKN', '2024-12-01', 'published'),
  ('Program Pelatihan Budidaya Ikan Organik', 'Tim KKN bersama Pokdarwis menyelenggarakan program pelatihan budidaya ikan organik menggunakan metode bioflok. Kegiatan ini diikuti oleh 30 pembudidaya ikan lokal yang antusias mempelajari teknik budidaya ramah lingkungan.', 'Tim KKN', '2024-11-15', 'published');
