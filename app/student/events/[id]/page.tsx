import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { registerForEvent } from '../../actions'
import { QRCodeSVG } from 'qrcode.react'

export default async function StudentEventDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: event } = await supabase.from('events').select('*').eq('id', params.id).single()
  if (!event) redirect('/student/dashboard')

  // Check if they are already registered — fetch full registration for QR
  const { data: existingReg } = await supabase
    .from('registrations')
    .select('id, qr_code_data, status, created_at')
    .eq('event_id', params.id)
    .eq('student_id', user.id)
    .maybeSingle()

  const isRegistered = !!existingReg
  const registerAction = registerForEvent.bind(null, event.id)

  // Build Google Maps embed URL using the event location as a search query
  const mapQuery = encodeURIComponent(event.location)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed&z=16`

  return (
    <div className="p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/student/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2 w-max">
            <span>←</span> Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
          {/* Hero Banner */}
          <div className="h-56 bg-gradient-to-br from-blue-900 via-indigo-900 to-zinc-900 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute bottom-6 left-8 text-white z-10">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-4 text-blue-100 ring-1 ring-white/20">Official University Event</span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{event.title}</h1>
             </div>
          </div>
          
          <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
            {/* Left: Description + Map */}
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                  <span className="text-2xl">📝</span> About the Event
                </h2>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">{event.description || 'No description provided by the organizer.'}</p>
              </div>

              {/* Map Section */}
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                  <span className="text-2xl">🗺️</span> Event Location
                </h2>
                <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                  <iframe
                    title="Event Location Map"
                    src={mapEmbedUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://maps.google.com/maps?q=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>📍</span> Open in Google Maps ↗
                </a>
              </div>
            </div>
            
            {/* Right: Details + Register / QR Ticket */}
            <div className="w-full md:w-80 space-y-6 flex-shrink-0">
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-6 shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)]">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Date & Time</h3>
                  <p className="font-semibold text-zinc-900 flex items-center gap-2">
                    <span className="text-lg opacity-80">📅</span> {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="font-semibold text-zinc-900 mt-2 flex items-center gap-2">
                    <span className="text-lg opacity-80">⏱️</span> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Location</h3>
                  <p className="font-semibold text-zinc-900 flex items-center gap-2">
                    <span className="text-lg opacity-80">📍</span> {event.location}
                  </p>
                </div>
              </div>
              
              <div>
                {isRegistered && existingReg ? (
                  /* QR Ticket */
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-md overflow-hidden">
                    {/* Ticket header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white text-center">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Your Ticket ✅</p>
                      <p className="text-base font-extrabold leading-tight">{event.title}</p>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center px-6 py-6 gap-3">
                      <div className="bg-white rounded-2xl p-3 shadow-inner border border-zinc-100">
                        <QRCodeSVG value={existingReg.qr_code_data} size={160} level="H" />
                      </div>
                      <p className="text-[9px] font-mono text-zinc-400 tracking-widest text-center break-all px-2">
                        {existingReg.qr_code_data}
                      </p>
                    </div>

                    {/* Dashed divider */}
                    <div className="border-t border-dashed border-zinc-200 mx-6" />

                    {/* Footer info */}
                    <div className="px-6 py-4 grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-sm font-semibold text-zinc-900">
                          {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Time</p>
                        <p className="text-sm font-semibold text-zinc-900">
                          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="px-6 pb-5">
                      <Link
                        href="/student/registrations"
                        className="block w-full text-center py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        View All My Tickets →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form action={registerAction}>
                    <button type="submit" className="w-full text-center py-4 bg-blue-600 text-white rounded-2xl font-bold tracking-wide hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] ring-1 ring-inset ring-blue-500/50">
                      Register for this Event
                    </button>
                    <p className="text-xs text-zinc-400 text-center mt-3">You will receive a QR ticket after registering.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
