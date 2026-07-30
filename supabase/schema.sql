-- =============================================
-- SUPABASE SECURITY & STORAGE SCHEMA
-- Diadaptasi untuk Prisma Schema Baru
-- =============================================

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- 1. Aktifkan RLS pada tabel hasil generate Prisma
ALTER TABLE "Lokasi" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DetailUMKM" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DetailIkan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Berita" ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC: Mengizinkan akses BACA (Read) untuk semua orang (anonim)
CREATE POLICY "Public can read Lokasi" ON "Lokasi" FOR SELECT USING (true);
CREATE POLICY "Public can read DetailUMKM" ON "DetailUMKM" FOR SELECT USING (true);
CREATE POLICY "Public can read DetailIkan" ON "DetailIkan" FOR SELECT USING (true);
CREATE POLICY "Public can read Berita" ON "Berita" FOR SELECT USING (true);

-- 3. ADMIN: Mengizinkan akses PENUH (CRUD) hanya untuk user yang login (admin)
-- Lokasi
CREATE POLICY "Admin can insert Lokasi" ON "Lokasi" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update Lokasi" ON "Lokasi" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete Lokasi" ON "Lokasi" FOR DELETE USING (auth.role() = 'authenticated');

-- DetailUMKM
CREATE POLICY "Admin can insert DetailUMKM" ON "DetailUMKM" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update DetailUMKM" ON "DetailUMKM" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete DetailUMKM" ON "DetailUMKM" FOR DELETE USING (auth.role() = 'authenticated');

-- DetailIkan
CREATE POLICY "Admin can insert DetailIkan" ON "DetailIkan" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update DetailIkan" ON "DetailIkan" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete DetailIkan" ON "DetailIkan" FOR DELETE USING (auth.role() = 'authenticated');

-- Berita
CREATE POLICY "Admin can insert Berita" ON "Berita" FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update Berita" ON "Berita" FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete Berita" ON "Berita" FOR DELETE USING (auth.role() = 'authenticated');

-- Visitor
ALTER TABLE "Visitor" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read Visitor" ON "Visitor" FOR SELECT USING (true);
CREATE POLICY "Public can insert and update Visitor" ON "Visitor" FOR ALL USING (true);

-- =============================================
-- STORAGE BUCKET (Jika belum dibuat)
-- =============================================
-- Perintah ini untuk membuat bucket gambar agar bersifat publik
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
