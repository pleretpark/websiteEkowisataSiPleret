'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    background-color: #00685f; /* Warna hijau tema */
    width: 36px;
    height: 36px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    border: 3px solid white;
    cursor: grab;
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

interface LocationPickerProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

export default function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [lat || -7.361834, lng || 110.526024],
      zoom: 13,
      minZoom: 15, // Mencegah zoom out terlalu jauh keluar area
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps',
      maxNativeZoom: 20,
      maxZoom: 22,
    }).addTo(map)

    let isMounted = true

    // Memuat garis batas wilayah
    fetch('/data/batas-tingkir-tengah.geojson')
      .then((res) => res.json())
      .then((geoData) => {
        if (!isMounted) return
        L.geoJSON(geoData, {
          style: {
            color: '#10b981',
            weight: 3,
            fillColor: '#10b981',
            fillOpacity: 0.1,
            dashArray: '5, 5'
          }
        }).addTo(map)
      })
      .catch((err) => console.error("Gagal memuat GeoJSON wilayah:", err))

    // Initial marker
    const marker = L.marker([lat || -7.361834, lng || 110.526024], { icon: customIcon, draggable: true }).addTo(map)
    markerRef.current = marker

    // Event listener for map click
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)))
    })

    // Event listener for marker drag end
    marker.on('dragend', () => {
      const position = marker.getLatLng()
      onChange(Number(position.lat.toFixed(6)), Number(position.lng.toFixed(6)))
    })

    mapRef.current = map

    return () => {
      isMounted = false
      map.remove()
      mapRef.current = null
    }
  }, []) // Empty dependency array so map initializes only once

  // Update marker if lat/lng props change externally
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
      mapRef.current.setView([lat, lng])
    }
  }, [lat, lng])

  return (
    <div className="w-full flex flex-col gap-2">
      <div 
        ref={containerRef} 
        className="w-full h-[350px] rounded-xl border border-outline-variant shadow-sm z-0 relative"
      />
      <p className="text-sm text-outline flex items-center gap-1">
        <span className="material-symbols-outlined text-[16px]">touch_app</span>
        Klik di peta atau geser pin untuk mengatur koordinat latitude & longitude otomatis.
      </p>
    </div>
  )
}
