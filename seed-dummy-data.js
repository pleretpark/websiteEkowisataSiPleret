// Script untuk memasukkan data dummy ke database Supabase
// Pastikan tabel sudah dibuat di Supabase sebelum menjalankan ini

const SUPABASE_URL = 'https://hkthyztpjtpsuiagqqhq.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdGh5enRwanRwc3VpYWdxcWhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjYyNTI5MywiZXhwIjoyMDk4MjAxMjkzfQ.cMdG0DcyRiKqmn8kYN_HnzShE-LgGTb3XrkNc0OZxcg';

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
  console.log('Memulai proses seeding data dummy...');

  // ==========================================
  // 1. Tambah Data UMKM
  // ==========================================
  console.log('\\n[1/4] Menambahkan data UMKM...');
  const umkmData = [
    {
      nama_produk: 'Ikan Asap Premium Arwana', kategori: 'Makanan', harga: 45000,
      deskripsi: 'Olahan ikan asap tradisional dengan bumbu rempah rahasia Tingkir Tengah.',
      gambar_url: 'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?q=80&w=800&auto=format&fit=crop',
      nomor_wa: '6281234567890', nama_toko: 'Toko Ikan Pak Budi'
    },
    {
      nama_produk: 'Keripik Kulit Ikan Nila', kategori: 'Makanan', harga: 25000,
      deskripsi: 'Camilan renyah kaya protein, diproses secara higienis dari kolam budidaya mandiri.',
      gambar_url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=800&auto=format&fit=crop',
      nomor_wa: '6281234567891', nama_toko: 'Keripik Bu Siti'
    },
    {
      nama_produk: 'Kerajinan Anyaman Bambu', kategori: 'Kerajinan', harga: 85000,
      deskripsi: 'Wadah multifungsi estetik buatan pengrajin lokal untuk gaya hidup berkelanjutan.',
      gambar_url: 'https://images.unsplash.com/photo-1620286884617-64010a3075d9?q=80&w=800&auto=format&fit=crop',
      nomor_wa: '6281234567892', nama_toko: 'Anyaman Ibu Karjo'
    },
    {
      nama_produk: 'Madu Hutan Organik', kategori: 'Makanan', harga: 95000,
      deskripsi: 'Madu hutan murni tanpa pengolahan, dipanen dari lebah lokal yang berkelanjutan.',
      gambar_url: 'https://images.unsplash.com/photo-1587049352847-81a56d773c1c?q=80&w=800&auto=format&fit=crop',
      nomor_wa: '6281234567893', nama_toko: 'Madu Pak Joko'
    }
  ];
  await insertData('umkm', umkmData);
  console.log('✅ Berhasil menambahkan data UMKM.');

  // ==========================================
  // 2. Tambah Data Spot Wisata
  // ==========================================
  console.log('\\n[2/4] Menambahkan data Spot Wisata...');
  const spotWisataData = [
    {
      nama_lokasi: 'Mina Wisata Kolam', kategori: 'Pemancingan',
      latitude: -7.316, longitude: 110.488, deskripsi: 'Kolam pemancingan keluarga dengan suasana asri dan nyaman.',
      gambar_url: 'https://images.unsplash.com/photo-1518776633606-407ea3b715a3?q=80&w=800&auto=format&fit=crop',
      jam_operasional: '08:00 - 17:00', status: 'published'
    },
    {
      nama_lokasi: 'Dapoer Ekowisata', kategori: 'Kuliner',
      latitude: -7.318, longitude: 110.490, deskripsi: 'Restoran ikan segar dengan menu olahan tradisional khas Tingkir.',
      gambar_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
      jam_operasional: '10:00 - 21:00', status: 'published'
    },
    {
      nama_lokasi: 'Taman Edukasi Air', kategori: 'Edukasi',
      latitude: -7.314, longitude: 110.486, deskripsi: 'Pusat edukasi budidaya ikan air tawar untuk anak-anak sekolah.',
      gambar_url: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=800&auto=format&fit=crop',
      jam_operasional: '09:00 - 16:00', status: 'published'
    }
  ];
  
  const insertedSpots = await insertData('spot_wisata', spotWisataData);
  console.log('✅ Berhasil menambahkan data Spot Wisata.');

  // ==========================================
  // 3. Tambah Data Ikan (relasi ke Spot Wisata)
  // ==========================================
  if (insertedSpots && insertedSpots.length > 0) {
    console.log('\\n[3/4] Menambahkan data Ikan...');
    
    // Ambil ID dari spot wisata yang baru saja dimasukkan
    const idPemancingan = insertedSpots.find(s => s.nama_lokasi === 'Mina Wisata Kolam')?.id;
    const idEdukasi = insertedSpots.find(s => s.nama_lokasi === 'Taman Edukasi Air')?.id;

    const ikanData = [
      {
        spot_wisata_id: idPemancingan,
        nama_ikan: 'Ikan Nila Merah', nama_ilmiah: 'Oreochromis niloticus',
        deskripsi: 'Ikan air tawar konsumsi yang sangat populer. Dagingnya tebal dan rasanya gurih.',
        kandungan_gizi: 'Tinggi protein (17g/100g), Kaya Omega-3, Rendah lemak jenuh.',
        habitat_dan_perawatan: 'Hidup di air tawar dengan pH 6.5 - 8.5. Membutuhkan sirkulasi air yang baik.',
        gambar_url: 'https://images.unsplash.com/photo-1534444583944-177b94c48970?q=80&w=800&auto=format&fit=crop'
      },
      {
        spot_wisata_id: idPemancingan,
        nama_ikan: 'Ikan Lele Sangkuriang', nama_ilmiah: 'Clarias gariepinus',
        deskripsi: 'Ikan berkumis yang tahan banting. Varian Sangkuriang memiliki pertumbuhan lebih cepat.',
        kandungan_gizi: 'Protein 18g, Lemak 3g, Vitamin D tinggi.',
        habitat_dan_perawatan: 'Mampu hidup di air dengan kadar oksigen rendah.',
        gambar_url: 'https://images.unsplash.com/photo-1516089309228-466d7dc5b497?q=80&w=800&auto=format&fit=crop'
      },
      {
        spot_wisata_id: idEdukasi,
        nama_ikan: 'Ikan Koi Edukasi', nama_ilmiah: 'Cyprinus rubrofuscus',
        deskripsi: 'Ikan hias primadona dengan berbagai corak warna yang indah untuk edukasi satwa.',
        kandungan_gizi: 'Tidak dikonsumsi (Ikan Hias).',
        habitat_dan_perawatan: 'Butuh kolam bersih, sistem filtrasi air yang kuat, dan pakan khusus warna.',
        gambar_url: 'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?q=80&w=800&auto=format&fit=crop'
      }
    ];
    await insertData('ikan', ikanData);
    console.log('✅ Berhasil menambahkan data Ikan.');
  }

  // ==========================================
  // 4. Tambah Data Berita
  // ==========================================
  console.log('\\n[4/4] Menambahkan data Berita...');
  const beritaData = [
    {
      judul: 'Tingkir Tengah Luncurkan Mina Wisata Kolam Interaktif',
      slug: 'tingkir-tengah-luncurkan-mina-wisata',
      konten: 'Pemerintah Kelurahan Tingkir Tengah resmi meluncurkan Mina Wisata Kolam sebagai destinasi ekowisata baru. Wisata ini menawarkan edukasi budidaya ikan sekaligus rekreasi pemancingan keluarga. Program ini diharapkan dapat memberdayakan masyarakat sekitar sekaligus melestarikan lingkungan melalui teknik budidaya ramah lingkungan.',
      author: 'Admin Ekowisata',
      is_sorotan: true,
      foto_cover: 'https://images.unsplash.com/photo-1521302580194-6b22ebdb4db3?q=80&w=800&auto=format&fit=crop'
    },
    {
      judul: 'Pelatihan UMKM Olahan Ikan bagi Warga',
      slug: 'pelatihan-umkm-olahan-ikan',
      konten: 'Dalam rangka meningkatkan nilai jual hasil panen ikan, diadakan pelatihan pembuatan keripik kulit ikan dan ikan asap bagi ibu-ibu PKK Tingkir Tengah. Pelatihan ini mendatangkan ahli teknologi pangan yang mengajarkan teknik pengasapan standar higienis dan pengemasan modern agar produk bisa bersaing di pasar.',
      author: 'Admin Kelurahan',
      is_sorotan: false,
      foto_cover: 'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?q=80&w=800&auto=format&fit=crop'
    }
  ];
  await insertData('berita', beritaData);
  console.log('✅ Berhasil menambahkan data Berita.');

  console.log('\\n🎉 SELESAI! Semua data dummy berhasil dimasukkan ke database.');
}

main().catch(console.error);
