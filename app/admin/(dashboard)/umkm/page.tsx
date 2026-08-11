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
  gambar_urls: [],
  nomor_wa: '',
  nama_toko: '',
}

const categories: UMKM['kategori'][] = ['Makanan', 'Kerajinan', 'Minuman', 'Lainnya']

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

function formatPhoneDisplay(phone: string) {
  if (!phone) return ''

  const cleaned = phone.replace(/\D/g, '')

  if (!cleaned.startsWith('62')) return cleaned

  const number = cleaned.slice(2)

  const part1 = number.slice(0, 3)
  const part2 = number.slice(3, 7)
  const part3 = number.slice(7, 11)

  let result = '+62'

  if (part1) result += ` ${part1}`
  if (part2) result += `-${part2}`
  if (part3) result += `-${part3}`

  return result
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
  const [localPreview, setLocalPreview] = useState<string[]>([])

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
    setLocalPreview([])
  }

  function openEdit(item: UMKM) {
    setForm(item)
    setEditingId(item.id)
    setShowForm(true)
    setMessage(null)
    setLocalPreview([])
  }

async function handleFileUpload(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const files = Array.from(e.target.files || [])

  if (!files.length) return

  setUploading(true)
  setMessage(null)

  try {
    const supabase = createClient()

    const uploadedUrls: string[] = []
    const previews: string[] = []

    for (const file of files) {
      const maxFileSize = 5 * 1024 * 1024

      if (file.size > maxFileSize) {
        continue
      }

      previews.push(URL.createObjectURL(file))

      const fileExt = file.name.split('.').pop()

      const fileName =
        `umkm-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      uploadedUrls.push(publicUrl)
    }

    setLocalPreview(previews)

    setForm((prev) => ({
  ...prev,

  gambar_url:
    prev.gambar_url ||
    uploadedUrls[0],

  gambar_urls: [
    ...(prev.gambar_urls || []),
    ...uploadedUrls,
  ],
}))

    setMessage({
      type: 'success',
      text: `${uploadedUrls.length} gambar berhasil diunggah`,
    })
  } catch (err) {
    console.error(err)

    setMessage({
      type: 'error',
      text: 'Gagal upload gambar',
    })
  } finally {
    setUploading(false)
  }
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    let finalImageUrl = form.gambar_url
    if (!finalImageUrl) {
      if (form.kategori === 'Makanan') finalImageUrl = '/images/makanan.jpg'
      else if (form.kategori === 'Minuman') finalImageUrl = '/images/minuman.jpg'
      else if (form.kategori === 'Kerajinan') finalImageUrl = '/images/kerajinan.jpg'
      else finalImageUrl = '/images/lainnya.jpg'
    }

    if ((form.deskripsi || '').length > 600) {
  setMessage({
    type: 'error',
    text: 'Deskripsi maksimal 600 karakter.',
  })
  setSaving(false)
  return
}

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
            gambar_url: finalImageUrl,
            gambar_urls: form.gambar_urls || [],
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
          gambar_url: finalImageUrl,
          gambar_urls: form.gambar_urls || [],
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
          <h1 className="text-5xl font-bold text-on-surface">Manajemen UMKM</h1>
          <p className="text-on-surface-variant text-xl mt-xs">
            Kelola data produk UMKM Tingkir Tengah.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-primary text-on-primary font-bold px-md py-xs rounded-full hover:shadow-xl transition-all flex items-center gap-xs"
          id="add-umkm-btn"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Tambah Produk
        </button>
      </div>

      {/* Message */}
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-gutter">
          <div className="bg-surface-container-lowest rounded-3xl p-xl w-full max-w-[42rem] max-h-[90vh] overflow-y-auto shadow-ambient-lg border border-outline-variant animate-fade-in-up">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-3xl font-bold text-on-surface">
                {editingId ? 'Edit Data UMKM' : 'Tambah Produk Baru'}
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
                  <label className="block text-lg font-medium text-on-surface mb-xs">
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
                  <label className="block text-lg font-medium text-on-surface mb-xs">
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
                  <label className="block text-lg font-medium text-on-surface mb-xs">
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
                  <label className="block text-lg font-medium text-on-surface mb-xs">
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
                <label className="block text-lg font-medium text-on-surface mb-xs">
                  Nomor WhatsApp *
                </label>
<input
  required
  value={formatPhoneDisplay(form.nomor_wa || '')}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.startsWith('0')) {
      value = '62' + value.slice(1)
    }

    setForm({
      ...form,
      nomor_wa: value.slice(0, 15),
    })
  }}
  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface"
  placeholder="+62 812-3456-7890"
/>
              </div>

              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">
                  Deskripsi *
                </label>
<textarea
  required
  rows={4}
  maxLength={600}
  value={form.deskripsi || ''}
  onChange={(e) =>
    setForm({
      ...form,
      deskripsi: e.target.value.slice(0, 600),
    })
  }
  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary text-on-surface resize-none"
  placeholder="Deskripsi singkat produk..."
/>

<div className="text-sm text-on-surface-variant text-right mt-1">
  {(form.deskripsi || '').length}/600 karakter
</div>
</div>

              <div>
                <label className="block text-lg font-medium text-on-surface mb-xs">
                  Foto Produk
                </label>
                <div className="flex items-center gap-md">
                  <label className="cursor-pointer bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 hover:bg-surface-container-high transition-colors flex items-center gap-xs text-lg text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {uploading ? 'Mengunggah...' : 'Pilih Gambar'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <label className="cursor-pointer bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 hover:bg-surface-container-high transition-colors flex items-center gap-xs text-lg text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    {uploading ? 'Mengunggah...' : 'Buka Kamera'}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {(localPreview || form.gambar_url) && (
                    <div className="flex flex-wrap gap-2">
  {localPreview.map((img, i) => (
    <img
      key={i}
      src={img}
      alt=""
      className="w-24 h-24 object-cover rounded-xl"
    />
  ))}
</div>
                  )}
                </div>
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
            <span className="material-symbols-outlined text-6xl text-outline animate-pulse">
              hourglass_empty
            </span>
            <p className="text-on-surface-variant mt-sm">Memuat data...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-xl text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant">
              inventory_2
            </span>
            <p className="text-on-surface-variant text-2xl mt-md">Belum ada data UMKM.</p>
            <p className="text-outline text-lg mt-xs">
              Klik tombol &quot;Tambah Produk&quot; untuk menambah data baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="text-left px-md py-sm text-lg font-semibold text-on-surface-variant uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="text-left px-md py-sm text-lg font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">
                    Kategori
                  </th>
                  <th className="text-left px-md py-sm text-lg font-semibold text-on-surface-variant uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="text-left px-md py-sm text-lg font-semibold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">
                    Toko
                  </th>
                  <th className="text-right px-md py-sm text-lg font-semibold text-on-surface-variant uppercase tracking-wider">
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
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                            <Image src={!item.gambar_url.includes('unsplash') ? item.gambar_url : `/images/${item.kategori.toLowerCase()}.jpg`} alt={item.nama_produk} fill className="object-cover" />
                          </div>
                        )}
                        <span className="font-medium text-on-surface text-lg">
                          {item.nama_produk}
                        </span>
                      </div>
                    </td>
                    <td className="px-md py-sm hidden md:table-cell">
                      <span className="text-lg text-on-surface-variant bg-surface-container-high px-sm py-1 rounded-full">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-md py-sm text-lg font-semibold text-primary">
                      {formatPrice(item.harga)}
                    </td>
                    <td className="px-md py-sm text-lg text-on-surface-variant hidden lg:table-cell">
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
