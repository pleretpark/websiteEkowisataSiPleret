import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-xl bg-surface-container-highest mt-xl">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {/* Brand */}
          <div>
            <h4 className="text-2xl text-primary font-bold">
              Ekowisata Tingkir Tengah
            </h4>
            <p className="text-on-surface-variant text-base mt-xs leading-relaxed">
              Jl. Raya Tingkir No. 12, Tingkir Tengah, Salatiga, Jawa Tengah.
              <br />
              Inisiatif berbasis komunitas untuk pariwisata berkelanjutan dan pemberdayaan ekonomi.
            </p>
            <div className="flex gap-sm mt-md">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-variant hover:bg-primary hover:text-on-primary transition-all"
                aria-label="Website"
              >
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-variant hover:bg-primary hover:text-on-primary transition-all"
                aria-label="Email"
              >
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold tracking-widest uppercase text-primary mb-md">
              Tautan Cepat
            </h5>
            <div className="flex flex-col gap-xs">
              <Link href="/" className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-all text-base">
                Beranda
              </Link>
              <Link href="/umkm" className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-all text-base">
                Katalog UMKM
              </Link>
              <Link href="/peta-wisata" className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-all text-base">
                Peta Wisata
              </Link>
              <Link href="/tentang" className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-all text-base">
                Tentang Kami
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h5 className="text-sm font-bold tracking-widest uppercase text-primary mb-md">
              Jelajahi
            </h5>
            <div className="flex flex-col gap-xs">
              <a href="#" className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-all text-base">
                Wisata Desa
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-all text-base">
                Mitra UMKM
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary hover:underline decoration-primary transition-all text-base">
                Keberlanjutan
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-xl pt-md border-t border-outline-variant text-center">
          <p className="text-on-surface-variant text-sm">
            © {new Date().getFullYear()} Ekowisata Tingkir Tengah. Empowering Local Wisdom.
          </p>
        </div>
      </div>
    </footer>
  )
}
