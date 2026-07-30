// Script untuk memasukkan data final (fix) ke database Supabase
// Pastikan tabel sudah dibuat di Supabase sebelum menjalankan ini

const SUPABASE_URL = 'https://tmcyscfrojywoosmxguz.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtY3lzY2Zyb2p5d29vc214Z3V6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDk1NzAxNCwiZXhwIjoyMTAwNTMzMDE0fQ.pUkbI60V9whre2OltdBFdwLWArx4yXNXosW2rp73vLI';

async function insertData(table, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'return=representation' // Agar mengembalikan data yang baru dimasukkan
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gagal insert ke tabel ${table}:`, response.status, errorText);
    return null;
  }
  
  return await response.json();
}

async function main() {
  console.log('Memulai proses seeding data final...');

  // ==========================================
  // 1. Tambah Data UMKM
  // ==========================================
  console.log('\n[1/4] Menambahkan data UMKM...');
  const umkmData = [
    {
      nama_produk: 'Ikan Asap Tradisional', 
      kategori: 'Makanan', 
      harga: 45000,
      deskripsi: 'Olahan ikan asap tradisional dengan bumbu rempah rahasia Tingkir Tengah.',
      gambar_url: '/images/umkm-ikan-asap.png',
      nomor_wa: '6281234567890', 
      nama_toko: 'Toko Ikan Pak Budi'
    },
    {
      nama_produk: 'Keripik Kulit Ikan', 
      kategori: 'Makanan', 
      harga: 25000,
      deskripsi: 'Camilan renyah kaya protein, diproses secara higienis dari kolam budidaya mandiri.',
      gambar_url: '/images/umkm-keripik.png',
      nomor_wa: '6281234567891', 
      nama_toko: 'Keripik Bu Siti'
    },
    {
      nama_produk: 'Kerajinan Anyaman', 
      kategori: 'Kerajinan', 
      harga: 85000,
      deskripsi: 'Wadah multifungsi estetik buatan pengrajin lokal untuk gaya hidup berkelanjutan.',
      gambar_url: '/images/umkm-anyaman.png',
      nomor_wa: '6281234567892', 
      nama_toko: 'Anyaman Ibu Karjo'
    }
  ];
  await insertData('umkm', umkmData);
  console.log('✅ Berhasil menambahkan data UMKM.');

  // ==========================================
  // 2. Tambah Data Spot Wisata
  // ==========================================
  console.log('\n[2/4] Menambahkan data Spot Wisata...');
  const spotWisataData = [
    {
      nama_lokasi: 'Mina Wisata Kolam Pemancingan', 
      kategori: 'Pemancingan',
      latitude: -7.316, 
      longitude: 110.488, 
      deskripsi: 'Kolam pemancingan keluarga dengan suasana asri dan nyaman.',
      gambar_url: '/images/hero-banner.png',
      jam_operasional: '08:00 - 17:00', 
      status: 'published'
    },
    {
      nama_lokasi: 'Dapoer Ekowisata Tingkir Tengah', 
      kategori: 'Kuliner',
      latitude: -7.318, 
      longitude: 110.490, 
      deskripsi: 'Restoran ikan segar dengan menu olahan tradisional khas Tingkir.',
      gambar_url: '/images/community.png',
      jam_operasional: '10:00 - 21:00', 
      status: 'published'
    },
    {
      nama_lokasi: 'Taman Edukasi Air Tawar', 
      kategori: 'Edukasi',
      latitude: -7.314, 
      longitude: 110.486, 
      deskripsi: 'Pusat edukasi budidaya ikan air tawar untuk anak-anak sekolah.',
      gambar_url: '/images/about-hero.png',
      jam_operasional: '09:00 - 16:00', 
      status: 'published'
    },
    {
      nama_lokasi: 'Kolam Budidaya Nila Merah', 
      kategori: 'Budidaya',
      latitude: -7.320, 
      longitude: 110.485, 
      deskripsi: 'Kolam budidaya ikan nila merah untuk produksi mandiri dan ekowisata.',
      gambar_url: '/images/hero-banner.png',
      jam_operasional: '07:00 - 15:00', 
      status: 'published'
    }
  ];
  
  const insertedSpots = await insertData('spot_wisata', spotWisataData);
  console.log('✅ Berhasil menambahkan data Spot Wisata.');

  // ==========================================
  // 3. Tambah Data Ikan (relasi ke Spot Wisata)
  // ==========================================
  if (insertedSpots && insertedSpots.length > 0) {
    console.log('\n[3/4] Menambahkan data Ikan...');
    
    // Ambil ID dari spot wisata Budidaya Nila Merah
    const idBudidayaNila = insertedSpots.find(s => s.nama_lokasi === 'Kolam Budidaya Nila Merah')?.id;

    if (idBudidayaNila) {
      const ikanData = [
        {
          spot_wisata_id: idBudidayaNila,
          nama_ikan: 'Nila Merah', 
          nama_ilmiah: 'Oreochromis niloticus',
          deskripsi: 'Ikan konsumsi populer hasil budidaya air tawar lokal Tingkir Tengah.',
          kandungan_gizi: 'Tinggi protein (26g/100g), Asam Lemak Omega-3, Selenium, dan Vitamin B12.',
          habitat_dan_perawatan: 'Hidup optimal di suhu 25-30°C dengan sirkulasi air mengalir jernih.',
          gambar_url: '/images/hero-banner.png'
        }
      ];
      await insertData('ikan', ikanData);
      console.log('✅ Berhasil menambahkan data Ikan.');
    }
  }

  // ==========================================
  // 4. Tambah Data Berita
  // ==========================================
  console.log('\n[4/4] Menambahkan data Berita...');
  const beritaData = [
    {
      judul: 'Pengembangan Ekowisata Berbasis Air Tawar di Tingkir Tengah',
      slug: 'pengembangan-ekowisata-berbasis-air-tawar',
      konten: 'Kelurahan Tingkir Tengah meluncurkan inisiatif baru pengembangan kawasan ekowisata berbasis budidaya perikanan air tawar dan wisata edukasi keluarga...',
      author: 'Tim Redaksi KKN',
      is_sorotan: true,
      foto_cover: '/images/hero-banner.png'
    },
    {
      judul: 'Pelatihan Olahan Ikan Asap Bagi Kelompok Usaha Bersama',
      slug: 'pelatihan-olahan-ikan-asap',
      konten: 'Dalam rangka meningkatkan nilai tambah hasil perikanan, mahasiswa KKN mengadakan workshop teknik pengasapan higienis...',
      author: 'Tim Redaksi KKN',
      is_sorotan: false,
      foto_cover: '/images/community.png'
    },
    {
      judul: 'Peluncuran Peta Digital Ekowisata dan Katalog UMKM',
      slug: 'peluncuran-peta-digital-ekowisata',
      konten: 'Platform digital Ekowisata SiPleret resmi dirilis untuk memudahkan wisatawan mengeksplorasi potensi perikanan dan UMKM desa...',
      author: 'Tim Redaksi KKN',
      is_sorotan: false,
      foto_cover: '/images/about-hero.png'
    }
  ];
  await insertData('berita', beritaData);
  console.log('✅ Berhasil menambahkan data Berita.');

  console.log('\n🎉 SELESAI! Semua data final berhasil dimasukkan ke database.');
}

main().catch(console.error);
