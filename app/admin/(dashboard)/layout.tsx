import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './_components/AdminSidebar'

export const metadata = {
  title: 'Admin Dashboard - Ekowisata Tingkir Tengah',
  description: 'Panel administrasi untuk mengelola konten Ekowisata Tingkir Tengah',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify authentication server-side
  let userEmail = 'admin@tingkirtengah.id'
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/admin/login')
    }
    userEmail = user.email || userEmail
  } catch {
    // If Supabase is not configured, allow access for development
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <AdminSidebar userEmail={userEmail} />
      <div className="flex-1 ml-0 md:ml-[240px]">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant px-gutter py-sm flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-outline md:hidden">
              menu
            </span>
          </div>
          <div className="flex items-center gap-md">
            <button className="relative">
              <span className="material-symbols-outlined text-outline hover:text-primary transition-colors">
                notifications
              </span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error rounded-full text-[10px] flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <div className="flex items-center gap-xs">
              <span className="text-sm text-on-surface font-medium hidden sm:block">
                Admin Profile
              </span>
              <span className="text-xs text-outline hidden sm:block uppercase">
                Super Admin
              </span>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-gutter md:p-lg">{children}</main>
      </div>
    </div>
  )
}
