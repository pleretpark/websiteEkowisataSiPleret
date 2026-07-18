'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Fungsi ini hanya dipanggil sekali saat komponen dimuat (saat pengunjung membuka web)
    const trackVisitor = async () => {
      try {
        await fetch('/api/visitor', {
          method: 'POST',
          // Menghindari cache agar hitungan tidak ter-cache oleh browser
          cache: 'no-store', 
        });
      } catch (error) {
        console.error('Gagal mencatat pengunjung:', error);
      }
    };

    trackVisitor();
  }, []);

  // Komponen ini tidak menampilkan apa-apa secara visual
  return null;
}
