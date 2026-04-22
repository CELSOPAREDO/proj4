import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('=== ADMIN DASHBOARD DEBUG ===')
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

  if (role !== 'admin') {
    console.log('Redirecting to /login because role is not admin')
    redirect('/login')
  }

  // Fetch counts
  const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: studentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student')
  
  // Fetch recent events
  const { data: recentEvents } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-500 mt-1">Overview of all events and participants.</p>
          </div>
          <Link href="/admin/events/new" className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-all duration-200">
             <span className="mr-2">+</span> Create Event
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-zinc-500 flex items-center gap-2">
              <span className="text-lg">📅</span> Total Events
            </h3>
            <p className="mt-4 text-4xl font-bold text-zinc-900">{eventsCount || 0}</p>
          </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-zinc-500 flex items-center gap-2">
              <span className="text-lg">👥</span> Total Students
            </h3>
            <p className="mt-4 text-4xl font-bold text-zinc-900">{studentsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">Recent Events</h2>
            <Link href="/admin/events" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View all</Link>
          </div>
          
          {recentEvents && recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-zinc-100 transition-colors">
                  <div>
                    <h4 className="font-semibold text-zinc-900">{event.title}</h4>
                    <p className="text-sm text-zinc-500 mt-1">📅 {new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <Link href={`/admin/events/${event.id}/edit`} className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Edit</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center rounded-xl bg-zinc-50 border border-dashed border-zinc-200">
              <p className="text-sm font-medium text-zinc-900">No events found</p>
              <p className="text-sm text-zinc-500 mt-1">Create your first event to start managing registrations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
