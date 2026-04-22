import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import ExportButton from './ExportButton'

export default async function AdminParticipantsPage(props: { searchParams: Promise<{ event_id?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()
  
  // Fetch all events for the filter dropdown
  const { data: events } = await supabase.from('events').select('id, title').order('date', { ascending: false })

  // Fetch registrations based on filter
  let query = supabase
    .from('registrations')
    .select(`
      id,
      qr_code_data,
      created_at,
      profiles (full_name),
      events (title),
      attendance (id)
    `)
    .order('created_at', { ascending: false })

  if (searchParams.event_id) {
    query = query.eq('event_id', searchParams.event_id)
  }

  const { data: registrations } = await query

  // Calculate statistics
  const totalRegistrations = registrations?.length || 0
  const totalAttended = registrations?.filter(r => (r.attendance as any[])?.length > 0).length || 0
  const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0

  return (
    <div className="p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Participant Management</h1>
          <p className="text-zinc-500 mt-1">View registrations, track attendance, and export reports.</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 border-l-4 border-l-blue-500">
             <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Total Registered</p>
             <p className="text-3xl font-bold text-zinc-900 mt-2">{totalRegistrations}</p>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 border-l-4 border-l-green-500">
             <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Total Attended</p>
             <p className="text-3xl font-bold text-zinc-900 mt-2">{totalAttended}</p>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 border-l-4 border-l-indigo-500">
             <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Attendance Rate</p>
             <p className="text-3xl font-bold text-zinc-900 mt-2">{attendanceRate}%</p>
           </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
             <div className="flex items-center gap-3">
               <span className="text-sm font-semibold text-zinc-700">Filter Event:</span>
                 <form className="relative">
                 <select 
                   name="event_id" 
                   defaultValue={searchParams.event_id || ''}
                   className="block w-full sm:w-64 rounded-xl border-0 py-2 pl-4 pr-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-all bg-white"
                 >
                   <option value="">All Events</option>
                   {events?.map(e => (
                     <option key={e.id} value={e.id}>{e.title}</option>
                   ))}
                 </select>
                 {/* For client-side automatic submit without JS, we would need a button, but in Next.js we can use a small Client Component to handle auto-submissions. For simplicity, we'll add a tiny script or a GO button */}
                 <button type="submit" className="ml-2 px-3 py-2 bg-zinc-200 hover:bg-zinc-300 rounded-lg text-xs font-semibold text-zinc-800 transition-colors">Apply</button>
               </form>
             </div>
             
             <ExportButton />
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-zinc-600">
               <thead className="text-xs text-zinc-500 bg-zinc-50/80 border-b border-zinc-200 uppercase tracking-widest">
                 <tr>
                   <th className="px-6 py-4 font-semibold">Student Name</th>
                   <th className="px-6 py-4 font-semibold">Event</th>
                   <th className="px-6 py-4 font-semibold">Reg. Date</th>
                   <th className="px-6 py-4 font-semibold">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100">
                 {registrations && registrations.length > 0 ? (
                   registrations.map(reg => {
                     const isPresent = (reg.attendance as any[])?.length > 0
                     return (
                       <tr key={reg.id} className="hover:bg-zinc-50 transition-colors">
                         <td className="px-6 py-4 font-medium text-zinc-900">{(reg.profiles as any)?.full_name || 'Unknown Student'}</td>
                         <td className="px-6 py-4">{(reg.events as any)?.title}</td>
                         <td className="px-6 py-4 text-zinc-500">{new Date(reg.created_at).toLocaleDateString()}</td>
                         <td className="px-6 py-4">
                           {isPresent ? (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none text-green-700 bg-green-100 ring-1 ring-inset ring-green-500/20">
                               ✅ Present
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none text-zinc-600 bg-zinc-100 ring-1 ring-inset ring-zinc-500/20">
                               ⏳ Absent
                             </span>
                           )}
                         </td>
                       </tr>
                     )
                   })
                 ) : (
                   <tr>
                     <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                        No participants found for the selected criteria.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  )
}
