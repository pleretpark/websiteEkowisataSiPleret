'use client'

import Image from 'next/image'
import { useState } from 'react'

const pillars = [
  {
    icon: 'agriculture',
    title: 'Pertanian Regeneratif',
    description: 'Mengajarkan petani lokal teknik organik yang memperbaiki kesehatan tanah dan menghasilkan tanaman berkualitas premium.',
    color: 'bg-tertiary-fixed/20 text-tertiary',
  },
  {
    icon: 'park',
    title: 'Program Reboisasi',
    description: 'Menanam lebih dari 10.000 pohon asli sejak tahun 2020 untuk menjaga ekosistem air tawar.',
    color: 'bg-primary-fixed/20 text-primary',
  },
  {
    icon: 'storefront',
    title: 'Inkubasi UMKM',
    description: 'Mendukung 50+ usaha mikro dengan peralatan digital dan jalur pemasaran internasional.',
    color: 'bg-secondary-fixed/20 text-secondary',
  },
  {
    icon: 'school',
    title: 'Pusat Edukasi Lingkungan',
    description: 'Memberikan lokakarya lingkungan mingguan untuk sekolah-sekolah di sekitar wilayah Tingkir.',
    color: 'bg-tertiary-fixed/20 text-tertiary',
  },
]

export default function TentangPage() {
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <>
      {/* 1. HEADER & VIDEO PROFIL */}
      <header className="pt-xl pb-lg md:pt-[100px] text-center px-gutter max-w-[1000px] mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight tracking-tight mb-sm">
          Tentang Tingkir Tengah 
          <br />
          <span className="text-[#003d37] italic font-medium">& Bendungan Si Pleret</span>
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-xl">
          Sebuah ruang di mana kearifan lokal, kelestarian alam, dan pariwisata berkelanjutan bersatu dalam harmoni. Selamat datang di kebanggaan Kota Salatiga.
        </p>

        {/* Video Profil Wrapper */}
        <div id="profil-video" className="relative z-10 rounded-3xl overflow-hidden shadow-ambient-lg aspect-video bg-surface-container-low border border-outline-variant max-w-[900px] mx-auto">
          {/* Ganti URL src di bawah dengan link YouTube yang asli jika sudah selesai */}
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/kaCPjx0F3aw"
            title="Video Profil Ekowisata Tingkir Tengah"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <p className="mt-4 text-sm text-on-surface-variant/70 italic">
          Karya persembahan Tim KKN-T 96 Universitas Diponegoro
        </p>
      </header>

      {/* Pembatas Dekoratif */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent my-md"></div>

      {/* 2. KISAH JAKA TINGKIR (SEJARAH) */}
      <section id="story" className="py-xl bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-gutter">
          <div className="text-center mb-xl">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-xs block">
              Sejarah & Legenda
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-sm">
              Kisah Tingkir Tengah
            </h2>
            <h3 className="text-xl md:text-2xl text-primary font-medium max-w-3xl mx-auto leading-relaxed">
              Perjalanan Jaka Tingkir dan Asal Usul Bendungan Si Pleret
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
            <div className="lg:col-span-5 relative">
              <div className="sticky top-28 rounded-3xl overflow-hidden shadow-ambient-lg aspect-[3/4] bg-surface-container border border-outline-variant group">
                <Image
                  src="/images/jakatingkir.png"
                  alt="Ilustrasi Jaka Tingkir"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white font-medium">Ilustrasi Mas Karebet (Jaka Tingkir)</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-md text-on-surface-variant text-base md:text-lg leading-relaxed text-justify">
              <p>Pada abad ke-16, ketika Kesultanan Demak menjadi pusat pemerintahan dan penyebaran Islam di Pulau Jawa, hiduplah seorang pemuda bernama Mas Karebet yang kelak lebih dikenal sebagai Jaka Tingkir. Ia berasal dari daerah Tingkir, yang kini menjadi bagian dari Kota Salatiga, Jawa Tengah.</p>
              <p>Dikisahkan bahwa pada suatu waktu Jaka Tingkir memutuskan melakukan perjalanan menuju Keraton Demak. Ketika melintasi wilayah Dusun Payaman, ia menjumpai aliran sungai yang deras. Masyarakat setempat saat itu kesulitan memanfaatkan air sungai; meluap saat hujan dan kekeringan saat kemarau.</p>
              <p>Melihat hal tersebut, Jaka Tingkir merasa iba. Sebelum melanjutkan perjalanannya, ia membantu masyarakat menyusun batu-batu besar untuk membentuk sebuah bendung sederhana.</p>
              
              <div className="mt-md">
                {!showFullStory ? (
                  <button
                    onClick={() => setShowFullStory(true)}
                    className="inline-flex items-center gap-xs bg-primary/10 text-primary font-bold px-6 py-3 rounded-full hover:bg-primary hover:text-on-primary transition-all"
                  >
                    Lanjutkan Membaca Cerita
                    <span className="material-symbols-outlined text-xl">menu_book</span>
                  </button>
                ) : (
                  <div className="space-y-md animate-in fade-in slide-in-from-top-4 duration-700 mt-md pt-md border-t border-outline-variant/50">
                    <p>Bendung susunan batu tersebut dipercaya menjadi cikal bakal Bendungan Si Pleret. Nama &quot;Pleret&quot; sendiri konon berasal dari suara gemuruh air yang mengalir deras berbunyi &quot;pleret... pleret...&quot;.</p>
                    <p>Setelah membantu masyarakat, Jaka Tingkir melanjutkan perjalanan ke Demak, dan di kemudian hari diangkat menjadi Sultan Pajang. Bagi masyarakat Dusun Payaman, bendungan ini bukan sekadar peninggalan masa lalu, melainkan simbol kepedulian, gotong royong, dan pelestarian sumber daya air yang masih terus dijaga hingga hari ini.</p>
                    <button
                      onClick={() => setShowFullStory(false)}
                      className="inline-flex items-center gap-xs text-primary font-bold hover:text-primary-container transition-colors mt-2"
                    >
                      Sembunyikan Cerita
                      <span className="material-symbols-outlined text-xl">expand_less</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PETA ADMINISTRASI (LOKASI) */}
      <section className="py-xl">
        <div className="max-w-[1600px] mx-auto px-gutter">
          <div className="bg-surface-container-lowest rounded-3xl p-lg md:p-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-center gap-xl">
            {/* Right: Text and Download Button */}
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-xs block">
                Pemetaan Wilayah
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-md">
                Peta Administrasi Tingkir Tengah
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl mb-lg mx-auto md:mx-0">
                Bendungan Si Pleret didukung oleh berbagai potensi lokal, mulai dari sektor perikanan, UMKM, hingga pariwisata.
                Pelajari lebih detail batas wilayah dan pembagian area ekowisata kami melalui peta administrasi berikut.
              </p>

              <a
                href="/data/Tingkir-Tengah-ADM.pdf"
                download="Peta_Administrasi_Tingkir_Tengah.pdf"
                className="inline-flex items-center justify-center gap-sm bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[24px]">download</span>
                Unduh Peta Skala Penuh
              </a>
            </div>

            {/* Left: PDF Preview */}
            <div className="w-full md:w-5/12 flex-shrink-0 order-1 md:order-2">
              <div className="aspect-[4/3] bg-surface-container rounded-2xl overflow-hidden border border-outline-variant relative group shadow-md p-2">
                <iframe
                  src="/data/tingkir-tengah-ADM.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
                  className="w-full h-full border border-outline-variant/30 pointer-events-none rounded-xl bg-white"
                  title="Preview Peta Administrasi"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. JEJAK LANGKAH KKN (KONTRIBUSI TIM) */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-gutter">
          <div className="text-center mb-xl">
            <span className="text-tertiary font-bold tracking-widest uppercase text-sm mb-xs block">
              Pengabdian Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-sm">
              Jejak Langkah KKN-T 96 Undip
            </h2>
            <p className="mt-md text-on-surface-variant max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-center">
              Website ini dan pengembangan ekowisata Bendungan Si Pleret merupakan wujud nyata dedikasi Tim KKN-T 96 Universitas Diponegoro. 
              Setiap senyum warga, peluh di lapangan, dan kebersamaan yang terjalin adalah kenangan abadi yang kami rekam dalam jejak ini.
            </p>
          </div>

          {/* Kolase Foto Polaroid (Scrapbook Style - Referensi Poster) */}
          <div className="relative flex flex-col md:block items-center gap-8 md:gap-0 mt-16 mb-8 h-auto md:h-[700px] w-full max-w-[1200px] mx-auto overflow-hidden md:overflow-visible">
            
            {/* Background Dekoratif Tengah (Logo Terlihat Jelas) */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-0">
              <div className="relative w-[300px] md:w-[450px] lg:w-[500px] aspect-square drop-shadow-2xl">
                <Image 
                  src="/images/logo-warna.png" 
                  alt="Logo Tingkir Tengah" 
                  fill 
                  className="object-contain" 
                />
              </div>
            </div>

            {/* Foto 1 (Kiri Atas) */}
            <div className="md:absolute md:left-[5%] md:top-[5%] w-[260px] md:w-[280px] bg-white p-3 rounded-sm shadow-xl -rotate-6 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-500 cursor-pointer group z-10">
              <div className="relative w-full aspect-square bg-gray-200">
                <Image src="/images/foto1-pleret.jpg" alt="KKN Foto" fill className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>

            {/* Foto 2 (Kanan Atas) */}
            <div className="md:absolute md:right-[5%] md:top-[8%] w-[260px] md:w-[280px] bg-white p-3 rounded-sm shadow-xl rotate-3 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-500 cursor-pointer group z-10">
              <div className="relative w-full aspect-square bg-gray-200">
                <Image src="/images/foto1-sosmas.jpg" alt="KKN Foto" fill className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>

            {/* Foto 3 (Kiri Tengah) */}
            <div className="md:absolute md:left-[0%] md:top-[45%] w-[260px] md:w-[280px] bg-white p-3 rounded-sm shadow-xl rotate-6 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-500 cursor-pointer group z-10">
              <div className="relative w-full aspect-square bg-gray-200">
                <Image src="/images/foto3-ekowis.jpeg" alt="KKN Foto" fill className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>

            {/* Foto 4 (Kanan Tengah) */}
            <div className="md:absolute md:right-[0%] md:top-[50%] w-[260px] md:w-[280px] bg-white p-3 rounded-sm shadow-xl -rotate-3 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-500 cursor-pointer group z-10">
              <div className="relative w-full aspect-square bg-gray-200">
                <Image src="/images/foto2-ekowis.jpeg" alt="KKN Foto" fill className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>

            {/* Foto 5 (Kiri Bawah) */}
            <div className="md:absolute md:left-[20%] md:bottom-[5%] w-[260px] md:w-[280px] bg-white p-3 rounded-sm shadow-xl -rotate-6 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-500 cursor-pointer group z-20">
              <div className="relative w-full aspect-square bg-gray-200">
                <Image src="/images/foto1-ekowis.jpeg" alt="KKN Foto" fill className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>

            {/* Foto 6 (Kanan Bawah) */}
            <div className="md:absolute md:right-[20%] md:bottom-[10%] w-[260px] md:w-[350px] bg-white p-3 rounded-sm shadow-xl rotate-6 hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-500 cursor-pointer group z-20">
              <div className="relative w-full aspect-[4/3] bg-gray-200">
                <Image src="/images/foto1-sosmas.jpg" alt="KKN Foto" fill className="object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 object-right"  />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5. KUTIPAN INSPIRATIF (PENUTUP) */}
      <section className="py-xl">
        <div className="max-w-[1200px] mx-auto px-gutter">
          <div className="bg-primary rounded-3xl p-xl md:p-[64px] text-on-primary relative overflow-hidden shadow-xl">
            <div className="absolute -top-10 -left-6 text-[200px] leading-none opacity-20 font-serif font-black">&ldquo;</div>
            <blockquote className="relative z-10">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug italic max-w-4xl">
                &ldquo;Tingkir Tengah bukan sekadar tempat kami tinggal; ini
                adalah warisan yang harus kami jaga. Kami tidak mewarisi alam ini dari
                leluhur, melainkan meminjamnya dari anak cucu kami kelak.&rdquo;
              </p>
              <footer className="mt-xl flex items-center gap-md">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 relative">
                  <Image src="/images/paksolichin.jpeg" alt="Pak Solichin" fill className="object-cover" />
                </div>
                <div>
                  <cite className="not-italic font-bold text-xl block">Bapak Solichin</cite>
                  <span className="text-sm text-primary-container/80 font-medium">
                    Ketua Kelompok Pembudidaya Ikan (Pokdakan)
                  </span>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    </>
  )
}
