import Link from 'next/link'
import Image from 'next/image'
import VisitorStats from './VisitorStats'

export default function Footer() {
  return (
    <footer className="w-full py-lg bg-surface-container-highest mt-xl">
      <div className="w-full max-w-[1440px] mx-auto px-gutter md:px-lg lg:px-[60px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md">
          {/* Brand & Description */}
          <div>
            <div className="flex items-center gap-xs mb-sm">
              <Image
                src="/images/logo-prelet.png"
                alt="Logo Ekowisata"
                width={36}
                height={36}
                className="rounded-full"
              />
              <h4 className="text-xl text-primary font-bold">
                Ekowisata Tingkir Tengah
              </h4>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed pr-md">
              Mewujudkan kemandirian ekonomi desa melalui potensi akuakultur dan wisata berbasis kearifan lokal. Inisiatif berbasis komunitas untuk pariwisata berkelanjutan dan pemberdayaan ekonomi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold tracking-widest uppercase text-primary mb-sm">
              Tautan Cepat
            </h5>
            <div className="flex flex-col gap-xs">
              <Link href="/" className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium">
                Beranda
              </Link>
              <Link href="/umkm" className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium">
                Katalog UMKM
              </Link>
              <Link href="/peta-wisata" className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium">
                Peta Wisata
              </Link>
              <Link href="/berita" className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium">
                Berita & Kabar
              </Link>
              <Link href="/tentang" className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium">
                Tentang Kami
              </Link>
            </div>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h5 className="text-sm font-bold tracking-widest uppercase text-primary mb-sm">
              Hubungi Kami
            </h5>
            <div className="flex flex-col gap-xs text-sm text-on-surface-variant font-medium">
              <div className="flex items-start gap-xs">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">location_on</span>
                <span>Jl. Raya Tingkir No. 12, Salatiga, Jawa Tengah, 50742</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                <span>+62 812-3456-7890</span>
              </div>
              <a href="mailto:halo@tingkirtengah.desa.id" className="flex items-center gap-xs hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                <span>halo@tingkirtengah.desa.id</span>
              </a>
              <a
                href="https://www.instagram.com/si_pleret/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-xs hover:text-primary transition-colors"
              >
                <svg className="w-[18px] h-[18px] text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <span>@si_pleret</span>
              </a>
            </div>
          </div>

          {/* Visitor Stats */}
          <div>
            <VisitorStats />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-lg pt-md border-t border-outline-variant text-center flex flex-col sm:flex-row justify-between items-center gap-sm">
          <p className="text-on-surface-variant text-sm font-medium">
            © {new Date().getFullYear()} KKN-T 96 Ekowisata Tingkir Tengah. Empowering Local Wisdom.
          </p>
          <div className="flex gap-md text-sm font-medium text-on-surface-variant">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
