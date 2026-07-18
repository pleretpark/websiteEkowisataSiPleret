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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('berita').select('*').order('tanggal_publikasi', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch {
      setMessage({ type: 'error', text: 'Gagal memuat data berita.' })
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openCreate() { setForm({ ...emptyForm, tanggal_publikasi: new Date().toISOString().split('T')[0] }); setEditingId(null); setShowForm(true); setMessage(null) }
  function openEdit(item: Berita) { setForm({ ...item, tanggal_publikasi: item.tanggal_publikasi?.split('T')[0] || '' }); setEditingId(item.id); setShowForm(true); setMessage(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMessage(null)
    try {
      const supabase = createClient()
      const slug = form.judul ? generateSlug(form.judul) : ''
      const payload = {
        judul: form.judul, konten: form.konten, author: form.author,
        tanggal_publikasi: form.tanggal_publikasi, foto_cover: form.foto_cover,
        is_sorotan: form.is_sorotan,
        slug: slug,
      }
      if (editingId) {
        const { error } = await supabase.from('berita').update(payload).eq('id', editingId)
        if (error) throw error
        setMessage({ type: 'success', text: 'Artikel berhasil diperbarui!' })
      } else {
        const { error } = await supabase.from('berita').insert(payload)
        if (error) throw error
        setMessage({ type: 'success', text: 'Artikel berhasil ditambahkan!' })
      }
      setShowForm(false); fetchItems()
    } catch {
      setMessage({ type: 'error', text: 'Gagal menyimpan data.' })
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from('berita').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Artikel berhasil dihapus.' })
      fetchItems()
    } catch { setMessage({ type: 'error', text: 'Gagal menghapus data.' }) }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg gap-md">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Berita & Artikel</h1>
          <p className="text-on-surface-variant text-base mt-xs">Kelola konten berita dan artikel informatif.</p>
        </div>
        <button onClick={openCreate} className="bg-primary text-on-primary font-bold px-md py-xs rounded-full hover:shadow-xl transition-all flex items-center gap-xs" id="add-berita-btn">
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          Tulis Artikel Baru
        </button>
      </div>

      {message && (
        <div className={`rounded-xl p-sm mb-md text-sm flex items-center gap-xs ${message.type === 'success' ? 'bg-tertiary-fixed/30 text-tertiary' : 'bg-error-container text-on-error-container'}`}>
          <span className="material-symbols-outlined text-[18px]">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          {message.text}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[48rem] max-h-[90vh] overflow-y-auto shadow-ambient-lg border border-outline-variant animate-fade-in-up">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-xl font-bold text-on-surface">{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-xs">Judul Artikel *</label>
                <input required value={form.judul || ''} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface text-lg font-semibold" placeholder="Masukkan judul artikel..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-xs">Penulis *</label>
                  <input required value={form.author || ''} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" placeholder="Nama penulis" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-xs">Tanggal Publikasi *</label>
                  <input required type="date" value={form.tanggal_publikasi || ''} onChange={(e) => setForm({ ...form, tanggal_publikasi: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-xs">Sorotan Berita</label>
                  <label className="flex items-center gap-xs bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 cursor-pointer">
                    <input type="checkbox" checked={form.is_sorotan || false} onChange={(e) => setForm({ ...form, is_sorotan: e.target.checked })} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                    <span className="text-on-surface text-sm">Jadikan Sorotan Utama</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-xs">URL Gambar Sampul (foto_cover)</label>
                <input value={form.foto_cover || ''} onChange={(e) => setForm({ ...form, foto_cover: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface" placeholder="https://example.com/cover.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-xs">Konten Artikel *</label>
                <textarea required rows={10} value={form.konten || ''} onChange={(e) => setForm({ ...form, konten: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface resize-none leading-relaxed" placeholder="Tulis konten artikel di sini..." />
              </div>
              <div className="flex justify-end gap-sm pt-md">
                <button type="button" onClick={() => setShowForm(false)} className="px-xl py-xs rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">Batal</button>
                <button type="submit" disabled={saving} className="bg-primary text-on-primary font-bold px-xl py-xs rounded-full hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-xs">
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
            <span className="material-symbols-outlined text-5xl text-outline-variant">article</span>
            <p className="text-on-surface-variant text-lg mt-md">Belum ada artikel.</p>
            <p className="text-outline text-sm mt-xs">Klik &quot;Tulis Artikel Baru&quot; untuk mulai menulis.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden hover:shadow-ambient transition-all flex flex-col md:flex-row">
              {item.foto_cover ? (
                <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                  <Image src={item.foto_cover} alt={item.judul} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full md:w-48 h-40 md:h-auto bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl text-outline">image</span>
                </div>
              )}
              <div className="flex-1 p-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-sm mb-xs">
                    {item.is_sorotan && (
                      <span className="text-xs px-sm py-0.5 rounded-full font-bold bg-tertiary text-on-tertiary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">star</span> SOROTAN
                      </span>
                    )}
                    <span className="text-xs text-outline">
                      {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-on-surface text-lg leading-tight">{item.judul}</h3>
                  <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{item.konten}</p>
                  <p className="text-xs text-outline mt-2">Oleh: {item.author}</p>
                </div>
                <div className="flex items-center justify-end gap-xs mt-md">
                  <button onClick={() => openEdit(item)} className="px-md py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center gap-xs text-sm">
                    <span className="material-symbols-outlined text-[16px]">edit</span>Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg bg-error-container/30 text-error hover:bg-error hover:text-on-error transition-all flex items-center justify-center" title="Hapus">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
