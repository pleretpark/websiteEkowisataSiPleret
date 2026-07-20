'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UMKM } from '@/lib/types'

const emptyForm: Partial<UMKM> = {
  nama_produk: '',
  kategori: 'Makanan',
  harga: 0,
  deskripsi: '',
  gambar_url: '',
  nomor_wa: '',
  nama_toko: '',
}

const categories: UMKM['kategori'][] = ['Makanan', 'Kerajinan', 'Minuman', 'Lainnya']

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(price)
}

export default function AdminUmkmPage() {
  const [items, setItems] = useState<UMKM[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<UMKM>>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('umkm')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch {
      setMessage({ type: 'error', text: 'Gagal memuat data UMKM.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setMessage(null)
  }

  function openEdit(item: UMKM) {
    setForm(item)
    setEditingId(item.id)
    setShowForm(true)
    setMessage(null)
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

    setUploading(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `umkm-${Date.now()}.${fileExt}`

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
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()

      if (editingId) {
        const { error } = await supabase
          .from('umkm')
          .update({
            nama_produk: form.nama_produk,
            kategori: form.kategori,
            harga: form.harga,
            deskripsi: form.deskripsi,
            gambar_url: form.gambar_url,
            nomor_wa: form.nomor_wa,
            nama_toko: form.nama_toko,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)

        if (error) throw error
        setMessage({ type: 'success', text: 'Data UMKM berhasil diperbarui!' })
      } else {
        const { error } = await supabase.from('umkm').insert({
          nama_produk: form.nama_produk,
          kategori: form.kategori,
          harga: form.harga,
          deskripsi: form.deskripsi,
          gambar_url: form.gambar_url,
          nomor_wa: form.nomor_wa,
          nama_toko: form.nama_toko,
        })

        if (error) throw error
        setMessage({ type: 'success', text: 'Data UMKM berhasil ditambahkan!' })
      }

      setShowForm(false)
      fetchItems()
    } catch {
      setMessage({ type: 'error', text: 'Gagal menyimpan data. Periksa koneksi dan coba lagi.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('umkm').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Data berhasil dihapus.' })
      fetchItems()
    } catch {
      setMessage({ type: 'error', text: 'Gagal menghapus data.' })
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg gap-md">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Manajemen UMKM</h1>
          <p className="text-on-surface-variant text-base mt-xs">
            Kelola data produk UMKM Tingkir Tengah.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-primary text-on-primary font-bold px-md py-xs rounded-full hover:shadow-xl transition-all flex items-center gap-xs"
          id="add-umkm-btn"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Tambah UMKM
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-xl p-sm mb-md text-sm flex items-center gap-xs ${
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[42rem] max-h-[90vh] overflow-y-auto shadow-ambient-lg border border-outline-variant animate-fade-in-up">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-xl font-bold text-on-surface">
                {editingId ? 'Edit Data UMKM' : 'Tambah UMKM Baru'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Message inside modal */}
            {message && (
              <div
                className={`rounded-xl p-sm mb-md text-sm flex items-center gap-xs ${
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
                  <label className="block text-sm font-medium text-on-surface mb-xs">
                    Nama Produk *
                  </label>
                  <input
                    required
                    value={form.nama_produk || ''}
                    onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface"
                    placeholder="Ikan Asap Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-xs">
                    Nama Toko *
                  </label>
                  <input
                    required
                    value={form.nama_toko || ''}
                    onChange={(e) => setForm({ ...form, nama_toko: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface"
                    placeholder="Toko Ikan Pak Budi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-xs">
                    Kategori *
                  </label>
                  <select
                    value={form.kategori || 'Makanan'}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value as UMKM['kategori'] })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-xs">
                    Harga (Rp) *
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.harga || ''}
                    onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface"
                    placeholder="45000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-xs">
                  Nomor WhatsApp *
                </label>
                <input
                  required
                  value={form.nomor_wa || ''}
                  onChange={(e) => setForm({ ...form, nomor_wa: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface"
                  placeholder="6281234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-xs">
                  Deskripsi *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.deskripsi || ''}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface resize-none"
                  placeholder="Deskripsi singkat produk..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-xs">
                  Foto Produk
                </label>
                <div className="flex items-center gap-md">
                  <label className="cursor-pointer bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 hover:bg-surface-container-high transition-colors flex items-center gap-xs text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {uploading ? 'Mengunggah...' : 'Pilih Gambar'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                  {form.gambar_url && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                      <Image src={form.gambar_url} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
                <input
                  value={form.gambar_url || ''}
                  onChange={(e) => setForm({ ...form, gambar_url: e.target.value })}
                  className="w-full mt-xs bg-surface-container-low border border-outline-variant rounded-xl px-md py-2 text-sm focus:ring-2 focus:ring-primary text-on-surface"
                  placeholder="Atau masukkan URL gambar..."
                />
              </div>

              <div className="flex justify-end gap-sm pt-md">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-xl py-xs rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-on-primary font-bold px-xl py-xs rounded-full hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-xs"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-xl text-center">
            <span className="material-symbols-outlined text-4xl text-outline animate-pulse">
              hourglass_empty
            </span>
            <p className="text-on-surface-variant mt-sm">Memuat data...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-xl text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant">
              inventory_2
            </span>
            <p className="text-on-surface-variant text-lg mt-md">Belum ada data UMKM.</p>
            <p className="text-outline text-sm mt-xs">
              Klik tombol &quot;Tambah UMKM&quot; untuk menambah data baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="text-left px-md py-sm text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="text-left px-md py-sm text-sm font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">
                    Kategori
                  </th>
                  <th className="text-left px-md py-sm text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="text-left px-md py-sm text-sm font-semibold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">
                    Toko
                  </th>
                  <th className="text-right px-md py-sm text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-md py-sm">
                      <div className="flex items-center gap-sm">
                        {item.gambar_url && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.gambar_url} alt={item.nama_produk} fill className="object-cover" />
                          </div>
                        )}
                        <span className="font-medium text-on-surface text-sm">
                          {item.nama_produk}
                        </span>
                      </div>
                    </td>
                    <td className="px-md py-sm hidden md:table-cell">
                      <span className="text-sm text-on-surface-variant bg-surface-container-high px-sm py-1 rounded-full">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-md py-sm text-sm font-semibold text-primary">
                      {formatPrice(item.harga)}
                    </td>
                    <td className="px-md py-sm text-sm text-on-surface-variant hidden lg:table-cell">
                      {item.nama_toko}
                    </td>
                    <td className="px-md py-sm text-right">
                      <div className="flex items-center justify-end gap-xs">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 rounded-lg bg-primary-fixed/20 text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 rounded-lg bg-error-container/30 text-error hover:bg-error hover:text-on-error transition-all flex items-center justify-center"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
