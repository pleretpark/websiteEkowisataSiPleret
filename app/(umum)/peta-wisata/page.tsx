'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SpotWisata } from '@/lib/types'

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

const sampleSpots: SpotWisata[] = [
  {
    id: '1', nama_lokasi: 'Mina Wisata Kolam', kategori: 'Pemancingan',
    latitude: -7.316, longitude: 110.488, deskripsi: 'Kolam pemancingan keluarga dengan suasana asri dan nyaman.',
    gambar_url: '/images/hero-banner.png', jam_operasional: '08:00 - 17:00',
    status: 'published', created_at: '', updated_at: '',
  },
  {
    id: '2', nama_lokasi: 'Dapoer Ekowisata', kategori: 'Kuliner',
    latitude: -7.318, longitude: 110.490, deskripsi: 'Restoran ikan segar dengan menu olahan tradisional.',
    gambar_url: '/images/community.png', jam_operasional: '10:00 - 21:00',
    status: 'published', created_at: '', updated_at: '',
  },
  {
    id: '3', nama_lokasi: 'Taman Edukasi Air', kategori: 'Edukasi',
    latitude: -7.314, longitude: 110.486, deskripsi: 'Pusat edukasi budidaya ikan air tawar untuk anak-anak.',
    gambar_url: '/images/about-hero.png', jam_operasional: '09:00 - 16:00',
    status: 'published', created_at: '', updated_at: '',
  },
  {
    id: '4', nama_lokasi: 'Kolam Budidaya Lele', kategori: 'Budidaya',
    latitude: -7.320, longitude: 110.485, deskripsi: 'Sentra budidaya ikan lele organik dengan metode bioflok.',
    gambar_url: '/images/hero-banner.png', jam_operasional: '07:00 - 18:00',
    status: 'published', created_at: '', updated_at: '',
  },
]

const categoryFilters = ['Semua', 'Pemancingan', 'Kuliner', 'Edukasi', 'Budidaya', 'Lainnya']

function getCategoryIcon(kategori: string) {
  switch (kategori) {
    case 'Pemancingan': return 'phishing'
    case 'Kuliner': return 'restaurant'
    case 'Edukasi': return 'school'
    case 'Budidaya': return 'water_drop'
    default: return 'location_on'
  }
}

export default function PetaWisataPage() {
  const [spots, setSpots] = useState<SpotWisata[]>(sampleSpots)
  const [filteredSpots, setFilteredSpots] = useState<SpotWisata[]>(sampleSpots)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedSpot, setSelectedSpot] = useState<SpotWisata | null>(null)

  useEffect(() => {
    async function fetchSpots() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('spot_wisata')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })

        if (data && data.length > 0) {
          setSpots(data)
          setFilteredSpots(data)
        }
      } catch {
        // Supabase not configured
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
      <section className="mt-md px-gutter max-w-container-max mx-auto py-lg">
        <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-sm font-bold px-md py-1 rounded-full mb-md">
          Peta Interaktif
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
          Jelajahi Spot Ekowisata
        </h1>
        <p className="text-on-surface-variant text-lg mt-md max-w-2xl leading-relaxed">
          Temukan lokasi kolam pemancingan, restoran ikan, pusat edukasi, dan
          titik strategis lainnya di Kelurahan Tingkir Tengah.
        </p>
      </section>

      {/* Category Filters */}
      <section className="px-gutter max-w-container-max mx-auto mb-md">
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
      <section className="px-gutter max-w-container-max mx-auto pb-xl">
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
                      spot.kategori === 'Kuliner' ? 'bg-secondary-fixed/30 text-secondary' :
                      spot.kategori === 'Edukasi' ? 'bg-tertiary-fixed/30 text-tertiary' :
                      'bg-primary-fixed/30 text-primary'
                    }`}>
                      {spot.kategori}
                    </span>
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
