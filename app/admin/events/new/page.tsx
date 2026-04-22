'use client'

import { useState } from 'react'
import { createEvent } from '../actions'
import Link from 'next/link'

export default function CreateEventPage() {
  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorStatus(null)

    const formData = new FormData(e.currentTarget)
    const result = await createEvent(formData)
    
    if (result?.error) {
      setErrorStatus(result.error)
      setLoading(false)
    }
    // if successful, it redirects via server action
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Create New Event</h1>
            <p className="text-zinc-500 mt-1">Fill in the details below to add a new event to the calendar.</p>
          </div>
          <Link href="/admin/events" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-xl transition-colors">
            Cancel
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorStatus && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-500/20">
                {errorStatus}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="title">Event Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Annual Tech Symposium 2026"
                  required
                  className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="date">Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="time">Time</label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Main Auditorium"
                  required
                  className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="description">Event Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Provide details about the event, what to expect, etc."
                  className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
