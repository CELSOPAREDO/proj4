'use client'

import { useState } from 'react'
import Link from 'next/link'
import { adminLogin } from './actions'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await adminLogin(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/30 via-zinc-950 to-zinc-950"></div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header Badge */}
        <div className="text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/10 ring-1 ring-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <span className="text-4xl">🛡️</span>
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Restricted access — authorized administrators only
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-zinc-900 p-8 shadow-2xl ring-1 ring-white/10">
          <form method="POST" className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 ring-1 ring-inset ring-red-500/30">
                <span className="text-lg leading-none mt-0.5">🚫</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="admin-email">
                Admin Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                placeholder="admin@university.edu"
                required
                className="block w-full rounded-xl border-0 bg-zinc-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm transition-all"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="block w-full rounded-xl border-0 bg-zinc-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full cursor-pointer justify-center items-center gap-2 rounded-xl bg-red-600 px-3 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(239,68,68,0.35)] hover:bg-red-700 hover:shadow-[0_6px_20px_rgba(239,68,68,0.25)] hover:-translate-y-0.5 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying credentials...
                </>
              ) : (
                <>🔐 Sign in as Administrator</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-zinc-600">
            Not an admin?{' '}
            <Link href="/login" className="font-semibold text-zinc-400 hover:text-white transition-colors">
              Student Login →
            </Link>
          </p>
          <p className="text-sm text-zinc-700">
            Need an admin account?{' '}
            <Link href="/admin-signup" className="font-semibold text-red-600 hover:text-red-400 transition-colors">
              Admin Registration →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
