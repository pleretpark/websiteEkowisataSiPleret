# Catatan Revisi Skema Database (Prisma vs SQL Lama)

Dokumen ini adalah ringkasan dari diskusi mengenai revisi skema database proyek Ekowisata Tingkir Tengah, membandingkan skema lama (`supabase/schema.sql`) dengan skema revisi berbasis Prisma.

## 1. Perubahan Struktur Utama (Lokasi)
- **Skema Lama**: Tabel `spot_wisata` dan `umkm` dipisah secara independen. Masing-masing memiliki titik koordinat (latitude & longitude) sendiri-sendiri.
- **Skema Baru (Prisma)**: Seluruh titik koordinat disatukan ke dalam satu tabel utama bernama `Lokasi`. Detail spesifik kemudian dipecah ke dalam tabel relasi `DetailUMKM` dan `DetailIkan`. 
  - *Keuntungan*: Arsitektur ini jauh lebih rapi dan ideal untuk sistem pemetaan (GIS) di frontend, karena cukup me-load satu tabel `Lokasi` untuk menampilkan semua marker di peta.

## 2. Perubahan Tabel Berita
- **Skema Lama**: `berita` (memiliki kolom `author`, `status` [draft/published], dan `gambar_sampul_url`).
- **Skema Baru**: `BeritaAcara` (ketambahan kolom `slug` yang sangat bagus untuk SEO URL, tetapi kehilangan kolom `author` dan `status`).

## 3. Data yang Hilang di Skema Baru
Jika menerapkan skema baru persis 100% seperti revisi, ada beberapa kolom fungsional dari skema lama yang akan hilang:
1. **`jam_operasional`**: Hilang dari entitas wisata/ikan.
2. **`status`**: Hilang dari entitas wisata (draft/published).
3. **`nama_toko`**: Hilang dari UMKM (hanya tersisa `nama_pemilik`).
4. **`author` dan `status`**: Hilang dari BeritaAcara.

## Rekomendasi Langkah Selanjutnya
Disarankan untuk **menerima arsitektur baru (Prisma)** karena lebih terstruktur secara relasional, namun dengan **mengembalikan kolom-kolom yang hilang** tersebut ke dalam skema Prisma agar fitur aplikasi (seperti jam buka dan status draf berita) tetap bisa berjalan normal.
