'use client';

import { useEffect, useState, useCallback } from 'react';

export default function VisitorStats() {
  const [stats, setStats] = useState({ today: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/visitor', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats({ today: data.today, total: data.total });
        }
      }
    } catch (error) {
      console.error('Failed to fetch visitor stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch awal saat komponen dimuat
    fetchStats();

    // Dengarkan event dari VisitorTracker — refresh setelah pengunjung berhasil dicatat
    const handleTracked = () => fetchStats();
    window.addEventListener('visitor-tracked', handleTracked);

    return () => {
      window.removeEventListener('visitor-tracked', handleTracked);
    };
  }, [fetchStats]);

  return (
    <div className="bg-surface-container p-sm rounded-xl border border-outline-variant">
      <h5 className="text-sm font-bold tracking-widest uppercase text-primary mb-sm">
        Statistik Pengunjung
      </h5>
      {loading ? (
        <div className="flex flex-col gap-xs animate-pulse">
          <div className="h-4 bg-outline-variant rounded w-3/4"></div>
          <div className="h-4 bg-outline-variant rounded w-1/2"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-center text-sm text-on-surface-variant">
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">today</span>
              Hari Ini:
            </span>
            <span className="font-bold text-on-surface">{stats.today}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-on-surface-variant">
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">monitoring</span>
              Total Keseluruhan:
            </span>
            <span className="font-bold text-on-surface">{stats.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
