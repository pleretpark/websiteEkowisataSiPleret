'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/umkm', label: 'UMKM' },
  { href: '/peta-wisata', label: 'Peta Wisata' },
  { href: '/tentang', label: 'Tentang' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-primary font-bold tracking-tight text-lg md:text-2xl hover:text-primary-container transition-colors"
        >
          Ekowisata Tingkir Tengah
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors duration-300 text-base ${
                pathname === link.href
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-xs px-sm rounded-xl transition-colors text-base ${
                  pathname === link.href
                    ? 'text-primary font-bold bg-primary-fixed/20'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                {link.label}
              </Link>
            ))}
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
