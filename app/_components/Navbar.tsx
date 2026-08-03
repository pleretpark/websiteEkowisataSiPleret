'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/umkm', label: 'UMKM' },
  {
    label: 'Lokasi & Ikan',
    subLinks: [
      { href: '/peta-wisata', label: 'Peta Lokasi' },
      { href: '/detail-ikan', label: 'Detail Ikan' },
    ],
  },
  { href: '/berita', label: 'Berita' },
  { href: '/tentang', label: 'Tentang' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 backdrop-blur-xl shadow-ambient py-2'
          : 'bg-surface/80 backdrop-blur-xl shadow-lg py-4'
      } border-b border-white/20`}
    >
      <div className="flex justify-between items-center px-gutter max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-xs text-primary font-bold tracking-tight text-lg md:text-2xl hover:text-primary-container transition-colors"
        >
          <Image
            src="/images/logo-prelet.png"
            alt="Logo Ekowisata"
            width={36}
            height={36}
            className="rounded-full"
          />
          Ekowisata Tingkir Tengah
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-lg">
          {navLinks.map((link) => {
            if (link.subLinks) {
              const isActive = link.subLinks.some((sub) => pathname === sub.href)
              return (
                <div key={link.label} className="relative group">
                  <button
                    className={`font-medium transition-all duration-300 text-base pb-1 border-b-2 flex items-center gap-1 ${
                      isActive
                        ? 'text-primary font-bold border-primary'
                        : 'text-on-surface-variant hover:text-primary border-transparent'
                    }`}
                  >
                    {link.label}
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-ambient-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block px-4 py-3 text-sm transition-colors ${
                          pathname === sub.href
                            ? 'bg-primary-fixed/20 text-primary font-bold'
                            : 'text-on-surface hover:bg-surface-container hover:text-primary'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            const isActive = pathname === link.href
            return (
              <Link
                key={link.href!}
                href={link.href!}
                className={`font-medium transition-all duration-300 text-base pb-1 border-b-2 ${
                  isActive
                    ? 'text-primary font-bold border-primary'
                    : 'text-on-surface-variant hover:text-primary border-transparent'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-sm">
          <Link
            href="/admin/login"
            className="hidden md:inline-flex bg-primary text-on-primary text-sm font-medium px-md py-xs rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Portal Admin
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-on-surface">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-outline-variant shadow-ambient-lg animate-fade-in-up">
          <div className="flex flex-col px-gutter py-md gap-sm">
            {navLinks.map((link) => {
              if (link.subLinks) {
                const isActive = link.subLinks.some((sub) => pathname === sub.href)
                const isExpanded = activeDropdown === link.label
                return (
                  <div key={link.label} className="flex flex-col">
                    <button
                      onClick={() => setActiveDropdown(isExpanded ? null : link.label)}
                      className={`py-xs px-sm rounded-xl transition-colors text-base flex justify-between items-center ${
                        isActive
                          ? 'text-primary font-bold'
                          : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                      }`}
                    >
                      {link.label}
                      <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="flex flex-col pl-md mt-xs gap-xs border-l-2 border-outline-variant/30 ml-sm">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={`py-1 px-sm rounded-lg text-sm ${
                              pathname === sub.href
                                ? 'text-primary font-bold bg-primary-fixed/20'
                                : 'text-on-surface-variant hover:text-primary'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={link.href!}
                  href={link.href!}
                  onClick={() => setMobileOpen(false)}
                  className={`py-xs px-sm rounded-xl transition-colors text-base ${
                    pathname === link.href
                      ? 'text-primary font-bold bg-primary-fixed/20'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="mt-xs bg-primary text-on-primary text-sm font-medium px-md py-xs rounded-full text-center hover:shadow-xl transition-all"
            >
              Portal Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
