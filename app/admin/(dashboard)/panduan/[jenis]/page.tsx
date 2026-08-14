export default async function PanduanPage({ params }: { params: Promise<{ jenis: string }> }) {
  const { jenis } = await params;
  
  let title = "Panduan Penggunaan"
  let pdfSrc = "/data/buku-panduan-cth.pdf"
  
  if (jenis === 'website') {
    title = "Buku Panduan Website"
    pdfSrc = "/data/panduan-website.pdf"
  }
  if (jenis === 'sosial-media') {
    title = "Buku Panduan Sosial Media"
    pdfSrc = "/data/panduan-sosmed.pdf"
  }
  if (jenis === 'saran') {
    title = "Buku Panduan Kotak Saran"
    pdfSrc = "/data/panduan-kotaksaran.pdf"
  }

  return (
    <div className="flex flex-col h-full h-[calc(100vh-64px)]">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Pratinjau dokumen panduan. Jika dokumen tidak terbuka di HP, silakan gunakan tombol di samping.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={pdfSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
            Buka di Tab Baru
          </a>
          <a
            href={pdfSrc}
            download
            className="inline-flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-medium hover:bg-surface-container-highest transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Unduh
          </a>
        </div>
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
