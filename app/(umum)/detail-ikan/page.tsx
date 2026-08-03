'use client'

import Image from 'next/image'
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
      <section className="mt-md px-gutter max-w-[1600px] mx-auto py-lg">
        <span className="inline-block bg-primary-fixed text-on-primary-fixed text-sm font-bold px-md py-1 rounded-full mb-md">
          Edukasi & Konservasi
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
          Ensiklopedia Ikan
          <br />
          Tingkir Tengah
        </h1>
        <p className="text-on-surface-variant text-lg mt-md max-w-[48rem] leading-relaxed">
          Kenali berbagai jenis ikan yang dibudidayakan dan dilestarikan di kawasan ekowisata Tingkir Tengah. Pelajari habitat, kandungan gizi, dan cara perawatannya.
        </p>
      </section>

      <section className="px-gutter max-w-[1600px] mx-auto pb-xl">
        {loading ? (
          <div className="flex flex-col gap-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-3xl p-md flex flex-col md:flex-row gap-lg">
                <div className="h-64 md:w-1/3 rounded-2xl animate-shimmer" />
                <div className="flex-1 space-y-sm py-sm">
                  <div className="h-8 w-1/3 rounded animate-shimmer" />
                  <div className="h-5 w-1/4 rounded animate-shimmer" />
                  <div className="h-24 w-full rounded animate-shimmer mt-md" />
                  <div className="h-12 w-2/3 rounded animate-shimmer mt-md" />
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
          <div className="flex flex-col gap-xl">
            {fishes.map((ikan, index) => (
              <div
                key={ikan.id}
                className="group bg-surface-container-lowest border border-outline-variant rounded-3xl overflow-hidden shadow-sm hover:shadow-ambient transition-all duration-500 flex flex-col md:flex-row animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-64 md:h-auto md:w-2/5 xl:w-1/3 bg-surface-container overflow-hidden">
                  <Image
                    src={ikan.gambar_url && !ikan.gambar_url.includes('unsplash') ? ikan.gambar_url : '/images/hero-banner.png'}
                    alt={ikan.nama_ikan}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {ikan.spot_wisata && (
                    <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md text-on-surface text-xs font-bold px-sm py-1 rounded-full shadow-sm flex items-center gap-1 border border-white/20">
                      <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                      {ikan.spot_wisata.nama_lokasi}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-lg flex-1 flex flex-col justify-center">
                  <div className="mb-md">
                    <h2 className="text-3xl font-bold text-on-surface group-hover:text-primary transition-colors">
                      {ikan.nama_ikan}
                    </h2>
                    {ikan.nama_ilmiah && (
                      <p className="text-on-surface-variant italic font-serif text-lg mt-1">
                        {ikan.nama_ilmiah}
                      </p>
                    )}
                  </div>

                  <p className="text-on-surface text-base leading-relaxed mb-lg border-l-4 border-primary-fixed pl-md">
                    {ikan.deskripsi}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mt-auto">
                    {ikan.kandungan_gizi && (
                      <div className="bg-surface-container-low p-md rounded-2xl">
                        <h3 className="text-sm font-bold text-primary flex items-center gap-1 mb-2">
                          <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                          Kandungan Gizi
                        </h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                          {ikan.kandungan_gizi}
                        </p>
                      </div>
                    )}
                    {ikan.habitat_dan_perawatan && (
                      <div className="bg-surface-container-low p-md rounded-2xl">
                        <h3 className="text-sm font-bold text-secondary flex items-center gap-1 mb-2">
                          <span className="material-symbols-outlined text-[18px]">water_ec</span>
                          Habitat & Perawatan
                        </h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                          {ikan.habitat_dan_perawatan}
                        </p>
                      </div>
                    )}
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
