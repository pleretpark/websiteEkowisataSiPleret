'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Ikan } from '@/lib/types'

export default function IkanDetailPage() {
  const params = useParams()
  const [ikan, setIkan] = useState<Ikan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIkan() {
      if (!params.id) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('ikan')
          .select('*, spot_wisata(*)')
          .eq('id', params.id as string)
          .single()

        if (error || !data) {
          console.error(error)
          setIkan(null)
        } else {
          setIkan(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchIkan()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!ikan) {
    return (
      <div className="text-center py-xl mt-xl min-h-[50vh]">
        <h1 className="text-3xl font-bold text-on-surface">Ikan Tidak Ditemukan</h1>
        <Link href="/detail-ikan" className="text-primary font-bold hover:underline mt-4 inline-block">
          Kembali ke Daftar Ikan
        </Link>
      </div>
    )
  }

  return (
    <section className="px-gutter max-w-[1200px] mx-auto py-xl">
      <Link href="/detail-ikan" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-lg font-medium">
        <span className="material-symbols-outlined">arrow_back</span>
        Kembali ke Daftar Ikan
      </Link>

      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant">
        <div className="relative h-64 md:h-[400px] w-full bg-surface-container">
          <Image
            src={ikan.gambar_url && !ikan.gambar_url.includes('unsplash') ? ikan.gambar_url : '/images/hero-banner.png'}
            alt={ikan.nama_ikan}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          {ikan.spot_wisata && (
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md text-on-surface text-sm font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-2 border border-white/20">
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
              Bisa ditemukan di: {ikan.spot_wisata.nama_lokasi}
            </div>
          )}
        </div>

        <div className="p-lg md:p-xl">
          <div className="mb-xl text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
              {ikan.nama_ikan}
            </h1>
            {ikan.nama_ilmiah && (
              <p className="text-on-surface-variant italic font-serif text-xl border-b border-outline pb-4 inline-block md:block">
                {ikan.nama_ilmiah}
              </p>
            )}
          </div>

          <div className="prose prose-lg max-w-none text-on-surface-variant">
            <p className="text-lg md:text-xl leading-relaxed mb-xl border-l-4 border-primary-fixed pl-md">
              {ikan.deskripsi}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-xl">
              {ikan.kandungan_gizi && (
                <div className="bg-surface-container-low p-lg rounded-3xl shadow-sm">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
                    Kandungan Gizi
                  </h3>
                  <p className="leading-relaxed">
                    {ikan.kandungan_gizi}
                  </p>
                </div>
              )}

              {ikan.habitat_dan_perawatan && (
                <div className="bg-surface-container-low p-lg rounded-3xl shadow-sm">
                  <h3 className="text-lg font-bold text-secondary flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[24px]">water_ec</span>
                    Habitat & Perawatan
                  </h3>
                  <p className="leading-relaxed">
                    {ikan.habitat_dan_perawatan}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
