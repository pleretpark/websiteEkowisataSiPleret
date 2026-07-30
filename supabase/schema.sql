-- ============================================
-- SQL untuk Ekowisata Tingkir Tengah
-- Jalankan di Supabase Dashboard SQL Editor
-- https://supabase.com/dashboard/project/hkthyztpjtpsuiagqqhq/sql/new
-- ============================================

-- ============================================
-- 1. Tabel spot_wisata
-- ============================================
CREATE TABLE IF NOT EXISTS public.spot_wisata (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_lokasi text NOT NULL,
  kategori text NOT NULL DEFAULT 'Pemancingan',
  latitude double precision NOT NULL DEFAULT -7.317,
  longitude double precision NOT NULL DEFAULT 110.488,
  deskripsi text NOT NULL DEFAULT '',
  gambar_url text,
  jam_operasional text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.spot_wisata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spot_wisata_auth_full" ON public.spot_wisata
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "spot_wisata_anon_read" ON public.spot_wisata
  FOR SELECT TO anon USING (status = 'published');

-- ============================================
-- 2. Tabel umkm
-- ============================================
CREATE TABLE IF NOT EXISTS public.umkm (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_produk text NOT NULL,
  kategori text NOT NULL DEFAULT 'Makanan',
  harga integer NOT NULL DEFAULT 0,
  deskripsi text NOT NULL DEFAULT '',
  gambar_url text,
  nomor_wa text NOT NULL DEFAULT '',
  nama_toko text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.umkm ENABLE ROW LEVEL SECURITY;

CREATE POLICY "umkm_auth_full" ON public.umkm
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "umkm_anon_read" ON public.umkm
  FOR SELECT TO anon USING (true);

-- Visitor
ALTER TABLE "Visitor" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read Visitor" ON "Visitor" FOR SELECT USING (true);
CREATE POLICY "Public can insert and update Visitor" ON "Visitor" FOR ALL USING (true);

-- ============================================
-- 3. Tabel ikan (relasi ke spot_wisata)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ikan (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_wisata_id uuid REFERENCES public.spot_wisata(id) ON DELETE CASCADE,
  nama_ikan text NOT NULL,
  nama_ilmiah text,
  deskripsi text NOT NULL DEFAULT '',
  kandungan_gizi text,
  habitat_dan_perawatan text,
  gambar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.ikan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ikan_auth_full" ON public.ikan
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "ikan_anon_read" ON public.ikan
  FOR SELECT TO anon USING (true);

-- ============================================
-- 4. Tabel berita
-- ============================================
CREATE TABLE IF NOT EXISTS public.berita (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  judul text NOT NULL,
  slug text UNIQUE NOT NULL,
  konten text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'Admin',
  tanggal_publikasi timestamptz DEFAULT now(),
  foto_cover text,
  is_sorotan boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;

CREATE POLICY "berita_auth_full" ON public.berita
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "berita_anon_read" ON public.berita
  FOR SELECT TO anon USING (true);

-- ============================================
-- 5. Storage Bucket & Policies ('images')
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: siapapun bisa lihat gambar (public read)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public image access'
  ) THEN
    CREATE POLICY "Public image access" ON storage.objects
      FOR SELECT USING (bucket_id = 'images');
  END IF;
END $$;

-- Policy: authenticated user bisa upload gambar
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Auth image upload'
  ) THEN
    CREATE POLICY "Auth image upload" ON storage.objects
      FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');
  END IF;
END $$;

-- Policy: authenticated user bisa update gambar
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Auth image update'
  ) THEN
    CREATE POLICY "Auth image update" ON storage.objects
      FOR UPDATE TO authenticated USING (bucket_id = 'images');
  END IF;
END $$;

-- Policy: authenticated user bisa hapus gambar
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Auth image delete'
  ) THEN
    CREATE POLICY "Auth image delete" ON storage.objects
      FOR DELETE TO authenticated USING (bucket_id = 'images');
  END IF;
END $$;
