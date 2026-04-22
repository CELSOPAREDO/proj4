import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateEvent } from '../../actions'

export default async function EditEventPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  const { data: event } = await supabase.from('events').select('*').eq('id', params.id).single()

  if (!event) redirect('/admin/events')

  const eventDate = new Date(event.date)
  const dateString = eventDate.toISOString().split('T')[0]
  const timeString = eventDate.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })

  // Action bound to the ID
  const updateEventWithId = updateEvent.bind(null, event.id)

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Edit Event</h1>
            <p className="text-zinc-500 mt-1">Update the details for this event below.</p>
          </div>
          <Link href="/admin/events" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-xl transition-colors">
            Cancel
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
          <form action={updateEventWithId} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="title">Event Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={event.title}
                  required
                  className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="date">Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={dateString}
                    required
                    className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="time">Time</label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    defaultValue={timeString}
                    required
                    className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={event.location}
                  required
                  className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-2" htmlFor="description">Event Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={event.description || ''}
                  className="block w-full rounded-xl border-0 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all duration-200"
              >
                Update Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
