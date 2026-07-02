import Image from 'next/image'

const timeline = [
  { year: '1990', event: 'Fondasi Pengrajin Lokal' },
  { year: '2015', event: 'Peluncuran Inisiatif Eko-Wisata' },
  { year: '2024', event: 'Pengakuan Global untuk UMKM' },
]

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
  return (
    <>
      {/* Hero */}
      <section className="mt-md px-gutter max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center py-xl">
          <div>
            <span className="inline-block bg-primary-fixed text-on-primary-fixed text-sm font-bold px-md py-1 rounded-full mb-md">
              🌿 Warisan Kami
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
              Menjaga Budaya,
              <br />
              Merawat Alam.
            </h1>
            <p className="text-on-surface-variant text-lg mt-md leading-relaxed max-w-md">
              Terletak di jantung Salatiga, Tingkir Tengah lebih dari sekadar
              destinasi. Ini adalah bukti hidup bagaimana kearifan lokal dan
              pariwisata berkelanjutan bisa berdansa harmonis.
            </p>
            <div className="flex flex-wrap gap-sm mt-lg">
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
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-ambient-lg">
              <Image
                src="/images/about-hero.png"
                alt="Desa Tingkir Tengah - pemandangan alam"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 z-20 bg-primary text-on-primary rounded-2xl px-md py-sm shadow-lg flex items-center gap-xs">
              <span className="material-symbols-outlined">verified</span>
              <div>
                <span className="font-bold text-lg">100%</span>
                <span className="text-sm ml-1 opacity-90">Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story + Vision */}
      <section id="story" className="py-xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Timeline */}
          <div>
            <h2 className="text-2xl font-bold text-on-surface mb-lg">
              Kisah Tingkir Tengah
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed mb-lg">
              Dari awal yang sederhana hingga menjadi mercusuar inovasi
              berkelanjutan, perjalanan kami didefinisikan oleh ketangguhan
              masyarakat kami.
            </p>
            <div className="space-y-sm">
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="flex items-center gap-md p-md bg-surface-container-lowest rounded-2xl border border-outline-variant hover:shadow-ambient transition-all"
                >
                  <span className="text-primary font-bold text-lg min-w-[60px]">
                    {item.year}
                  </span>
                  <span className="text-on-surface font-medium">{item.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div className="bg-primary rounded-3xl p-xl text-on-primary">
            <h2 className="text-2xl font-bold mb-md">Visi Kami</h2>
            <p className="text-on-primary/90 text-base leading-relaxed mb-lg">
              Kami membayangkan Ekowisata Tingkir Tengah sebagai model global
              untuk pariwisata berbasis komunitas di mana pelestarian lingkungan
              dan kemakmuran ekonomi tidak saling eksklusif. Kami berupaya
              memberdayakan setiap rumah tangga lokal, memastikan warisan kami
              bertahan untuk generasi mendatang.
            </p>
            <div className="grid grid-cols-2 gap-md">
              <div className="bg-white/10 rounded-2xl p-md backdrop-blur-sm">
                <span className="material-symbols-outlined text-2xl mb-xs block">
                  diversity_3
                </span>
                <h4 className="font-semibold mb-1">Kesetaraan Sosial</h4>
                <p className="text-sm text-on-primary/80">
                  Pembagian keuntungan langsung untuk lebih dari 50 keluarga lokal.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-md backdrop-blur-sm">
                <span className="material-symbols-outlined text-2xl mb-xs block">
                  recycling
                </span>
                <h4 className="font-semibold mb-1">Hidup Minim Limbah</h4>
                <p className="text-sm text-on-primary/80">
                  Menerapkan sistem kompos organik seluruh desa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community First */}
      <section className="py-xl">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div className="rounded-3xl overflow-hidden shadow-ambient-lg">
            <Image
              src="/images/community.png"
              alt="Komunitas Tingkir Tengah"
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </div>
          <div className="bg-secondary-fixed/20 rounded-3xl p-xl">
            <h3 className="text-2xl font-bold text-on-surface mb-md">
              Mengutamakan Komunitas
            </h3>
            <p className="text-on-surface-variant text-base leading-relaxed">
              90% staf dan pemandu wisata kami adalah penduduk Tingkir Tengah,
              yang terlatih untuk memberikan pengalaman autentik sambil
              melestarikan cara hidup mereka. Setiap kunjungan berkontribusi
              langsung pada ekonomi lokal dan pelestarian budaya.
            </p>
          </div>
        </div>
      </section>

      {/* How We Empower */}
      <section id="pillars" className="py-xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface">
              Bagaimana Kami Memberdayakan
            </h2>
            <p className="text-on-surface-variant text-lg mt-md max-w-2xl mx-auto">
              Komitmen kami terhadap lingkungan dan komunitas dibangun di atas
              empat pilar utama pertumbuhan berkelanjutan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-surface-container-lowest rounded-3xl p-xl border border-outline-variant hover:shadow-ambient-hover transition-all duration-500 group"
              >
                <span
                  className={`material-symbols-outlined text-4xl ${pillar.color} p-sm rounded-2xl inline-block mb-md`}
                >
                  {pillar.icon}
                </span>
                <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-on-surface-variant text-base mt-xs leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-xl">
        <div className="max-w-container-max mx-auto px-gutter">
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
                  <cite className="not-italic font-bold text-lg">Mbah Joyo</cite>
                  <p className="text-sm text-on-primary/80">
                    Tetua Desa &amp; Penjaga Budaya
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
