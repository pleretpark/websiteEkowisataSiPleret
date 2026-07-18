# Catatan Pembaruan (Changelog) Ekowisata Tingkir Tengah

Dokumen ini mencatat seluruh perubahan, perbaikan bug, dan penambahan fitur yang dilakukan pada proyek Ekowisata Tingkir Tengah.

## [Versi Saat Ini] - 2026-07-18

### ✨ Fitur Baru
- **Halaman Berita & Kabar Wisata (`/berita`)**: 
  - Membuat halaman utama untuk menampilkan seluruh daftar berita.
  - **(Terbaru)** Mendesain ulang halaman utama berita (`/berita`) sesuai dengan mockup: terdapat 1 kartu *spotlight* berukuran besar di bagian paling atas, diikuti oleh grid artikel reguler 3-kolom di bagian bawah (tanpa kolom sidebar/langganan/populer/search untuk tata letak yang lebih bersih dan lapang).
  - **(Terbaru)** Mendesain ulang halaman detail berita (`/berita/[slug]`) agar persis menyerupai referensi gambar UI: menggunakan *layout* tengah (centered) dengan latar warna *off-white*, blok kutipan (*blockquote*) yang rapi, tag artikel, tombol bagikan, serta tambahan *section* **Berita Terkait** di bagian bawah.
  - Tampilan *date badge* dan label *Sorotan* di halaman beranda maupun halaman daftar berita.
- **Navigasi (Navbar & Footer)**:
  - Menambahkan link **Berita** ke menu Navbar atas dan Footer (Tautan Cepat).
- **Desain Ulang Footer**:
  - Mengembalikan tema Footer agar senada dengan Header (warna terang / `bg-surface-container-highest`).
  - Menghapus batasan `max-w` pada Footer sehingga layoutnya lebih melebar (`w-full px-gutter md:px-lg lg:px-[60px]`) dan tidak terpaku pada margin konten utama.
  - **(Terbaru)** Memperketat jarak antar-elemen (*tighter layout*): mengubah padding luar menjadi `py-lg`, grid gap menjadi `gap-md`, margin bawah judul menjadi `mb-sm`, serta membatasi lebar maksimal kontainer hingga `max-w-[1440px]` agar tidak terlalu renggang pada layar ultra-lebar.
  - Memisahkan komponen *VisitorStats* menjadi kolom ke-4 di sebelah kanan kolom "Hubungi Kami" (sekarang menggunakan grid 4 kolom).
  - Menambahkan deksripsi singkat *"Inisiatif berbasis komunitas untuk pariwisata berkelanjutan dan pemberdayaan ekonomi."* di bawah logo Ekowisata Tingkir Tengah.
  - Menambahkan ikon kontak, lokasi, email dummy (`halo@tingkirtengah.desa.id`), dan tautan Instagram (`@si_pleret`).
  - Menyesuaikan warna komponen *VisitorStats* kembali ke skema warna terang (light theme) dengan padding lebih rapat (`p-sm`).

### 🛠️ Perbaikan & Pembaruan (Refactoring)
- **Struktur Beranda (Homepage) & Katalog UMKM**:
  - Menyusun ulang urutan seksi beranda: *Hero*, *Tentang Kami (Singkat)*, *UMKM*, *Kabar Desa & Acara*, dan *Bersama Membangun Negeri dari Desa*.
  - Menambahkan tombol "Lihat Semua Berita" pada seksi Kabar Desa di beranda.
  - **(Terbaru)** Menyeragamkan desain kartu produk UMKM (di beranda maupun katalog UMKM) agar memiliki ukuran tinggi yang konsisten (flex-grow), meratakan posisi harga dan tombol di bagian bawah kartu secara horizontal, serta menyederhanakan teks tombol beli menjadi hanya **"Beli"** (tanpa ikon / "via WA").
- **Kecocokan Database (Prisma vs UI Admin)**:
  - Memperbarui `lib/types.ts` agar *interface* `Berita` persis mengikuti `schema.prisma` yang baru (`slug`, `foto_cover`, `is_sorotan`).
  - Memperbaiki halaman **Admin Berita (`/admin/berita`)** agar:
    - Mampu menyimpan `foto_cover` (bukan `gambar_sampul_url`).
    - Menyimpan checkbox *Sorotan Berita* (`is_sorotan`) alih-alih `status`.
    - **Otomatis membuat `slug`** (URL-friendly string) dari input judul artikel sebelum disimpan ke Supabase, sehingga fitur halaman detail berita dapat berfungsi.
- **Kompatibilitas Next.js 15**:
  - Memperbaiki penanganan dynamic routing `params` di `/berita/[slug]/page.tsx` menjadi Promise asinkron yang di-`await` (`const { slug } = await params;`) sesuai standar terbaru Next.js 15.
- **Penanganan Fallback Data Berita**:
  - Memperbaiki logika penarikan (fetch) data berita dengan menggunakan *Supabase Server Client*. Bila tabel kosong, UI akan melakukan *fallback* menampilkan sampel data dummy, agar halaman tidak *crash/404* saat dalam tahap *development*.
