import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

export default async function StudentRegistrationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch registrations directly joined with the event
  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      events (*)
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">My Tickets & QR Codes</h1>
          <p className="text-zinc-500 mt-1">Present your unique QR code at the event entrance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {registrations && registrations.length > 0 ? (
            registrations.map((reg) => {
              const event = reg.events as any;
              return (
                <div key={reg.id} className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col group hover:border-blue-300 hover:shadow-md transition-all duration-300">
                  <div className="h-28 bg-gradient-to-tr from-blue-700 to-indigo-800 relative">
                     <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-bold text-white tracking-widest uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ring-1 ring-white/30">
                        {reg.status}
                     </div>
                  </div>
                  <div className="px-6 pt-0 pb-6 flex-1 flex flex-col items-center">
                    {/* QR Code Holder */}
                    <div className="w-36 h-36 bg-white rounded-2xl shadow-lg shadow-zinc-200/50 border border-zinc-100 p-3 -mt-16 z-10 flex items-center justify-center relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                      <QRCodeSVG value={reg.qr_code_data} size={118} level="H" />
                    </div>
                    
                    <div className="mt-5 w-full text-center space-y-2 flex-1">
                       <h3 className="text-base font-bold text-zinc-900 flex-1 leading-snug line-clamp-2">{event.title}</h3>
                       <p className="text-[11px] text-zinc-500 font-medium tracking-widest bg-zinc-100 rounded-lg py-1 px-2 mx-auto w-max font-mono">ID: {reg.qr_code_data.split('-').pop()}</p>
                    </div>

                    <div className="mt-6 w-full pt-5 border-t border-dashed border-zinc-200 grid grid-cols-2 gap-4 text-center">
                       <div>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Date</p>
                          <p className="text-sm font-semibold text-zinc-900">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</p>
                       </div>
                       <div>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Time</p>
                          <p className="text-sm font-semibold text-zinc-900">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                       </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-20 text-center rounded-2xl bg-white border border-dashed border-zinc-200">
              <span className="text-5xl mb-4 block">🎟️</span>
              <p className="text-lg font-bold text-zinc-900">No tickets yet.</p>
              <p className="text-sm text-zinc-500 mt-2 mb-6 max-w-sm mx-auto">You haven't registered for any upcoming events. Head over to the dashboard to find one.</p>
              <Link href="/student/dashboard" className="text-xs font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-xl hover:bg-blue-100 hover:text-blue-800 transition-colors uppercase tracking-widest">
                 Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
