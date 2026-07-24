'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SpotWisata } from '@/lib/types'

const emptyForm: Partial<SpotWisata> = {
  nama_lokasi: '', kategori: 'Pemancingan', latitude: -7.317, longitude: 110.488,
  deskripsi: '', gambar_url: '', jam_operasional: '', status: 'published',
}
const categories: SpotWisata['kategori'][] = ['Pemancingan', 'Kuliner', 'Edukasi', 'Budidaya', 'Lainnya']

export default function AdminSpotWisataPage() {
  const [items, setItems] = useState<SpotWisata[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<SpotWisata>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('spot_wisata').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch (err: any) {
      console.error('Fetch error:', err)
      setMessage({ type: 'error', text: 'Gagal memuat data Spot Wisata.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setMessage(null)
    setLocalPreview(null)
  }

  function openEdit(item: SpotWisata) {
    setForm(item)
    setEditingId(item.id)
    setShowForm(true)
    setMessage(null)
    setLocalPreview(null)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Batasi ukuran file maksimal 1 MB (1.048.576 bytes)
    const maxFileSize = 1 * 1024 * 1024
    if (file.size > maxFileSize) {
      setMessage({
        type: 'error',
        text: 'Ukuran file gambar terlalu besar. Maksimal ukuran file adalah 1 MB.',
      })
      // Reset input file agar dapat dipilih kembali
      e.target.value = ''
      return
    }

    setLocalPreview(URL.createObjectURL(file))
    setUploading(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `spot-wisata-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      setForm((prev) => ({ ...prev, gambar_url: publicUrl }))
      setMessage({ type: 'success', text: 'Gambar berhasil diunggah!' })
    } catch (err: any) {
      console.error('Upload error:', err)
      setMessage({
        type: 'error',
        text: 'Gagal mengunggah gambar. Pastikan koneksi internet stabil dan format gambar didukung.',
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMessage(null)
    try {
      const supabase = createClient()
      const payload = {
        nama_lokasi: form.nama_lokasi,
        kategori: form.kategori,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        deskripsi: form.deskripsi,
        gambar_url: form.gambar_url || null,
        jam_operasional: form.jam_operasional || null,
        status: form.status,
      }
      if (editingId) {
        const { error } = await supabase.from('spot_wisata').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingId)
        if (error) throw error
        setMessage({ type: 'success', text: 'Spot wisata berhasil diperbarui!' })
      } else {
        const { error } = await supabase.from('spot_wisata').insert(payload)
        if (error) throw error
        setMessage({ type: 'success', text: 'Spot wisata berhasil ditambahkan!' })
      }
      setShowForm(false); fetchItems()
    } catch (err: any) {
      console.error('Submit error:', err)
      setMessage({ type: 'error', text: `Gagal menyimpan data: ${err?.message || 'Terjadi kesalahan.'}` })
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus spot ini?')) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from('spot_wisata').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Spot berhasil dihapus.' })
      fetchItems()
    } catch (err: any) {
      console.error('Delete error:', err)
      setMessage({ type: 'error', text: 'Gagal menghapus data.' })
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg gap-md">
        <div>
          <h1 className="text-5xl font-bold text-on-surface">Kelola Spot Wisata</h1>
          <p className="text-on-surface-variant text-xl mt-xs">Atur dan kelola titik-titik lokasi ekowisata.</p>
        </div>
        <button onClick={openCreate} className="bg-primary text-on-primary font-bold px-md py-xs rounded-full hover:shadow-xl transition-all flex items-center gap-xs" id="add-spot-btn">
          <span className="material-symbols-outlined text-[18px]">add_location</span>
          Tambah Spot Baru
        </button>
      </div>

      {message && (
        <div className={`rounded-xl p-sm mb-md text-lg flex items-center gap-xs ${message.type === 'success' ? 'bg-tertiary-fixed/30 text-tertiary' : 'bg-error-container text-on-error-container'}`}>
          <span className="material-symbols-outlined text-[18px]">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          {message.text}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[42rem] max-h-[90vh] overflow-y-auto shadow-ambient-lg border border-outline-variant animate-fade-in-up">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-3xl font-bold text-on-surface">{editingId ? 'Edit Spot Wisata' : 'Tambah Spot Baru'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Message inside modal */}
            {message && (
              <div
                className={`rounded-xl p-sm mb-md text-lg flex items-center gap-xs ${
                  message.type === 'success'
                    ? 'bg-tertiary-fixed/30 text-tertiary'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {message.type === 'success' ? 'check_circle' : 'error'}
                </span>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Nama Lokasi *</label>
                  <input required value={form.nama_lokasi || ''} onChange={(e) => setForm({ ...form, nama_lokasi: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" placeholder="Kolam Pemancingan Jaya" />
                </div>
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Kategori *</label>
                  <select value={form.kategori || 'Pemancingan'} onChange={(e) => setForm({ ...form, kategori: e.target.value as SpotWisata['kategori'] })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface">
                    {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Latitude *</label>
                  <input required type="number" step="any" value={form.latitude || ''} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" placeholder="-7.317" />
                </div>
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Longitude *</label>
                  <input required type="number" step="any" value={form.longitude || ''} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" placeholder="110.488" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Jam Operasional</label>
                  <input value={form.jam_operasional || ''} onChange={(e) => setForm({ ...form, jam_operasional: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" placeholder="08:00 - 17:00" />
                </div>
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Status *</label>
                  <select value={form.status || 'published'} onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">Deskripsi *</label>
                <textarea required rows={3} value={form.deskripsi || ''} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface resize-none" placeholder="Deskripsi lokasi wisata..." />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">
                  Foto Lokasi
                </label>
                <div className="flex items-center gap-md">
                  <label className="cursor-pointer bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 hover:bg-surface-container-high transition-colors flex items-center gap-xs text-lg text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {uploading ? 'Mengunggah...' : 'Pilih Gambar'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                  {(localPreview || form.gambar_url) && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant flex-shrink-0">
                      <img src={localPreview || form.gambar_url || ''} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <p className="text-base text-outline mt-xs">Maksimal ukuran file: 1 MB. Format: JPG, PNG, WebP.</p>
              </div>

              <div className="flex justify-end gap-sm pt-md">
                <button type="button" onClick={() => setShowForm(false)} className="px-xl py-xs rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">Batal</button>
                <button type="submit" disabled={saving || uploading} className="bg-primary text-on-primary font-bold px-xl py-xs rounded-full hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-xs">
                  {saving ? <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Menyimpan...</> : <><span className="material-symbols-outlined text-[16px]">save</span>Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest rounded-3xl p-sm border border-outline-variant">
              <div className="h-48 rounded-xl animate-shimmer mb-sm" />
              <div className="h-5 w-3/4 rounded animate-shimmer mb-xs" />
              <div className="h-4 w-full rounded animate-shimmer" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-xl">
            <span className="material-symbols-outlined text-6xl text-outline-variant">map</span>
            <p className="text-on-surface-variant text-2xl mt-md">Belum ada spot wisata.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden hover:shadow-ambient-hover transition-all group">
              <div className="relative h-48 overflow-hidden">
                {item.gambar_url ? (
                  <Image src={item.gambar_url} alt={item.nama_lokasi} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-outline">image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`text-base px-sm py-1 rounded-full font-bold ${item.status === 'published' ? 'bg-tertiary text-on-tertiary' : 'bg-outline text-on-primary'}`}>
                    {item.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </div>
              </div>
              <div className="p-md">
                <h3 className="font-semibold text-on-surface text-2xl">{item.nama_lokasi}</h3>
                <p className="text-lg text-on-surface-variant mt-1 line-clamp-2">{item.deskripsi}</p>
                {item.jam_operasional && (
                  <p className="text-base text-outline mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {item.jam_operasional}
                  </p>
                )}
                <div className="flex items-center justify-between mt-md">
                  <span className="text-base bg-surface-container-high px-sm py-1 rounded-full text-on-surface-variant">{item.kategori}</span>
                  <div className="flex gap-xs">
                    <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-primary-fixed/20 text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center" title="Edit">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-error-container/30 text-error hover:bg-error hover:text-on-error transition-all flex items-center justify-center" title="Hapus">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
