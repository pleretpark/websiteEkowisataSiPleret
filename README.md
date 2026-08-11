# Website Ekowisata Tingkir Tengah & Bendungan Si Pleret

Proyek website resmi untuk **Ekowisata Tingkir Tengah (Bendungan Si Pleret)**, Kota Salatiga. Website ini dikembangkan sebagai bentuk dedikasi dan pengabdian masyarakat oleh **Tim KKN-T 96 Universitas Diponegoro**.

Website ini berfungsi sebagai portal informasi wisata, promosi produk UMKM lokal, pusat berita/kegiatan desa, serta memiliki sistem manajemen konten (CMS) internal untuk memudahkan pengurus desa mengelola data.

## 🚀 Fitur Utama

### 🌟 Halaman Publik (Pengunjung)
- **Beranda (Landing Page):** Tampilan interaktif dengan video profil, ringkasan UMKM, berita terbaru, dan animasi *ScrollReveal* yang halus.
- **Profil & Sejarah (Tentang Kami):** Menampilkan legenda Jaka Tingkir, sejarah Bendungan Si Pleret, peta wilayah administrasi, serta rekam jejak pengabdian tim KKN.
- **Katalog UMKM:** Menampilkan daftar produk dan jasa UMKM lokal Tingkir Tengah beserta kategori dan detail kontak.
- **Berita & Acara:** Portal publikasi untuk mengumumkan acara desa, kegiatan pelestarian, dan informasi wisata. Terdapat fitur "Sorotan Utama" untuk berita penting.

### 🔐 Dasbor Admin (CMS)
- **Manajemen UMKM:** Tambah, edit, dan hapus data pelaku UMKM.
- **Kelola Berita:** Publikasi artikel dengan *rich-text editor*. Admin dapat menentukan **maksimal 3 Berita Sorotan** (dengan fitur tombol bintang interaktif) yang akan tampil di halaman depan.
- **Panduan Pengelolaan:** Halaman panduan interaktif (Budidaya Ikan, UMKM, dan Ekowisata) khusus untuk pengelola.
- **Statistik Pengunjung:** Pelacakan dan visualisasi data jumlah pengunjung website secara *real-time*.

## 🛠️ Teknologi yang Digunakan

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) dengan skema warna *Aquatic Harmony* (Teal, Azure, Moss).
- **Animasi:** Animasi kustom menggunakan `IntersectionObserver` (*ScrollReveal*), animasi CSS murni, dan mikro-interaksi (*glassmorphism*, *hover effects*).
- **Database & Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Authentication, Storage).
- **Bahasa:** TypeScript.

## 📦 Panduan Instalasi & Pengembangan

### Persyaratan
- Node.js versi 18.17 atau lebih baru.
- Akun dan Project Supabase (untuk Database & Storage).

### Langkah-langkah
1. **Clone repositori:**
   ```bash
   git clone https://github.com/pleretpark/websiteEkowisataSiPleret.git
   cd websiteEkowisataSiPleret
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env.local` di root proyek dan masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=url_supabase_anda
   NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_supabase_anda
   ```

4. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```

5. **Buka di Browser:**
   Akses [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

## 🎨 Log Perubahan (Changelog) Terkini
- Penambahan sistem animasi `ScrollReveal` yang interaktif pada halaman publik (Beranda, Tentang, Berita, Detail).
- Optimasi tata letak Grid CSS pada halaman Tentang untuk mencegah gambar mengecil.
- Peningkatan UI/UX Dasbor Admin:
  - Implementasi *Rich Text Editor* untuk pembuatan berita.
  - Penambahan sistem **Bintang Sorotan Berita** (Maksimal 3 berita, otomatis *disable* jika penuh, urutan sorotan berdasarkan waktu pembaruan).
- Integrasi pelacak statistik pengunjung *real-time* berbasis API (VisitorStats).

---
*Dibuat dengan ❤️ oleh Tim KKN-T 96 Universitas Diponegoro.*
