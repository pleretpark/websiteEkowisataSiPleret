# Spesifikasi Kebutuhan Perangkat Lunak (SKPL) / SRS
**Proyek:** Platform Digital Ekowisata dan Pemetaan Potensi Kelurahan Tingkir Tengah

---

## 1. Pembagian Peran & Hak Akses (Role-Based Access Control)
Sistem diimplementasikan menggunakan otorisasi dua tingkat yang memisahkan area publik (*front-facing*) dan area administratif (*back-office*).

### A. Pengguna Umum (Public User / End-User)
* **Deskripsi:** Pengunjung website dari kalangan masyarakat luas atau calon wisatawan.
* **Autentikasi:** Tidak diperlukan (Bebas akses).
* **Hak Akses (Read-Only):**
  * Melihat dan berinteraksi dengan antarmuka utama (Landing Page).
  * Mencari dan memfilter direktori katalog UMKM.
  * Mengakses detail produk UMKM dan menekan tombol *redirect* ke WhatsApp penjual.
  * Mengeksplorasi peta spot ekowisata.
  * Membaca artikel, berita, dan sejarah desa.

### B. Administrator (Pengelola / Pokdarwis / Mahasiswa KKN)
* **Deskripsi:** Pengelola platform yang bertugas menjaga kebaruan data (*data freshness*).
* **Autentikasi:** Wajib (Menggunakan Email dan Password yang terenkripsi).
* **Hak Akses (Full CRUD):**
  * Mengakses *dashboard* administratif melalui rute privat (`/admin`).
  * **Create:** Menambah data UMKM baru, titik spot wisata, artikel berita, dan mengunggah gambar.
  * **Read:** Melihat seluruh rekapitulasi data yang tersimpan di dalam *database*.
  * **Update:** Memperbarui harga produk, mengubah deskripsi UMKM, atau merevisi artikel berita.
  * **Delete:** Menghapus data produk, artikel, atau spot wisata yang sudah tidak relevan atau tutup.

---

## 2. Kebutuhan Fungsional (Rincian Modul & Fitur)

### A. Modul Publik (Front-End)
1. **Modul Hero & Beranda (Landing Page):**
   * *Slider/Banner* visualisasi pesona air tawar dan kearifan lokal.
   * Ringkasan singkat mengenai visi ekowisata Tingkir Tengah.
   * *Call-to-Action* (CTA) untuk langsung menuju peta wisata atau katalog produk.
2. **Modul Direktori UMKM:**
   * Tampilan *Grid Layout* berisi kartu (*card*) produk olahan perikanan dan kerajinan.
   * Fitur pencarian (*Search*) berdasarkan nama produk atau nama toko.
   * Fitur *filtering* berdasarkan kategori (misal: Makanan Siap Saji, Bahan Mentah, Kerajinan).
   * Integrasi *Click-to-Chat* API WhatsApp pada setiap produk.
3. **Modul Web GIS (Pemetaan Spot):**
   * Integrasi *embed* peta (Google Maps API / Leaflet.js).
   * *Markers* penanda lokasi titik strategis (Kolam Pemancingan, Restoran Ikan, Balai Desa).
   * Info *pop-up* saat titik penanda diklik (berisi foto lokasi, nama, dan jam operasional).
4. **Modul Pusat Informasi & Artikel:**
   * Tampilan daftar artikel terkait kegiatan KKN, pengumuman desa, atau edukasi perikanan berkelanjutan.

### B. Modul Administratif (Back-End / Dashboard)
1. **Modul Manajemen Autentikasi:**
   * Form *login* khusus admin.
   * Proteksi rute (Middleware) untuk memblokir akses tanpa token sesi yang valid.
2. **Modul Manajemen Konten (CMS):**
   * Antarmuka tabel data UMKM dan Berita (*DataGrid*).
   * Form input data dengan validasi kolom wajib (Nama, Harga, Deskripsi).
   * Integrasi tombol unggah (*upload*) media/foto.
3. **Modul Dashboard Statistik:**
   * Tampilan metrik ringkasan sederhana (Total UMKM terdaftar, Total Artikel).

---

## 3. Skema & Penggunaan Database (Supabase PostgreSQL)
Berbeda dengan penyimpanan *file-based*, platform ini memanfaatkan Supabase sebagai *Backend-as-a-Service* (BaaS) berbasis relasional (PostgreSQL).

* **Supabase Auth:** Menangani manajemen *user session* (JWT - *JSON Web Tokens*).
* **Supabase Storage (Buckets):** Digunakan secara khusus untuk menyimpan aset statis dinamis (foto produk UMKM, *thumbnail* artikel) yang diunggah oleh admin, menjaga agar repositori *source code* tetap ringan.
* **Tabel Inti Database (Draft Skema):**
  1. `umkm`: Menyimpan ID, nama produk, kategori, harga, deskripsi, tautan gambar (*URL Storage*), dan nomor WA.
  2. `spot_wisata`: Menyimpan ID, nama lokasi, kategori, koordinat (Latitude, Longitude), dan deskripsi.
  3. `berita`: Menyimpan ID, judul, isi konten, *author*, tanggal publikasi, dan gambar sampul.

---

## 4. Sistem Keamanan & Kebutuhan Non-Fungsional

### A. Protokol Keamanan Sistem
1. **Row Level Security (RLS) pada Database:**
   * Supabase RLS diaktifkan pada semua tabel.
   * *Policy 1:* Publik/Anonim diizinkan mengakses perintah `SELECT` (Read) untuk membaca katalog.
   * *Policy 2:* Akses `INSERT`, `UPDATE`, `DELETE` mutlak dikunci dan hanya dapat dieksekusi oleh *user* dengan status *Authenticated* (Admin yang sudah login).
2. **Proteksi Variabel Lingkungan (Environment Variables):**
   * Kunci rahasia API (Supabase URL, Service Role Keys) disimpan di dalam file `.env` yang tidak diunggah ke *version control* (GitHub), mencegah eksploitasi pihak ketiga.
3. **Middleware Security (Next.js):**
   * Setiap upaya navigasi ke rute `/admin/*` akan dicegat oleh Edge Middleware untuk memverifikasi validitas JWT *cookie*. Jika gagal, pengguna otomatis dilempar kembali ke halaman `/login`.

### B. Kinerja & Infrastruktur (Non-Fungsional)
1. **Arsitektur Rendering:**
   * Kombinasi *Static Site Generation* (SSG) untuk halaman publik (memaksimalkan kecepatan *loading* dan SEO) dan *Server-Side Rendering* (SSR) / *Client-Side Fetching* untuk halaman internal *dashboard* admin.
2. **Zero-Cost Deployment Workflow:**
   * *Source code* dikelola secara rapi di repositori GitHub (dengan pembagian *branch* untuk fitur pengembangan).
   * Terintegrasi dengan Vercel untuk memicu proses *Build & Deploy* otomatis (CI/CD pipeline) sesaat setelah kode di-*merge* ke *branch* utama.
3. **Optimasi Aset:**
   * Penggunaan tag `<Image />` bawaan Next.js untuk konversi gambar otomatis ke format modern (WebP) dan *lazy loading*, menghemat penggunaan *bandwidth* secara masif.