'use client'

import { useState } from 'react'
import { signup } from './actions'
import Link from 'next/link'

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

export default function SignupPage() {
  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const [infoStatus, setInfoStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorStatus(null)
    setInfoStatus(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm_password = formData.get('confirm_password') as string
    if (password !== confirm_password) {
      setErrorStatus('Passwords do not match.')
      setLoading(false)
      return
    }

    const result = await signup(formData)

    if (result?.error) {
      setErrorStatus(result.error)
      setLoading(false)
      return
    }
    if (result?.info) {
      setInfoStatus(result.info)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans selection:bg-blue-200">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900">
            Join the Experience
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Create a student account to discover events
          </p>
        </div>

        <form method="POST" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {infoStatus && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 ring-1 ring-inset ring-blue-500/20">
              {infoStatus}
            </div>
          )}
          {errorStatus && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-500/20">
              {errorStatus}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium leading-none text-zinc-700 block mb-2" htmlFor="full_name">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium leading-none text-zinc-700 block mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@university.edu"
                className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium leading-none text-zinc-700 block mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="block w-full rounded-xl border-0 py-3 pl-4 pr-12 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-zinc-500 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={!showPassword} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium leading-none text-zinc-700 block mb-2" htmlFor="confirm_password">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="block w-full rounded-xl border-0 py-3 pl-4 pr-12 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-zinc-500 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <EyeIcon open={!showConfirmPassword} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer justify-center rounded-xl bg-zinc-900 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 flex justify-center text-sm text-zinc-500 gap-1">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  )
}
