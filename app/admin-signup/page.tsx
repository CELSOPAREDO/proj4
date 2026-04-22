'use client'

import { useState } from 'react'
import Link from 'next/link'
import { adminSignup } from './actions'
import { Lock, AlertCircle, Eye, EyeOff } from 'griddy-icons'

export default function AdminSignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await adminSignup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-5 pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-900 p-10 shadow-2xl ring-1 ring-white/10 relative z-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
            <Lock size={28} className="text-red-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Admin Registration
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Restricted access — requires a valid admin secret code
          </p>
        </div>

        <form method="POST" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 ring-1 ring-inset ring-red-500/20 flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2" htmlFor="full_name">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Administrator Name"
                required
                className="block w-full rounded-xl border-0 bg-zinc-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@university.edu"
                required
                className="block w-full rounded-xl border-0 bg-zinc-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="block w-full rounded-xl border-0 bg-zinc-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300 block mb-2" htmlFor="secret_code">
                Admin Secret Code
              </label>
              <div className="relative">
                <input
                  id="secret_code"
                  name="secret_code"
                  type={showCode ? 'text' : 'password'}
                  placeholder="Enter the admin secret code"
                  required
                  className="block w-full rounded-xl border-0 bg-zinc-800 py-3 px-4 pr-12 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                >
                  {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-500">This code is set by the system administrator</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer justify-center rounded-xl bg-red-600 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Admin Account...
                </span>
              ) : (
                'Create Admin Account'
              )}
            </button>
          </div>
        </form>

        <p className="flex justify-center text-sm text-zinc-500 gap-1">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-red-400 hover:text-red-300 cursor-pointer transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
