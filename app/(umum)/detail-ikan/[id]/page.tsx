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
            src={ikan.gambar_url || '/images/ikan.jpg'}
            alt={ikan.nama_ikan}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        <div className="p-lg md:p-xl">
          <div className="mb-xl flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8 border-b border-outline pb-8">
            <div className="relative w-64 h-40 md:w-80 md:h-56 rounded-3xl md:rounded-[2rem] overflow-hidden shrink-0 border-4 border-surface shadow-md bg-surface-container-high">
              <Image
                src={ikan.gambar_url || '/images/ikan.jpg'}
                alt={ikan.nama_ikan}
                fill
                sizes="(max-width: 320px) 100vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-4">
                {ikan.nama_ikan}
              </h1>
              <div className="flex flex-col md:items-start items-center gap-3">
                {ikan.nama_ilmiah && (
                  <div className="inline-block bg-surface-variant/40 border-l-4 border-primary-fixed py-3 px-5 shadow-sm">
                    <p className="text-on-surface italic font-serif text-xl">
                      {ikan.nama_ilmiah}
                    </p>
                  </div>
                )}
                {ikan.spot_wisata && (
                  <div className="inline-flex bg-primary/10 text-primary text-base font-bold px-4 py-2.5 rounded-full shadow-sm items-center gap-2 border border-primary/20">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                    Bisa ditemukan di: {ikan.spot_wisata.nama_lokasi}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-on-surface-variant">
            <div className="mb-xl">
              <h3 className="text-2xl font-bold text-on-surface mb-4">Deskripsi Singkat</h3>
              <p className="text-lg md:text-xl leading-relaxed text-justify">
                {ikan.deskripsi}
              </p>
            </div>

            <div className="flex flex-col gap-lg mt-xl">
              {ikan.fakta_menarik && (
                <div className="bg-surface-container-low p-lg rounded-3xl shadow-sm border border-outline-variant/30">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[28px]">lightbulb</span>
                    Fakta Menarik
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-lg leading-relaxed marker:text-primary">
                    {ikan.fakta_menarik.split('\n').map((line, i) => {
                      const cleanLine = line.trim().replace(/^•\s*/, '');
                      if (!cleanLine) return null;
                      
                      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
                      return (
                        <li key={i} className="pl-1">
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j} className="font-bold text-on-surface">{part.slice(2, -2)}</strong>;
                            }
                            return <span key={j}>{part}</span>;
                          })}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {ikan.kandungan_gizi && (
                <div className="bg-surface-container-low p-lg rounded-3xl shadow-sm border border-outline-variant/30">
                  <h3 className="text-xl font-bold text-secondary flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[28px]">restaurant_menu</span>
                    Kandungan Gizi
                  </h3>
                  <p className="leading-relaxed text-lg">
                    {ikan.kandungan_gizi}
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
