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
    case 'UMKM': return '#00668a'
    case 'Wisata': return '#3d6700'
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
      center: [-7.3590, 110.527],
      zoom: 13,
      minZoom: 15, // Mencegah zoom out terlalu jauh keluar area
      zoomControl: true,
      scrollWheelZoom: true,
    })

    // Menggunakan tile layer Google Maps Satellite (Satelit murni tanpa pin/label bawaan)
    L.tileLayer('http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps',
      maxNativeZoom: 21, // Google Maps biasanya memiliki resolusi tinggi hingga zoom 20+
      maxZoom: 21,
    }).addTo(map)

    let isMounted = true

    // Memuat garis batas wilayah (Polygon) dari file GeoJSON
    fetch('/data/batas-tingkir-tengah.geojson')
      .then((res) => res.json())
      .then((geoData) => {
        if (!isMounted) return // Cegah penambahan ke map jika map sudah di-unmount
        L.geoJSON(geoData, {
          style: {
            color: '#10b981', // Warna garis batas
            weight: 3,
            fillColor: '#10b981',
            fillOpacity: 0.1, // Transparansi isi (10%)
            dashArray: '5, 5' // Membuat efek garis putus-putus yang estetik
          }
        }).addTo(map)
      })
      .catch((err) => console.error("Gagal memuat GeoJSON wilayah:", err))

    // Track posisi user secara realtime
    let userMarker: L.Marker | null = null
    let watchId: number | null = null

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (!isMounted || !map) return
          const { latitude, longitude } = position.coords

          if (!userMarker) {
            // Buat marker pin merah untuk user dengan efek berdenyut (pulse/ping)
            const userIcon = L.divIcon({
              className: 'user-location-marker',
              html: `<div class="relative w-5 h-5 bg-error rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <div class="absolute inset-0 bg-error rounded-full animate-ping opacity-75"></div>
              </div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })
            userMarker = L.marker([latitude, longitude], { icon: userIcon, zIndexOffset: 9999 }).addTo(map)
            userMarker.bindPopup('<div style="font-weight:bold;font-size:14px;color:#1b1c19;text-align:center;">Posisi Anda</div>')
          } else {
            userMarker.setLatLng([latitude, longitude])
          }
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi user:", error)
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      )
    }

    mapRef.current = map

    return () => {
      isMounted = false
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
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
        <div class="popup-container">
          ${spot.gambar_url ? `
            <div class="popup-image-container">
              <img src="${spot.gambar_url}" alt="${spot.nama_lokasi}" class="popup-image" />
            </div>
          ` : ''}
          <div class="popup-body">
            <h3 style="font-weight: 700; font-size: 16px; color: #1b1c19; margin: 0 0 6px 0; line-height: 1.3;">${spot.nama_lokasi}</h3>
            <p style="font-size: 13px; color: #3d4947; margin: 0 0 14px 0; line-height: 1.5; word-wrap: break-word;">${spot.deskripsi.length > 100 ? spot.deskripsi.substring(0, 100) + '...' : spot.deskripsi}</p>
            
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f0f4f4; padding-top: 12px;">
              ${spot.jam_operasional ? `
                <div style="font-size: 12px; color: #6d7a77; display: flex; align-items: center; gap: 6px; font-weight: 500;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>${spot.jam_operasional}</span>
                </div>
              ` : '<div></div>'}
              <span style="
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: ${color}15;
                color: ${color};
                font-size: 11px;
                font-weight: 600;
                padding: 4px 10px;
                border-radius: 100px;
              ">${spot.kategori}</span>
            </div>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        minWidth: 260,
        className: spot.gambar_url ? 'wisata-popup has-image' : 'wisata-popup no-image'
      })
      marker.on('click', () => onSelectSpot(spot))
      marker.addTo(mapRef.current!)

      markersRef.current.push(marker)
    })
  }, [spots, onSelectSpot])

  // Fly to selected spot
  useEffect(() => {
    if (!mapRef.current || !selectedSpot) return

    const map = mapRef.current
    const targetZoom = 19 // Zoom level maksimal saat fokus ke pin

    // Menggeser titik tengah (center) ke atas agar pin berada agak ke bawah, sehingga popup terlihat
    const targetLatLng = L.latLng(selectedSpot.latitude, selectedSpot.longitude)
    const targetPoint = map.project(targetLatLng, targetZoom)
    targetPoint.y -= 160 // Geser center 160px ke atas

    const offsetLatLng = map.unproject(targetPoint, targetZoom)

    map.flyTo(offsetLatLng, targetZoom, {
      duration: 1,
    })

    // Open popup of selected marker
    const marker = markersRef.current.find((m) => {
      const latlng = m.getLatLng()
      return latlng.lat === selectedSpot.latitude && latlng.lng === selectedSpot.longitude
    })
    if (marker) {
      // Tambahkan sedikit timeout agar animasi flyTo jalan dulu
      setTimeout(() => {
        marker.openPopup()
      }, 200)
    }
  }, [selectedSpot])

  return (
    <>
      <style>{`
        .wisata-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .wisata-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1.5;
        }
        
        /* Close button styling for popups WITH image */
        .wisata-popup.has-image .leaflet-popup-close-button {
          color: #fff !important;
          background: rgba(0,0,0,0.3) !important;
          border-radius: 50%;
          width: 26px !important;
          height: 26px !important;
          top: 10px !important;
          right: 10px !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
          font-size: 18px !important;
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
        }
        .wisata-popup.has-image .leaflet-popup-close-button:hover {
          background: rgba(0,0,0,0.6) !important;
          color: #fff !important;
        }
        .wisata-popup.has-image .leaflet-popup-close-button span {
          margin-top: -2px;
        }

        /* Close button styling for popups WITHOUT image */
        .wisata-popup.no-image .leaflet-popup-close-button {
          color: #6d7a77 !important;
          background: #f0f4f4 !important;
          border-radius: 50%;
          width: 26px !important;
          height: 26px !important;
          top: 10px !important;
          right: 10px !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
          font-size: 18px !important;
          transition: all 0.2s ease;
        }
        .wisata-popup.no-image .leaflet-popup-close-button:hover {
          background: #e1e7e7 !important;
          color: #1b1c19 !important;
        }
        .wisata-popup.no-image .leaflet-popup-close-button span {
          margin-top: -2px;
        }

        /* Popup Inner Layout */
        .wisata-popup .popup-image-container {
          width: 100%;
          height: 160px;
          position: relative;
        }
        .wisata-popup .popup-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wisata-popup .popup-body {
          padding: 16px;
          font-family: 'Lexend', sans-serif;
        }
      `}</style>
      <div
        ref={containerRef}
        className="w-full h-[600px] rounded-3xl overflow-hidden shadow-ambient-lg border border-outline-variant z-0 relative"
      />
    </>
  )
}
