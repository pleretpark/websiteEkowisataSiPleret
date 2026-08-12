'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

type MenuItem = {
  href?: string
  icon: string
  label: string
  children?: { href: string; label: string }[]
}

export const menuItems: MenuItem[] = [
  { href: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/umkm', icon: 'storefront', label: 'Manajemen UMKM' },
  { href: '/admin/spot-wisata', icon: 'eco', label: 'Peta Lokasi' },
  { href: '/admin/ikan', icon: 'phishing', label: 'Data Ikan' },
  { href: '/admin/berita', icon: 'newspaper', label: 'Kabar Desa' },
  {
    icon: 'menu_book',
    label: 'Panduan',
    children: [
      { href: '/admin/panduan/website', label: 'Website' },
      // { href: '/admin/panduan/instagram', label: 'Instagram' },
      // { href: '/admin/panduan/tiktok', label: 'Tiktok' },
      { href: '/admin/panduan/saran', label: 'Kotak Saran' },
    ]
  }
]

export default function AdminSidebar({
  children,
  userEmail,
}: {
  children: React.ReactNode
  userEmail: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>('Panduan Penggunaan')
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-surface flex w-full">
      {/* Sidebar for Desktop */}
      <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-outline-variant z-50 hidden md:flex flex-col">
        {/* Brand */}
        <div className="p-gutter border-b border-outline-variant">
          <h2 className="text-2xl font-bold text-primary">Admin Portal</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-md px-sm space-y-xs overflow-y-auto">
          {menuItems.map((item) => {
            if (item.children) {
              const isOpen = openDropdown === item.label
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    className="w-full flex items-center justify-between px-md py-xs rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200"
                  >
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span className="text-lg">{item.label}</span>
                    </div>
                    <span className={`material-symbols-outlined text-[20px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pl-12 pr-sm space-y-1 mt-1">
                      {item.children.map(child => {
                        const isChildActive = pathname === child.href
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block py-2 px-3 rounded-lg text-base transition-colors ${
                              isChildActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                            }`}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const isActive = pathname === item.href ||
              (item.href && item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex items-center gap-sm px-md py-xs rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-md font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="text-lg">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-sm border-t border-outline-variant space-y-xs">
          <div className="px-md py-xs">
            <p className="text-base text-outline truncate">{userEmail}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 ml-0 md:ml-[240px] flex flex-col min-h-screen">
        {/* Top Bar / Navigation Header */}
        <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant px-gutter py-sm flex items-center justify-between">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-sm">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-on-surface">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Logo visible only on mobile top-bar */}
            <Link
              href="/admin"
              className="flex md:hidden items-center gap-xs text-primary font-bold tracking-tight text-lg hover:text-primary-container transition-colors"
            >
              <Image
                src="/images/logo-pleret.png"
                alt="Logo Ekowisata"
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="font-semibold text-primary">Admin Portal</span>
            </Link>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-sm md:gap-md">
            <div className="flex items-center gap-xs">
              <span className="text-base md:text-lg text-on-surface font-medium hidden sm:block">
                Super Admin
              </span>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div>
            </div>
            
            {/* Logout Button in Header */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-9 h-9 md:w-auto md:h-auto md:px-sm md:py-xs rounded-full md:rounded-lg text-error bg-error/10 hover:bg-error hover:text-on-error transition-all"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="hidden md:block font-medium ml-1">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-outline-variant shadow-ambient-lg animate-fade-in-up">
              <div className="flex flex-col px-gutter py-md gap-sm">
                {menuItems.map((item) => {
                  if (item.children) {
                    const isOpen = openDropdown === item.label
                    return (
                      <div key={item.label} className="flex flex-col gap-1">
                        <button
                          onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                          className="flex items-center justify-between py-xs px-sm rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container font-medium text-base transition-colors"
                        >
                          <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            {item.label}
                          </div>
                          <span className={`material-symbols-outlined text-[20px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </button>
                        {isOpen && (
                          <div className="flex flex-col pl-10 pr-sm gap-1 mt-1">
                            {item.children.map(child => {
                              const isChildActive = pathname === child.href
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                                    isChildActive
                                      ? 'bg-primary/10 text-primary font-semibold'
                                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  }

                  const isActive = pathname === item.href ||
                    (item.href && item.href !== '/admin' && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href!}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-sm py-xs px-sm rounded-xl transition-colors text-base font-medium ${
                        isActive
                          ? 'text-primary bg-primary-fixed/20'
                          : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  )
                })}

              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="p-gutter md:p-lg flex-1">{children}</main>
      </div>
    </div>
  )
}
