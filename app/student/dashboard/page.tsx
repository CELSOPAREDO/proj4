import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('=== STUDENT DASHBOARD DEBUG ===')
  console.log('User found:', !!user)
  if (userError) console.log('User Error:', userError)

  if (!user) {
    console.log('Redirecting to /login because user is null')
    redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  console.log('Profile found:', !!profile, '| Role:', profile?.role)
  if (profileError) console.log('Profile Error:', profileError)

  const role = profile?.role || user.user_metadata?.role || 'student'

  if (role !== 'student') {
    console.log('Redirecting to /admin/dashboard because role is not student')
    redirect('/admin/dashboard')
  }

  // Fetch ALL events
  const { data: allEvents } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  const now = new Date().toISOString()
  const upcomingEvents = allEvents?.filter(e => e.date > now) || []
  const pastEvents = allEvents?.filter(e => e.date <= now) || []

  // Fetch the user's registrations
  const { data: registrations } = await supabase
    .from('registrations')
    .select('event_id')
    .eq('student_id', user.id)
    
  const registeredEventIds = new Set(registrations?.map(r => r.event_id) || [])

  const EventCard = ({ event, isPast }: { event: any; isPast: boolean }) => {
    const isRegistered = registeredEventIds.has(event.id)
    return (
      <div className={`border rounded-2xl p-6 flex flex-col justify-between group transition-colors ${isPast ? 'border-zinc-100 bg-zinc-50/50 opacity-75' : 'border-zinc-200 hover:border-blue-300'}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-lg font-bold ${isPast ? 'text-zinc-500' : 'text-zinc-900 group-hover:text-blue-600'} transition-colors`}>{event.title}</h3>
            {isPast && <span className="text-xs bg-zinc-200 text-zinc-500 px-2 py-0.5 rounded-full font-medium">Ended</span>}
          </div>
          <div className="space-y-1.5 mb-4">
            <p className="text-sm text-zinc-500 flex items-center gap-2">
              <span>📅</span> {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
            <p className="text-sm text-zinc-500 flex items-center gap-2">
              <span>📍</span> {event.location}
            </p>
          </div>
          <p className="text-sm text-zinc-600 line-clamp-3 mb-4">{event.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-100">
          {isRegistered ? (
            <div className="w-full text-center py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex justify-center items-center gap-2 ring-1 ring-inset ring-green-500/20">
              <span>✅</span> Registered
            </div>
          ) : isPast ? (
            <div className="w-full text-center py-2.5 bg-zinc-100 text-zinc-400 rounded-xl text-sm font-medium">
              Event has ended
            </div>
          ) : (
            <Link href={`/student/events/${event.id}`} className="block w-full text-center py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all duration-200 active:scale-[0.98]">
              View & Register
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Student Dashboard</h1>
          <p className="text-zinc-500 mt-1">Discover upcoming university events and register today.</p>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Upcoming Events</h2>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast={false} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-xl bg-zinc-50 border border-dashed border-zinc-200">
              <span className="text-5xl mb-4 block opacity-50">📅</span>
              <p className="text-base font-semibold text-zinc-900">No upcoming events</p>
              <p className="text-sm text-zinc-500 mt-1">Check back later when organizers post new events.</p>
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Past Events</h2>
              <span className="text-sm text-zinc-400">{pastEvents.length} event{pastEvents.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
