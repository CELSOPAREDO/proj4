'use client'

import { useState } from 'react'
import { updateProfile } from './actions'

export default function ProfileForm({
  initialFullName,
  initialStudentId,
  email,
  role,
}: {
  initialFullName: string
  initialStudentId: string
  email: string
  role: string
}) {
  const [fullName, setFullName] = useState(initialFullName)
  const [studentId, setStudentId] = useState(initialStudentId)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const formData = new FormData()
    formData.set('full_name', fullName)
    formData.set('student_id', studentId)

    const result = await updateProfile(formData)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && (
        <div
          className={`rounded-xl p-4 text-sm ring-1 ring-inset ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 ring-green-500/20'
              : 'bg-red-50 text-red-600 ring-red-500/20'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="profile_full_name">
          Full Name
        </label>
        <input
          id="profile_full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="profile_student_id">
          Student ID
        </label>
        <input
          id="profile_student_id"
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g. 2026-00001"
          className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-400 bg-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-200 sm:text-sm cursor-not-allowed"
        />
        <p className="text-xs text-zinc-400 mt-1.5">Email cannot be changed</p>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">
          Role
        </label>
        <input
          type="text"
          value={role === 'admin' ? 'Administrator' : 'Student'}
          disabled
          className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-400 bg-zinc-50 shadow-sm ring-1 ring-inset ring-zinc-200 sm:text-sm cursor-not-allowed"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex w-full cursor-pointer justify-center rounded-xl bg-zinc-900 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  )
}
