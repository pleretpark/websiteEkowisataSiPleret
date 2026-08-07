'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Ikan, SpotWisata } from '@/lib/types'

const emptyForm: Partial<Ikan> = {
  nama_ikan: '',
  nama_ilmiah: '',
  deskripsi: '',
  kandungan_gizi: '',
  fakta_menarik: '',
  gambar_url: '',
  spot_wisata_id: '',
}

export default function AdminIkanPage() {
  const [items, setItems] = useState<Ikan[]>([])
  const [spots, setSpots] = useState<Pick<SpotWisata, 'id' | 'nama_lokasi'>[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Ikan>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [errorModal, setErrorModal] = useState({ show: false, title: '', message: '' })

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev))
    }, 4000)
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Fetch Ikan data
      const { data: ikanData, error: ikanError } = await supabase
        .from('ikan')
        .select('*, spot_wisata(*)')
        .order('created_at', { ascending: false })

      if (ikanError) throw ikanError
      setItems(ikanData || [])

      // Fetch Spot Wisata data for dropdown
      const { data: spotData, error: spotError } = await supabase
        .from('spot_wisata')
        .select('id, nama_lokasi')
        .order('nama_lokasi', { ascending: true })

      if (spotError) throw spotError
      setSpots(spotData || [])

    } catch {
      showToast('error', 'Gagal memuat data.')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setToast(null)
  }

  function openEdit(item: Ikan) {
    setForm(item)
    setEditingId(item.id)
    setShowForm(true)
    setToast(null)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    if (file.size > 1024 * 1024) {
      setErrorModal({ show: true, title: 'Gagal', message: 'Ukuran file maksimal 1MB' })
      return
    }

    setUploadingImage(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `ikan/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setForm((prev) => ({ ...prev, gambar_url: publicUrl }))
    } catch {
      setErrorModal({ show: true, title: 'Upload error', message: 'Gagal mengunggah gambar. Coba lagi.' })
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setToast(null)
    try {
      const supabase = createClient()
      const payload = {
        nama_ikan: form.nama_ikan,
        nama_ilmiah: form.nama_ilmiah,
        deskripsi: form.deskripsi,
        kandungan_gizi: form.kandungan_gizi,
        fakta_menarik: form.fakta_menarik,
        gambar_url: form.gambar_url,
        spot_wisata_id: form.spot_wisata_id || null, // null if empty string
      }

      if (editingId) {
        const { error } = await supabase.from('ikan').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingId)
        if (error) throw error
        showToast('success', 'Data ikan berhasil diperbarui!')
      } else {
        const { error } = await supabase.from('ikan').insert(payload)
        if (error) throw error
        showToast('success', 'Data ikan berhasil ditambahkan!')
      }
      setShowForm(false)
      fetchData()
    } catch {
      showToast('error', 'Gagal menyimpan data.')
    } finally {
      setSaving(false)
    }
  }

  function requestDelete(id: string, name: string) {
    setDeleteConfirmId(id)
    setDeleteConfirmTitle(name)
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('ikan').delete().eq('id', id)
      if (error) throw error
      showToast('success', 'Data ikan berhasil dihapus.')
      fetchData()
    } catch {
      showToast('error', 'Gagal menghapus data.')
    } finally {
      setDeleteConfirmId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg gap-md">
        <div>
          <h1 className="text-5xl font-bold text-on-surface">Data Ikan</h1>
          <p className="text-on-surface-variant text-xl mt-xs">Kelola informasi jenis ikan di berbagai Lokasi.</p>
        </div>
        <button onClick={openCreate} className="bg-primary text-on-primary font-bold px-md py-xs rounded-full hover:shadow-xl transition-all flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Ikan Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[48rem] max-h-[90vh] overflow-y-auto shadow-ambient-lg border border-outline-variant animate-fade-in-up">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-3xl font-bold text-on-surface">{editingId ? 'Edit Data Ikan' : 'Tambah Ikan Baru'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Nama Ikan *</label>
                  <input required value={form.nama_ikan || ''} onChange={(e) => setForm({ ...form, nama_ikan: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" placeholder="Contoh: Ikan Nila Merah" />
                </div>
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Nama Ilmiah</label>
                  <input value={form.nama_ilmiah || ''} onChange={(e) => setForm({ ...form, nama_ilmiah: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface italic" placeholder="Contoh: Oreochromis niloticus" />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">Spot Wisata *</label>
                <select required value={form.spot_wisata_id || ''} onChange={(e) => setForm({ ...form, spot_wisata_id: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface">
                  <option value="">-- Pilih Lokasi Spot Wisata --</option>
                  {spots.map((spot) => (
                    <option key={spot.id} value={spot.id}>{spot.nama_lokasi}</option>
                  ))}
                </select>
                <p className="text-sm text-outline mt-1">Ikan ini dapat ditemukan di lokasi mana?</p>
              </div>

              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">Deskripsi Singkat *</label>
                <textarea required rows={6} value={form.deskripsi || ''} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface resize-none" placeholder="Tuliskan deskripsi singkat mengenai ikan ini..." />
              </div>

              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">Fakta Menarik</label>
                <textarea 
                  rows={5} 
                  value={form.fakta_menarik || ''} 
                  onChange={(e) => {
                    let val = e.target.value;
                    // Jika pengguna mengetik karakter pertama tanpa bullet, otomatis tambahkan bullet
                    if (val.length > 0 && !val.startsWith('•') && !val.includes('\n')) {
                      val = '• ' + val;
                    }
                    setForm({ ...form, fakta_menarik: val });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = e.target as HTMLTextAreaElement;
                      const start = target.selectionStart;
                      const end = target.selectionEnd;
                      const val = target.value;
                      const newVal = val.substring(0, start) + '\n• ' + val.substring(end);
                      setForm({ ...form, fakta_menarik: newVal });
                      
                      setTimeout(() => {
                        target.selectionStart = target.selectionEnd = start + 3;
                      }, 0);
                    }
                  }}
                  onFocus={(e) => {
                    if (!e.target.value) {
                      setForm({ ...form, fakta_menarik: '• ' });
                    }
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface resize-none leading-relaxed" 
                  placeholder="• Fakta pertama..." 
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">Kandungan Gizi</label>
                <textarea rows={2} value={form.kandungan_gizi || ''} onChange={(e) => setForm({ ...form, kandungan_gizi: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface resize-none" placeholder="Tinggi protein, Omega-3..." />
              </div>

              <div>
                <label className="block text-lg font-bold text-on-surface mb-xs">
                  Gambar Ikan (Maks 1MB)
                </label>
                
                {!form.gambar_url ? (
                  <label className="inline-flex cursor-pointer bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 hover:bg-surface-container-high transition-colors items-center gap-xs text-lg text-on-surface-variant font-medium mt-sm">
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    {uploadingImage ? 'Mengunggah...' : 'Pilih Gambar'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload} disabled={uploadingImage} />
                  </label>
                ) : (
                  <div className="flex flex-col gap-sm mt-xs">
                    <div className="relative w-64 h-40 rounded-xl overflow-hidden border border-outline-variant">
                      <img src={form.gambar_url} alt="Preview" className="w-full h-full object-contain bg-surface-container-lowest" />
                    </div>
                    <div className="flex items-center gap-md">
                      <label className="inline-flex cursor-pointer bg-surface-container-low border border-outline-variant rounded-xl px-md py-2 hover:bg-surface-container-high transition-colors items-center gap-xs text-base text-on-surface font-medium">
                        <span className="material-symbols-outlined text-[18px]">upload_file</span>
                        {uploadingImage ? 'Mengunggah...' : 'Ganti Gambar'}
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload} disabled={uploadingImage} />
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setForm(prev => ({ ...prev, gambar_url: '' }))} 
                        className="text-error hover:text-error/80 font-semibold text-base transition-colors"
                      >
                        Hapus Gambar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-sm pt-md">
                <button type="button" onClick={() => setShowForm(false)} className="px-xl py-xs rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">Batal</button>
                <button type="submit" disabled={saving || uploadingImage} className="bg-primary text-on-primary font-bold px-xl py-xs rounded-full hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-xs">
                  {saving ? <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Menyimpan...</> : <><span className="material-symbols-outlined text-[16px]">save</span>Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ikan List */}
      <div className="space-y-md">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-surface-container-lowest rounded-3xl p-md border border-outline-variant flex gap-md">
              <div className="w-32 h-32 rounded-xl animate-shimmer flex-shrink-0" />
              <div className="flex-1 space-y-xs py-xs">
                <div className="h-6 w-1/3 rounded animate-shimmer" />
                <div className="h-4 w-1/4 rounded animate-shimmer" />
                <div className="h-4 w-full rounded animate-shimmer mt-sm" />
                <div className="h-4 w-2/3 rounded animate-shimmer" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="text-center py-3xl bg-surface-container-lowest rounded-3xl border border-dashed border-outline shadow-sm">
            <span className="material-symbols-outlined text-6xl text-primary/40">phishing</span>
            <p className="text-on-surface-variant text-2xl mt-md">Belum ada data ikan.</p>
            <p className="text-outline text-lg mt-xs">Tambahkan informasi jenis ikan pertama Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {items.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden hover:shadow-ambient transition-all flex flex-col">
              
              {/* Section 1: Gambar Ikan */}
              <div className="relative w-full h-56 flex-shrink-0 bg-surface-container">
                <Image src={item.gambar_url || '/images/ikan.jpg'} alt={item.nama_ikan} fill className="object-cover" />
              </div>

              <div className="p-lg flex flex-col flex-1">
                {/* Section 2 & 3: Nama Ikan & Nama Ilmiah */}
                <div className="mb-3">
                  <h3 className="font-bold text-on-surface text-2xl leading-tight">
                    {item.nama_ikan}
                  </h3>
                  {item.nama_ilmiah && (
                    <p className="text-lg text-on-surface-variant italic font-serif">
                      {item.nama_ilmiah}
                    </p>
                  )}
                </div>

                {/* Section 4: Lokasi */}
                {item.spot_wisata && (
                  <div className="inline-flex items-center gap-1 text-tertiary font-medium mb-4">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    {item.spot_wisata.nama_lokasi}
                  </div>
                )}

                {/* Section Paling Bawah: Tanggal & Tombol */}
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-outline-variant">
                  {/* Kiri: Tanggal Diedit Terakhir */}
                  <div className="text-sm text-outline flex flex-col">
                    <span>Terakhir edit:</span>
                    <span className="font-medium">{new Date(item.updated_at || item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  {/* Kanan: Tombol Edit & Hapus */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(item)} className="px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1 text-sm font-semibold">
                      <span className="material-symbols-outlined text-[16px]">edit</span>Edit
                    </button>
                    <button onClick={() => requestDelete(item.id, item.nama_ikan || 'Data Ikan')} className="w-9 h-9 rounded-full bg-error-container/30 text-error hover:bg-error hover:text-on-error transition-all flex items-center justify-center" title="Hapus">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}    </div>

      {/* Pop-up Success/Error Modal */}
      {toast && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-gutter animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[26rem] shadow-ambient-lg border border-outline-variant animate-fade-in-up text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-lg ${toast.type === 'success' ? 'bg-tertiary/15 text-tertiary' : 'bg-error/15 text-error'
              }`}>
              <span className="material-symbols-outlined text-4xl">
                {toast.type === 'success' ? 'check_circle' : 'error'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-xs">
              {toast.type === 'success' ? 'Berhasil' : 'Gagal'}
            </h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-lg">
              {toast.text}
            </p>
            <button
              onClick={() => setToast(null)}
              className="w-full bg-surface-container-high text-on-surface font-bold py-sm rounded-xl hover:bg-surface-container-highest transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Pop-up Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-gutter animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[28rem] shadow-ambient-lg border border-outline-variant animate-fade-in-up text-center">
            <div className="w-16 h-16 rounded-full bg-error/15 text-error flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-4xl">warning</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-xs">
              Hapus Data?
            </h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-lg">
              Anda yakin ingin menghapus data ikan <strong>&quot;{deleteConfirmTitle}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-sm">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-surface-container text-on-surface font-bold py-sm rounded-xl hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 bg-error text-on-error font-bold py-sm rounded-xl hover:bg-error/90 hover:shadow-md transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Pop-up Image Upload Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-[32px] p-8 w-full max-w-[320px] text-center shadow-ambient-xl animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-error-container/30 mx-auto flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center border-2 border-error">
                <span className="material-symbols-outlined text-[24px] font-bold">close</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2">{errorModal.title}</h3>
            <p className="text-on-surface-variant text-base mb-8">{errorModal.message}</p>
            <button 
              onClick={() => setErrorModal({ show: false, title: '', message: '' })}
              className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold py-3 rounded-full transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
