export default function PanduanPage({ params }: { params: { jenis: string } }) {
  let title = "Panduan Penggunaan"
  
  if (params.jenis === 'website') title = "Buku Panduan Website"
  if (params.jenis === 'instagram') title = "Buku Panduan Instagram"
  if (params.jenis === 'tiktok') title = "Buku Panduan Tiktok"
  if (params.jenis === 'saran') title = "Buku Panduan Kotak Saran"

  return (
    <div className="flex flex-col h-full h-[calc(100vh-64px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Pratinjau dokumen panduan. Anda dapat mengunduhnya menggunakan tombol di dalam viewer.
        </p>
      </div>

      <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm relative w-full min-h-[600px]">
        {/* Placeholder file buku-panduan-cth.pdf */}
        <iframe
          src="/data/buku-panduan-cth.pdf"
          className="w-full h-full border-none"
          title={title}
        />
      </div>
    </div>
  )
}
