import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Count registrations
  const { count: registrationCount } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user.id)

  // Count attended events
  const { data: attendedData } = await supabase
    .from('registrations')
    .select('id, attendance(id)')
    .eq('student_id', user.id)

  const attendedCount = attendedData?.filter(r => (r as any).attendance && (r as any).attendance.length > 0).length || 0

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">My Profile</h1>
          <p className="text-zinc-500 mt-1">View and manage your account information.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="h-20 w-20 rounded-2xl bg-white shadow-lg ring-4 ring-white flex items-center justify-center text-3xl font-bold text-blue-600">
                {(profile?.full_name || user.user_metadata?.full_name || 'S')?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="pt-14 px-8 pb-8">
            <h2 className="text-xl font-bold text-zinc-900">
              {profile?.full_name || user.user_metadata?.full_name || 'Student'}
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-500/20">
                🎓 {profile?.role === 'admin' ? 'Administrator' : 'Student'}
              </span>
              <span className="text-xs text-zinc-400">
                Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 text-center">
            <p className="text-3xl font-bold text-zinc-900">{registrationCount || 0}</p>
            <p className="text-sm text-zinc-500 mt-1">Events Registered</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 text-center">
            <p className="text-3xl font-bold text-zinc-900">{attendedCount}</p>
            <p className="text-sm text-zinc-500 mt-1">Events Attended</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
          <h3 className="text-lg font-semibold text-zinc-900 mb-6">Account Details</h3>
          <ProfileForm
            initialFullName={profile?.full_name || user.user_metadata?.full_name || ''}
            initialStudentId={profile?.student_id || ''}
            email={user.email || ''}
            role={profile?.role || user.user_metadata?.role || 'student'}
          />
        </div>
      </div>
    </div>
  )
}
