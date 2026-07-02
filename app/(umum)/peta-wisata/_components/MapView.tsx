'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SpotWisata } from '@/lib/types'

// Fix Leaflet default marker icon issue
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function getCategoryColor(kategori: string) {
  switch (kategori) {
    case 'Pemancingan': return '#00685f'
    case 'Kuliner': return '#00668a'
    case 'Edukasi': return '#3d6700'
    case 'Budidaya': return '#008378'
    default: return '#6d7a77'
  }
}

interface MapViewProps {
  spots: SpotWisata[]
  selectedSpot: SpotWisata | null
  onSelectSpot: (spot: SpotWisata) => void
}

export default function MapView({ spots, selectedSpot, onSelectSpot }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [-7.317, 110.488],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update markers when spots change
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    // Add new markers
    spots.forEach((spot) => {
      const color = getCategoryColor(spot.kategori)

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          border: 3px solid white;
        ">
          <span style="
            transform: rotate(45deg);
            color: white;
            font-size: 14px;
            font-weight: bold;
          ">●</span>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      })

      const marker = L.marker([spot.latitude, spot.longitude], {
        icon: customIcon,
      })

      const popupContent = `
        <div style="font-family: 'Lexend', sans-serif; min-width: 200px; padding: 4px;">
          ${spot.gambar_url ? `<img src="${spot.gambar_url}" alt="${spot.nama_lokasi}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 12px; margin-bottom: 8px;" />` : ''}
          <h3 style="font-weight: 600; font-size: 16px; color: #1b1c19; margin: 0;">${spot.nama_lokasi}</h3>
          <p style="font-size: 13px; color: #3d4947; margin: 4px 0;">${spot.deskripsi}</p>
          ${spot.jam_operasional ? `<p style="font-size: 12px; color: #6d7a77; margin: 4px 0;">🕐 ${spot.jam_operasional}</p>` : ''}
          <span style="
            display: inline-block;
            background: ${color}22;
            color: ${color};
            font-size: 11px;
            font-weight: 600;
            padding: 2px 10px;
            border-radius: 20px;
            margin-top: 4px;
          ">${spot.kategori}</span>
        </div>
      `

      marker.bindPopup(popupContent, { maxWidth: 280 })
      marker.on('click', () => onSelectSpot(spot))
      marker.addTo(mapRef.current!)

      markersRef.current.push(marker)
    })
  }, [spots, onSelectSpot])

  // Fly to selected spot
  useEffect(() => {
    if (!mapRef.current || !selectedSpot) return

    mapRef.current.flyTo([selectedSpot.latitude, selectedSpot.longitude], 17, {
      duration: 1,
    })

    // Open popup of selected marker
    const marker = markersRef.current.find((m) => {
      const latlng = m.getLatLng()
      return latlng.lat === selectedSpot.latitude && latlng.lng === selectedSpot.longitude
    })
    if (marker) {
      marker.openPopup()
    }
  }, [selectedSpot])

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] rounded-3xl overflow-hidden shadow-ambient-lg border border-outline-variant z-0"
    />
  )
}
