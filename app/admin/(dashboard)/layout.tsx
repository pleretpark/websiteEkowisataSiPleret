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
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/admin/login')
    }
    userEmail = user.email || userEmail
  }

  return (
    <AdminSidebar userEmail={userEmail}>
      {children}
    </AdminSidebar>
  )
}
