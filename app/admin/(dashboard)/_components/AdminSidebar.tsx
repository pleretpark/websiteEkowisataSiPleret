'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const menuItems = [
  { href: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/umkm', icon: 'storefront', label: 'Manajemen UMKM' },
  { href: '/admin/spot-wisata', icon: 'eco', label: 'Spot Wisata' },
  { href: '/admin/ikan', icon: 'phishing', label: 'Detail Ikan' },
  { href: '/admin/berita', icon: 'newspaper', label: 'Berita & Artikel' },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-outline-variant z-50 hidden md:flex flex-col">
      {/* Brand */}
      <div className="p-gutter border-b border-outline-variant">
        <h2 className="text-2xl font-bold text-primary">Admin Portal</h2>
        <p className="text-lg text-on-surface-variant">Tingkir Tengah</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-md px-sm space-y-xs overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
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
        <Link
          href="/"
          className="flex items-center gap-sm px-md py-xs rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-all text-lg"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Lihat Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-sm px-md py-xs rounded-xl text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all text-lg"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Logout
        </button>
        <div className="px-md py-xs">
          <p className="text-base text-outline truncate">{userEmail}</p>
        </div>
      </div>
    </aside>
  )
}
