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
    icon: 'groups',
    title: '50k+ Pengunjung',
    description: 'Menjadi tuan rumah wisatawan dari lebih dari 20 negara, memupuk pertukaran budaya.',
    color: 'bg-tertiary-fixed/20 text-tertiary',
  },
]

export default function TentangPage() {
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="px-gutter max-w-[1000px] mx-auto pt-lg pb-xl mt-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight tracking-tight mt-xs mb-sm">
          Tentang <span className="text-[#003d37] italic font-medium">Tingkir Tengah</span>
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
          Terletak di jantung Salatiga, Tingkir Tengah lebih dari sekadar destinasi. Ini adalah bukti hidup bagaimana kearifan lokal dan pariwisata berkelanjutan bisa berdansa harmonis.
        </p>
        <div className="flex flex-wrap justify-center gap-sm mt-lg">
          <a
            href="#story"
            className="bg-primary text-on-primary font-bold px-xl py-sm rounded-full hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            Temukan Kisah Kami
          </a>
          <a
            href="#pillars"
            className="border-2 border-primary text-primary font-bold px-xl py-sm rounded-full hover:bg-primary hover:text-on-primary transition-all"
          >
            Kenali Warga Lokal
          </a>
        </div>
      </header>

      {/* Video Profil */}
      <section className="px-gutter max-w-[900px] mx-auto mb-xl">
        <div className="text-center mb-md">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
            Video Profil Ekowisata Tingkir Tengah
          </h2>
          <p className="text-on-surface-variant mt-2">
            Dipersembahkan oleh Tim KKN-T 96 Universitas Diponegoro
          </p>
        </div>
        <div className="relative z-10 rounded-3xl overflow-hidden shadow-ambient-lg aspect-video bg-surface-container-low border border-outline-variant">
          {/* Ganti URL src di bawah dengan link YouTube yang asli jika sudah selesai */}
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Video Profil Ekowisata Tingkir Tengah"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Kisah Jaka Tingkir */}
      <section id="story" className="py-xl bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-gutter">
          <div className="text-center mb-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-sm">
              Kisah Tingkir Tengah
            </h2>
            <h3 className="text-xl md:text-2xl text-primary font-medium max-w-3xl mx-auto leading-relaxed">
              Perjalanan Jaka Tingkir Menuju Demak dan Asal Usul Bendungan Si Pleret
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
            {/* Gambar Jaka Tingkir (Kiri) */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-28 rounded-3xl overflow-hidden shadow-ambient-lg aspect-[3/4] bg-surface-container border border-outline-variant">
                <Image
                  src="/images/jakatingkir.png"
                  alt="Ilustrasi Jaka Tingkir"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Teks - 3 Paragraf Awal (Kanan) */}
            <div className="lg:col-span-7 space-y-md text-on-surface-variant text-base md:text-lg leading-relaxed text-justify">
              <p>Pada abad ke-16, ketika Kesultanan Demak menjadi pusat pemerintahan dan penyebaran Islam di Pulau Jawa, hiduplah seorang pemuda bernama Mas Karebet yang kelak lebih dikenal sebagai Jaka Tingkir. Ia berasal dari daerah Tingkir, yang kini menjadi bagian dari Kota Salatiga, Jawa Tengah. Sejak kecil, Jaka Tingkir dikenal sebagai pribadi yang pemberani, bijaksana, serta memiliki kemampuan bela diri yang luar biasa.</p>
              <p>Dikisahkan bahwa pada suatu waktu Jaka Tingkir memutuskan melakukan perjalanan menuju Keraton Demak untuk mengabdikan dirinya kepada Sultan Trenggana. Perjalanan itu tidaklah mudah. Ia harus melewati hutan lebat, perbukitan, sungai, dan berbagai daerah yang saat itu masih berupa pedukuhan kecil.</p>
              <p>Ketika melintasi wilayah yang sekarang dikenal sebagai Dusun Payaman, Kelurahan Tingkir Tengah, Kecamatan Tingkir, Kota Salatiga, Jaka Tingkir menjumpai sebuah aliran sungai yang cukup deras. Masyarakat setempat kesulitan memanfaatkan air sungai tersebut karena saat musim hujan sering meluap, sedangkan saat kemarau debit air berkurang sehingga sawah mengalami kekeringan.</p>
            </div>
          </div>

          {/* Kelanjutan Cerita */}
          <div className="mt-xl">
            {!showFullStory ? (
              <div className="text-center">
                <button
                  onClick={() => setShowFullStory(true)}
                  className="inline-flex items-center gap-xs bg-primary text-on-primary font-bold px-8 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all"
                >
                  Baca Kelanjutan Cerita
                  <span className="material-symbols-outlined text-xl">expand_more</span>
                </button>
              </div>
            ) : (
              <div className="space-y-md text-on-surface-variant text-base md:text-lg leading-relaxed text-justify animate-in fade-in slide-in-from-top-4 duration-700">
                <p>Melihat keadaan tersebut, Jaka Tingkir merasa iba. Sebelum melanjutkan perjalanan menuju Demak, ia membantu masyarakat mencari cara agar air sungai dapat dimanfaatkan dengan lebih baik. Konon, dengan kekuatan dan kecerdasannya, ia menyusun batu-batu besar serta membentuk sebuah bendung sederhana untuk mengatur aliran air menuju lahan pertanian.</p>
                <p>Bendung tersebut dipercaya menjadi cikal bakal Bendungan Si Pleret. Nama &quot;Pleret&quot; menurut cerita masyarakat berasal dari suara gemuruh air yang mengalir deras ketika melewati susunan batu bendungan, berbunyi &quot;pleret... pleret...&quot;, sehingga tempat itu kemudian dikenal dengan nama Pleret.</p>
                <p>Setelah membantu masyarakat, Jaka Tingkir melanjutkan perjalanan menuju Demak. Berkat kemampuan, keberanian, dan kesetiaannya, ia berhasil mendapatkan kepercayaan Sultan Trenggana. Di kemudian hari, Jaka Tingkir diangkat menjadi Sultan Pajang dan dikenang sebagai salah satu tokoh penting dalam sejarah Jawa.</p>
                <p>Bagi masyarakat Dusun Payaman, kisah perjalanan Jaka Tingkir bukan sekadar cerita masa lalu. Bendungan Si Pleret menjadi simbol kepedulian terhadap sesama, semangat gotong royong, serta pentingnya menjaga sumber daya air bagi kehidupan masyarakat. Hingga kini, bendungan tersebut masih menjadi bagian dari identitas lokal dan terus dikenang sebagai warisan budaya yang menghubungkan sejarah, legenda, dan kehidupan masyarakat Tingkir Tengah.</p>

                <div className="pt-md text-center">
                  <button
                    onClick={() => setShowFullStory(false)}
                    className="inline-flex items-center gap-xs text-primary font-bold hover:text-primary-container transition-colors"
                  >
                    Sembunyikan Cerita
                    <span className="material-symbols-outlined text-xl">expand_less</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Peta Administrasi */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-[1600px] mx-auto px-gutter">
          <div className="bg-surface-container-lowest rounded-3xl p-lg md:p-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-center gap-xl">
            {/* Left: PDF Preview */}
            <div className="w-full md:w-5/12 flex-shrink-0">
              <div className="aspect-[4/3] bg-white rounded-md overflow-hidden border border-outline-variant relative group shadow-md p-1">
                <iframe
                  src="/data/tingkir-tengah-ADM.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
                  className="w-full h-full border border-outline-variant/30 pointer-events-none rounded-sm"
                  title="Preview Peta Administrasi"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors pointer-events-none rounded-md" />
              </div>
            </div>

            {/* Right: Text and Download Button */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-md">
                Peta Administrasi Kelurahan Tingkir Tengah
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl mb-lg mx-auto md:mx-0">
                Bendungan Si Pleret didukung oleh berbagai potensi lokal, mulai dari sektor perikanan, UMKM, hingga wisata berbasis masyarakat.
                Untuk memberikan gambaran yang lebih jelas, berikut peta administrasi Kelurahan Tingkir Tengah yang menunjukkan batas wilayah sebagai
                bagian dari profile wilayah Ekowisata.
              </p>

              <a
                href="/data/tingkir-tengah-ADM.pdf"
                download="Peta_Administrasi_Tingkir_Tengah.pdf"
                className="inline-flex items-center justify-center gap-sm bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[24px]">download</span>
                Unduh Peta (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-xl">
        <div className="max-w-[1600px] mx-auto px-gutter">
          <div className="bg-primary rounded-3xl p-xl md:p-[64px] text-on-primary relative overflow-hidden">
            <div className="absolute top-8 left-8 text-8xl opacity-20 font-bold">&ldquo;</div>
            <blockquote className="relative z-10">
              <p className="text-2xl md:text-4xl font-bold leading-tight italic">
                &ldquo;Tingkir Tengah bukan sekadar tempat kami tinggal; ini
                adalah warisan yang kami jaga. Kami tidak mewarisi bumi dari
                leluhur, kami meminjamnya dari anak cucu kami.&rdquo;
              </p>
              <footer className="mt-lg flex items-center gap-md">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
                <div>
                  <cite className="not-italic font-bold text-lg">Pak Solichin</cite>
                  <p className="text-sm text-on-primary/80">
                    Ketua Pokdakan &amp; Humas Pokdarwis
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    </>
  )
}
