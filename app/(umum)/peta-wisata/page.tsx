'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SpotWisata, Ikan } from '@/lib/types'

// Dynamically import the map component with no SSR (Leaflet requires window)
const MapComponent = dynamic(() => import('./_components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-3xl bg-surface-container-high flex items-center justify-center">
      <div className="text-center">
        <span className="material-symbols-outlined text-5xl text-outline animate-pulse">map</span>
        <p className="text-on-surface-variant mt-sm">Memuat peta...</p>
      </div>
    </div>
  ),
})

type SpotWisataWithIkan = SpotWisata & { ikan?: Ikan[] }

const categoryFilters = ['Semua', 'Pemancingan', 'UMKM', 'Wisata', 'Budidaya', 'Lainnya']

function getCategoryIcon(kategori: string) {
  switch (kategori) {
    case 'Pemancingan': return 'phishing'
    case 'UMKM': return 'storefront'
    case 'Wisata': return 'park'
    case 'Budidaya': return 'water_drop'
    default: return 'location_on'
  }
}

export default function PetaWisataPage() {
  const [spots, setSpots] = useState<SpotWisataWithIkan[]>([])
  const [filteredSpots, setFilteredSpots] = useState<SpotWisataWithIkan[]>([])

  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedSpot, setSelectedSpot] = useState<SpotWisataWithIkan | null>(null)

  useEffect(() => {
    async function fetchSpots() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('spot_wisata')
          .select('*, ikan(*)')
          .eq('status', 'published')
          .order('created_at', { ascending: false })

        if (data) {
          setSpots(data)
          setFilteredSpots(data)
        }
      } catch {
        // Handle error
      }
    }
    fetchSpots()
  }, [])

  useEffect(() => {
    if (activeCategory === 'Semua') {
      setFilteredSpots(spots)
    } else {
      setFilteredSpots(spots.filter((s) => s.kategori === activeCategory))
    }
  }, [activeCategory, spots])

  return (
    <>
      {/* Header */}
      <section className="mt-md px-gutter max-w-[1600px] mx-auto py-lg">
        <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-sm font-bold px-md py-1 rounded-full mb-md">
          Peta Interaktif
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
          Jelajahi Spot Ekowisata
        </h1>
        <p className="text-on-surface-variant text-lg mt-md max-w-[42rem] leading-relaxed">
          Temukan lokasi kolam pemancingan, restoran ikan, pusat edukasi, dan
          titik strategis lainnya di Kelurahan Tingkir Tengah.
        </p>
      </section>

      {/* Category Filters */}
      <section className="px-gutter max-w-[1600px] mx-auto mb-md">
        <div className="flex flex-wrap gap-xs">
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-md py-2 rounded-full font-medium text-sm transition-all flex items-center gap-xs ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
              }`}
              id={`map-filter-${cat.toLowerCase()}`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {getCategoryIcon(cat === 'Semua' ? '' : cat)}
              </span>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Map + Sidebar */}
      <section className="px-gutter max-w-[1600px] mx-auto pb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Map */}
          <div className="lg:col-span-2">
            <MapComponent
              spots={filteredSpots}
              selectedSpot={selectedSpot}
              onSelectSpot={setSelectedSpot}
            />
          </div>

          {/* Sidebar - Spot List */}
          <div className="space-y-sm max-h-[600px] overflow-y-auto pr-xs">
            <h3 className="text-lg font-semibold text-on-surface sticky top-0 bg-surface py-xs z-10">
              {filteredSpots.length} Lokasi Ditemukan
            </h3>
            {filteredSpots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setSelectedSpot(spot)}
                className={`w-full text-left p-md rounded-2xl border transition-all duration-300 ${
                  selectedSpot?.id === spot.id
                    ? 'bg-primary-fixed/20 border-primary shadow-ambient'
                    : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-sm">
                  <span className={`material-symbols-outlined text-2xl ${
                    selectedSpot?.id === spot.id ? 'text-primary' : 'text-outline'
                  }`}>
                    {getCategoryIcon(spot.kategori)}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-on-surface">{spot.nama_lokasi}</h4>
                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">
                      {spot.deskripsi}
                    </p>
                    {spot.jam_operasional && (
                      <p className="text-xs text-outline mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {spot.jam_operasional}
                      </p>
                    )}
                    <span className={`inline-block mt-2 text-xs px-sm py-0.5 rounded-full font-medium ${
                      spot.kategori === 'UMKM' ? 'bg-secondary-fixed/30 text-secondary' :
                      spot.kategori === 'Wisata' ? 'bg-tertiary-fixed/30 text-tertiary' :
                      'bg-primary-fixed/30 text-primary'
                    }`}>
                      {spot.kategori}
                    </span>

                    {/* Menampilkan Ikan yang ada di lokasi ini */}
                    {spot.ikan && spot.ikan.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/30">
                        <p className="text-xs font-semibold text-on-surface mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">phishing</span>
                          Jenis Ikan:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {spot.ikan.map(i => (
                            <span key={i.id} className="text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full border border-outline-variant">
                              {i.nama_ikan}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
