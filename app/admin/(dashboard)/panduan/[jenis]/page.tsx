export default async function PanduanPage({ params }: { params: Promise<{ jenis: string }> }) {
  const { jenis } = await params;
  
  let title = "Panduan Penggunaan"
  let pdfSrc = "/data/buku-panduan-cth.pdf"
  
  if (jenis === 'website') {
    title = "Buku Panduan Website"
    pdfSrc = "/data/panduan-website.pdf"
  }
  if (jenis === 'instagram') {
    title = "Buku Panduan Instagram"
  }
  if (jenis === 'tiktok') {
    title = "Buku Panduan Tiktok"
  }
  if (jenis === 'saran') {
    title = "Buku Panduan Kotak Saran"
    pdfSrc = "/data/panduan-kotaksaran.pdf"
  }

  return (
    <div className="flex flex-col h-full h-[calc(100vh-64px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Pratinjau dokumen panduan. Anda dapat mengunduhnya menggunakan tombol di dalam viewer.
        </p>
      </div>

      <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm relative w-full min-h-[600px]">
        <iframe
          src={pdfSrc}
          className="w-full h-full border-none"
          title={title}
        />
      </div>
    </div>
  )
}
