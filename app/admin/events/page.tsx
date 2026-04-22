import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { deleteEvent } from './actions'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  
  // Fetch events ordered by date descending
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })

  return (
    <div className="p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Manage Events</h1>
            <p className="text-zinc-500 mt-1">View, edit, or remove upcoming and past events.</p>
          </div>
          <Link href="/admin/events/new" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
             <span className="mr-2">+</span> New Event
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          {events && events.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {events.map((event) => (
                <div key={event.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-zinc-50 transition-colors group">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1.5"><span className="text-lg">📅</span> {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span className="flex items-center gap-1.5"><span className="text-lg">📍</span> {event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/events/${event.id}/edit`} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-xl transition-colors">
                      Edit
                    </Link>
                    <form action={async () => {
                      'use server'
                      await deleteEvent(event.id)
                    }}>
                      <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center flex flex-col items-center">
              <span className="text-5xl mb-4 block">📅</span>
              <p className="text-lg font-semibold text-zinc-900">No events yet</p>
              <p className="text-sm text-zinc-500 mt-2 mb-8 max-w-sm mx-auto">Get started by creating your very first event to manage your student registrations.</p>
              <Link href="/admin/events/new" className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors">
                 Create First Event
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
