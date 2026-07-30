import { KategoriLokasi } from '@prisma/client'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data
  await prisma.detailUMKM.deleteMany()
  await prisma.detailIkan.deleteMany()
  await prisma.lokasi.deleteMany()
  await prisma.berita.deleteMany()

  // 1. Seed Lokasi & Detail UMKM
  const umkm1 = await prisma.lokasi.create({
    data: {
      nama_titik: 'Toko Ikan Pak Budi',
      kategori: KategoriLokasi.UMKM,
      latitude: -7.317,
      longitude: 110.489,
      foto_thumbnail: '/images/umkm-ikan-asap.png',
      detail_umkm: {
        create: {
          nama_pemilik: 'Pak Budi',
          no_whatsapp: '6281234567890',
          deskripsi_produk: 'Olahan ikan asap tradisional dengan bumbu rempah rahasia Tingkir Tengah.',
          harga: 45000,
        },
      },
    },
  })

  const umkm2 = await prisma.lokasi.create({
    data: {
      nama_titik: 'Keripik Bu Siti',
      kategori: KategoriLokasi.UMKM,
      latitude: -7.319,
      longitude: 110.491,
      foto_thumbnail: '/images/umkm-keripik.png',
      detail_umkm: {
        create: {
          nama_pemilik: 'Bu Siti',
          no_whatsapp: '6281234567891',
          deskripsi_produk: 'Camilan renyah kaya protein, diproses secara higienis dari kolam budidaya mandiri.',
          harga: 25000,
        },
      },
    },
  })

  const umkm3 = await prisma.lokasi.create({
    data: {
      nama_titik: 'Anyaman Ibu Karjo',
      kategori: KategoriLokasi.UMKM,
      latitude: -7.315,
      longitude: 110.487,
      foto_thumbnail: '/images/umkm-anyaman.png',
      detail_umkm: {
        create: {
          nama_pemilik: 'Ibu Karjo',
          no_whatsapp: '6281234567892',
          deskripsi_produk: 'Wadah multifungsi estetik buatan pengrajin lokal untuk gaya hidup berkelanjutan.',
          harga: 85000,
        },
      },
    },
  })

  // 2. Seed Spot Wisata
  await prisma.lokasi.create({
    data: {
      nama_titik: 'Mina Wisata Kolam Pemancingan',
      kategori: KategoriLokasi.WISATA,
      latitude: -7.316,
      longitude: 110.488,
      foto_thumbnail: '/images/hero-banner.png',
    },
  })

  await prisma.lokasi.create({
    data: {
      nama_titik: 'Dapoer Ekowisata Tingkir Tengah',
      kategori: KategoriLokasi.WISATA,
      latitude: -7.318,
      longitude: 110.49,
      foto_thumbnail: '/images/community.png',
    },
  })

  await prisma.lokasi.create({
    data: {
      nama_titik: 'Taman Edukasi Air Tawar',
      kategori: KategoriLokasi.WISATA,
      latitude: -7.314,
      longitude: 110.486,
      foto_thumbnail: '/images/about-hero.png',
    },
  })

  // 3. Seed Detail Ikan
  await prisma.lokasi.create({
    data: {
      nama_titik: 'Kolam Budidaya Nila Merah',
      kategori: KategoriLokasi.IKAN,
      latitude: -7.32,
      longitude: 110.485,
      foto_thumbnail: '/images/hero-banner.png',
      detail_ikan: {
        create: {
          nama_ilmiah: 'Oreochromis niloticus',
          kandungan_gizi: 'Tinggi protein (26g/100g), Asam Lemak Omega-3, Selenium, dan Vitamin B12.',
          habitat_dan_perawatan: 'Hidup optimal di suhu 25-30°C dengan sirkulasi air mengalir jernih.',
          deskripsi: 'Ikan konsumsi populer hasil budidaya air tawar lokal Tingkir Tengah.',
        },
      },
    },
  })

  // 4. Seed Berita
  await prisma.berita.createMany({
    data: [
      {
        judul: 'Pengembangan Ekowisata Berbasis Air Tawar di Tingkir Tengah',
        slug: 'pengembangan-ekowisata-berbasis-air-tawar',
        konten: 'Kelurahan Tingkir Tengah meluncurkan inisiatif baru pengembangan kawasan ekowisata berbasis budidaya perikanan air tawar dan wisata edukasi keluarga...',
        author: 'Tim Redaksi KKN',
        foto_cover: '/images/hero-banner.png',
        is_sorotan: true,
      },
      {
        judul: 'Pelatihan Olahan Ikan Asap Bagi Kelompok Usaha Bersama',
        slug: 'pelatihan-olahan-ikan-asap',
        konten: 'Dalam rangka meningkatkan nilai tambah hasil perikanan, mahasiswa KKN mengadakan workshop teknik pengasapan higienis...',
        author: 'Tim Redaksi KKN',
        foto_cover: '/images/community.png',
        is_sorotan: false,
      },
      {
        judul: 'Peluncuran Peta Digital Ekowisata dan Katalog UMKM',
        slug: 'peluncuran-peta-digital-ekowisata',
        konten: 'Platform digital Ekowisata SiPleret resmi dirilis untuk memudahkan wisatawan mengeksplorasi potensi perikanan dan UMKM desa...',
        author: 'Tim Redaksi KKN',
        foto_cover: '/images/about-hero.png',
        is_sorotan: false,
      },
    ],
  })

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
