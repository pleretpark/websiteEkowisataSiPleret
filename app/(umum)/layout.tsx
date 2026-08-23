import Navbar from '@/app/_components/Navbar'
import Footer from '@/app/_components/Footer'
import VisitorTracker from '@/app/_components/VisitorTracker'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <VisitorTracker />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
