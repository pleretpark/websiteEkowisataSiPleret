'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Ikan } from '@/lib/types'

export default function DetailIkanPage() {
  const [fishes, setFishes] = useState<Ikan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIkan() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('ikan')
          .select('*, spot_wisata(*)')
          .order('nama_ikan', { ascending: true })

        if (!error && data) {
          setFishes(data)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchIkan()
  }, [])

  return (
    <>
      {/* Header */}
      <header className="px-gutter max-w-[1000px] mx-auto pt-lg pb-xl mt-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight tracking-tight mt-xs mb-sm">
          Ensiklopedia <span className="text-[#003d37] italic font-medium">Ikan</span>
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
          Kenali berbagai jenis ikan yang dibudidayakan dan dilestarikan di kawasan ekowisata Tingkir Tengah. Pelajari asal usul, kandungan gizi, dan fakta menariknya.
        </p>
      </header>

      <section className="px-gutter max-w-[1600px] mx-auto pb-xl">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-lg">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
                <div className="h-32 md:h-48 w-full animate-shimmer" />
                <div className="p-2 md:p-md flex flex-col items-center">
                  <div className="h-4 md:h-6 w-3/4 rounded animate-shimmer mt-2 mb-1" />
                  <div className="h-3 md:h-4 w-1/2 rounded animate-shimmer mb-4" />
                  <div className="h-8 md:h-10 w-full rounded-xl animate-shimmer mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : fishes.length === 0 ? (
          <div className="text-center py-xl bg-surface-container-low rounded-3xl">
            <span className="material-symbols-outlined text-6xl text-outline-variant">
              set_meal
            </span>
            <p className="text-on-surface-variant text-lg mt-md">
              Data ikan belum tersedia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-lg">
            {fishes.map((ikan, index) => (
              <div
                key={ikan.id}
                className="group bg-surface-container-lowest border border-outline-variant rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-ambient transition-all duration-500 flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-32 md:h-48 w-full bg-surface-container overflow-hidden">
                  <Image
                    src={ikan.gambar_url || '/images/ikan.jpg'}
                    alt={ikan.nama_ikan}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {ikan.spot_wisata && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-surface/90 backdrop-blur-md text-on-surface text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white/20">
                      <span className="material-symbols-outlined text-[12px] md:text-[14px] text-primary">location_on</span>
                      <span className="truncate max-w-[60px] md:max-w-[100px]">{ikan.spot_wisata.nama_lokasi}</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-2 md:p-md flex-1 flex flex-col items-center text-center">
                  <h2 className="text-sm md:text-xl font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1 md:line-clamp-none">
                    {ikan.nama_ikan}
                  </h2>
                  {ikan.nama_ilmiah && (
                    <p className="text-on-surface-variant italic font-serif text-[11px] md:text-sm mt-1 border-b border-outline pb-1 md:pb-2 inline-block line-clamp-1 md:line-clamp-none">
                      {ikan.nama_ilmiah}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-2 md:pt-md w-full">
                    <Link
                      href={`/detail-ikan/${ikan.id}`}
                      className="inline-block w-full bg-primary text-on-primary font-bold text-xs md:text-sm py-1.5 md:py-2 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shadow-sm"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
