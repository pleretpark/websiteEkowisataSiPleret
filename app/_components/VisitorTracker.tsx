'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      // Cegah penghitungan ganda dalam satu sesi browser (tab/window)
      if (sessionStorage.getItem('visitor_tracked')) {
        return;
      }

      try {
        const res = await fetch('/api/visitor', {
          method: 'POST',
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            // Tandai bahwa sesi ini sudah dihitung
            sessionStorage.setItem('visitor_tracked', '1');
            // Kirim event agar VisitorStats di-refresh dengan data terbaru
            window.dispatchEvent(new CustomEvent('visitor-tracked'));
          }
        }
      } catch (error) {
        console.error('Gagal mencatat pengunjung:', error);
      }
    };

    trackVisitor();
  }, []);

  // Komponen ini tidak menampilkan apa-apa secara visual
  return null;
}
