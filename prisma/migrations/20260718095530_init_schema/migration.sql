-- CreateEnum
CREATE TYPE "KategoriLokasi" AS ENUM ('WISATA', 'UMKM', 'IKAN');

-- CreateTable
CREATE TABLE "Lokasi" (
    "id" TEXT NOT NULL,
    "nama_titik" TEXT NOT NULL,
    "kategori" "KategoriLokasi" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "foto_thumbnail" TEXT,

    CONSTRAINT "Lokasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailUMKM" (
    "id" TEXT NOT NULL,
    "lokasi_id" TEXT NOT NULL,
    "nama_pemilik" TEXT NOT NULL,
    "no_whatsapp" TEXT NOT NULL,
    "deskripsi_produk" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,

    CONSTRAINT "DetailUMKM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailIkan" (
    "id" TEXT NOT NULL,
    "lokasi_id" TEXT NOT NULL,
    "nama_ilmiah" TEXT NOT NULL,
    "kandungan_gizi" TEXT NOT NULL,
    "habitat_dan_perawatan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,

    CONSTRAINT "DetailIkan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "tanggal_publikasi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foto_cover" TEXT,
    "is_sorotan" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DetailUMKM_lokasi_id_key" ON "DetailUMKM"("lokasi_id");

-- CreateIndex
CREATE UNIQUE INDEX "DetailIkan_lokasi_id_key" ON "DetailIkan"("lokasi_id");

-- CreateIndex
CREATE UNIQUE INDEX "Berita_slug_key" ON "Berita"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_date_key" ON "Visitor"("date");

-- AddForeignKey
ALTER TABLE "DetailUMKM" ADD CONSTRAINT "DetailUMKM_lokasi_id_fkey" FOREIGN KEY ("lokasi_id") REFERENCES "Lokasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailIkan" ADD CONSTRAINT "DetailIkan_lokasi_id_fkey" FOREIGN KEY ("lokasi_id") REFERENCES "Lokasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
