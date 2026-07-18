'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Email atau password salah. Silakan coba lagi.')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Terjadi kesalahan. Pastikan koneksi internet Anda stabil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-gutter">
      <div className="w-full max-w-[28rem]">
        {/* Logo / Brand */}
        <div className="text-center mb-xl">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-md shadow-ambient">
            <span className="material-symbols-outlined text-3xl text-on-primary">
              admin_panel_settings
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Admin Portal</h1>
          <p className="text-on-surface-variant text-base mt-xs">
            Tingkir Tengah
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-surface-container-lowest rounded-3xl p-lg border border-outline-variant shadow-ambient"
        >
          <h2 className="text-xl font-semibold text-on-surface mb-lg">
            Masuk ke Dashboard
          </h2>

          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl p-sm mb-md text-sm flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <div className="space-y-md">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-on-surface mb-xs"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tingkirtengah.id"
                required
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface placeholder:text-outline transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-on-surface mb-xs"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-3 focus:ring-2 focus:ring-primary focus:border-primary text-on-surface placeholder:text-outline transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-xs"
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Memproses...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  Masuk
                </>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-outline mt-lg">
            Hanya admin yang berwenang yang dapat mengakses dashboard.
          </p>
        </form>

        {/* Back to Home */}
        <div className="text-center mt-md">
          <a
            href="/"
            className="text-primary font-medium hover:underline text-sm flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  )
}
