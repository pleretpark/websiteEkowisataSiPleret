import Navbar from '@/app/_components/Navbar'
import Footer from '@/app/_components/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="pt-xl flex-1">{children}</main>
      <Footer />
    </>
  )
}
