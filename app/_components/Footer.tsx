import Link from 'next/link'
import Image from 'next/image'
import VisitorStats from './VisitorStats'

export default function Footer() {
  return (
    <footer className="w-full py-lg bg-surface-container-highest mt-xl">
      <div className="w-full max-w-[1600px] mx-auto px-gutter md:px-lg lg:px-[60px]">
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

          {/* Lokasi */}
          <div>
            <h5 className="text-sm font-bold tracking-widest uppercase text-primary mb-sm">
              Lokasi
            </h5>
            <div className="flex flex-col gap-xs">
              <div className="flex items-start gap-xs text-sm text-on-surface-variant font-medium mb-1">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 font-medium">location_on</span>
                <span>Jl. Raya Tingkir No. 12, Salatiga, Jawa Tengah, 50742</span>
              </div>
              <div className="w-full h-32 rounded-xl overflow-hidden shadow-sm border border-outline-variant">
                <iframe
                  src="https://maps.google.com/maps?q=Tingkir%20Tengah,%20Salatiga&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Tingkir Tengah"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h5 className="text-sm font-bold tracking-widest uppercase text-primary mb-sm">
              Hubungi Kami
            </h5>
            <div className="flex flex-col gap-xs text-sm text-on-surface-variant font-medium">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                <span>+62 812-3456-7890</span>
              </div>
              <a href="mailto:pleretpark@gmail.com" className="flex items-center gap-xs hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                <span>pleretpark@gmail.com</span>
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

          {/* Visitor Stats & Feedback */}
          <div className="flex flex-col gap-md">
            <VisitorStats />
            
            {/* Kritik dan Saran */}
            <div>
              <h5 className="text-sm font-bold tracking-widest uppercase text-primary mb-sm">
                Masukan Anda
              </h5>
              <div className="flex items-start gap-sm">
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed flex-1">
                  Bantu kami menjadi lebih baik dengan memberikan kritik dan saran Anda.
                </p>
                <a 
                  href="https://forms.gle/42ZqGKPMdzfHiYgeA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Tulis Kritik & Saran"
                  className="flex-shrink-0 inline-flex items-center justify-center bg-primary text-on-primary w-10 h-10 rounded-xl hover:shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">rate_review</span>
                </a>
              </div>
            </div>
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
