'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Berita } from '@/lib/types'

const emptyForm: Partial<Berita> = {
  judul: '', konten: '', author: '', tanggal_publikasi: new Date().toISOString().split('T')[0],
  foto_cover: '', is_sorotan: false,
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export default function AdminBeritaPage() {
  const [items, setItems] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Berita>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev))
    }, 4000)
  }, [])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Batasi ukuran file maksimal 1 MB (1.048.576 bytes)
    const maxFileSize = 1 * 1024 * 1024
    if (file.size > maxFileSize) {
      showToast('error', 'Ukuran file gambar terlalu besar. Maksimal ukuran file adalah 1 MB.')
      e.target.value = ''
      return
    }

    setLocalPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `berita-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      setForm((prev) => ({ ...prev, foto_cover: publicUrl }))
    } catch (err: any) {
      console.error('Upload error:', err)
      showToast('error', 'Gagal mengunggah gambar. Pastikan format gambar didukung.')
    } finally {
      setUploading(false)
    }
  }

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('berita').select('*').order('tanggal_publikasi', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch {
      showToast('error', 'Gagal memuat data berita.')
    } finally { setLoading(false) }
  }, [showToast])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openCreate() { 
    setForm({ ...emptyForm, tanggal_publikasi: new Date().toISOString().split('T')[0] }); 
    setEditingId(null); 
    setShowForm(true); 
    setToast(null);
    setLocalPreview(null);
  }
  function openEdit(item: Berita) { 
    setForm({ ...item, tanggal_publikasi: item.tanggal_publikasi?.split('T')[0] || '' }); 
    setEditingId(item.id); 
    setShowForm(true); 
    setToast(null);
    setLocalPreview(item.foto_cover || null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setToast(null)
    try {
      const supabase = createClient()
      const slug = form.judul ? generateSlug(form.judul) : ''
      const finalImageUrl = form.foto_cover || '/images/sosialisasi.jpg'
      const payload = {
        judul: form.judul, konten: form.konten, author: form.author,
        tanggal_publikasi: form.tanggal_publikasi, foto_cover: finalImageUrl,
        is_sorotan: form.is_sorotan,
        slug: slug,
      }
      if (editingId) {
        const { error } = await supabase.from('berita').update(payload).eq('id', editingId)
        if (error) throw error
        showToast('success', 'Artikel berhasil diperbarui!')
      } else {
        const { error } = await supabase.from('berita').insert(payload)
        if (error) throw error
        showToast('success', 'Artikel berhasil ditambahkan!')
      }
      setShowForm(false); fetchItems()
    } catch {
      showToast('error', 'Gagal menyimpan data.')
    } finally { setSaving(false) }
  }

  function requestDelete(id: string, title: string) {
    setDeleteConfirmId(id)
    setDeleteConfirmTitle(title)
  }

  async function confirmDelete() {
    if (!deleteConfirmId) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from('berita').delete().eq('id', deleteConfirmId)
      if (error) throw error
      showToast('success', 'Artikel berhasil dihapus.')
      fetchItems()
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
          <h1 className="text-5xl font-bold text-on-surface">Berita & Artikel</h1>
          <p className="text-on-surface-variant text-xl mt-xs">Kelola konten berita dan artikel informatif.</p>
        </div>
        <button onClick={openCreate} className="bg-primary text-on-primary font-bold px-md py-xs rounded-full hover:shadow-xl transition-all flex items-center gap-xs" id="add-berita-btn">
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          Tulis Artikel Baru
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[48rem] max-h-[90vh] overflow-y-auto shadow-ambient-lg border border-outline-variant animate-fade-in-up">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-3xl font-bold text-on-surface">{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">Judul Artikel *</label>
                <input required value={form.judul || ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface text-2xl font-semibold" placeholder="Masukkan judul artikel..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Penulis *</label>
                  <input required value={form.author || ''} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" placeholder="Nama penulis" />
                </div>
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Tanggal Publikasi *</label>
                  <input required type="date" value={form.tanggal_publikasi || ''} onChange={(e) => setForm({ ...form, tanggal_publikasi: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" />
                </div>
                <div>
                  <label className="block text-lg font-medium text-on-surface mb-xs">Sorotan Berita</label>
                  <label className="flex items-center gap-xs bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 cursor-pointer">
                    <input type="checkbox" checked={form.is_sorotan || false} onChange={(e) => setForm({ ...form, is_sorotan: e.target.checked })} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                    <span className="text-on-surface text-lg">Jadikan Sorotan Utama</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">
                  Foto Sampul Artikel
                </label>
                <div className="flex items-center gap-md">
                  <label className="cursor-pointer bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 hover:bg-surface-container-high transition-colors flex items-center gap-xs text-lg text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {uploading ? 'Mengunggah...' : 'Pilih Gambar'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                  {(localPreview || form.foto_cover) && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant flex-shrink-0">
                      <img src={localPreview || form.foto_cover || ''} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <p className="text-base text-outline mt-xs">Maksimal ukuran file: 1 MB. Format: JPG, PNG, WebP.</p>
              </div>
              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">Konten Artikel *</label>
                <textarea required rows={10} value={form.konten || ''} onChange={(e) => setForm({ ...form, konten: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface resize-none leading-relaxed" placeholder="Tulis konten artikel di sini..." />
              </div>
              <div className="flex justify-end gap-sm pt-md">
                <button type="button" onClick={() => setShowForm(false)} className="px-xl py-xs rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">Batal</button>
                <button type="submit" disabled={saving || uploading} className="bg-primary text-on-primary font-bold px-xl py-xs rounded-full hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-xs">
                  {saving ? <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Menyimpan...</> : <><span className="material-symbols-outlined text-[16px]">save</span>Publikasikan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-md">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest rounded-3xl p-md border border-outline-variant flex gap-md">
              <div className="w-40 h-28 rounded-xl animate-shimmer flex-shrink-0" />
              <div className="flex-1 space-y-xs">
                <div className="h-5 w-3/4 rounded animate-shimmer" />
                <div className="h-4 w-full rounded animate-shimmer" />
                <div className="h-4 w-1/2 rounded animate-shimmer" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="text-center py-xl bg-surface-container-lowest rounded-3xl border border-outline-variant">
            <span className="material-symbols-outlined text-6xl text-outline-variant">article</span>
            <p className="text-on-surface-variant text-2xl mt-md">Belum ada artikel.</p>
            <p className="text-outline text-lg mt-xs">Klik &quot;Tulis Artikel Baru&quot; untuk mulai menulis.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden hover:shadow-ambient transition-all flex flex-col md:flex-row">
              <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0 bg-surface-container">
                <Image src={item.foto_cover && !item.foto_cover.includes('unsplash') ? item.foto_cover : '/images/sosialisasi.jpg'} alt={item.judul} fill className="object-cover" />
              </div>
              <div className="flex-1 p-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-sm mb-xs">
                    {item.is_sorotan && (
                      <span className="text-base px-sm py-0.5 rounded-full font-bold bg-tertiary text-on-tertiary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">star</span> SOROTAN
                      </span>
                    )}
                    <span className="text-base text-outline">
                      {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-on-surface text-2xl leading-tight">{item.judul}</h3>
                  <p className="text-lg text-on-surface-variant mt-1 line-clamp-2">{item.konten}</p>
                  <p className="text-base text-outline mt-2">Oleh: {item.author}</p>
                </div>
                <div className="flex items-center justify-end gap-xs mt-md">
                  <button onClick={() => openEdit(item)} className="px-md py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center gap-xs text-lg">
                    <span className="material-symbols-outlined text-[16px]">edit</span>Edit
                  </button>
                  <button onClick={() => requestDelete(item.id, item.judul)} className="w-8 h-8 rounded-lg bg-error-container/30 text-error hover:bg-error hover:text-on-error transition-all flex items-center justify-center" title="Hapus">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pop-up Success/Error Modal */}
      {toast && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-gutter animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[26rem] shadow-ambient-lg border border-outline-variant animate-fade-in-up text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-lg ${
              toast.type === 'success' ? 'bg-tertiary/15 text-tertiary' : 'bg-error/15 text-error'
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
              className="w-full py-xs rounded-full bg-primary text-on-primary hover:shadow-lg transition-all text-lg font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Custom Deletion Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-gutter animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[28rem] shadow-ambient-lg border border-outline-variant animate-fade-in-up text-center">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-4xl">warning</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-xs">Hapus Artikel?</h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-lg">
              Apakah Anda yakin ingin menghapus artikel <span className="font-semibold text-on-surface">&quot;{deleteConfirmTitle}&quot;</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-sm">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-xs rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all text-lg font-semibold"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-xs rounded-full bg-error text-on-error hover:bg-error/90 shadow-md hover:shadow-lg transition-all text-lg font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

