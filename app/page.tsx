import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('=== HOME DASHBOARD DEBUG ===')
  console.log('User found:', !!user)
  if (userError) console.log('User Error:', userError)

  if (!user) {
    console.log('Redirecting to /login because user is null')
    redirect('/login')
  }

  // Fetch profile role and redirect accordingly
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  console.log('Profile found:', !!profile, '| Role:', profile?.role)
  if (profileError) console.log('Profile Error:', profileError)

  const role = profile?.role || user.user_metadata?.role || 'student'

  // Default to student dashboard if profile not found yet
  if (role === 'admin') {
    console.log('Redirecting to /admin/dashboard')
    redirect('/admin/dashboard')
  }

  console.log('Redirecting to /student/dashboard')
  redirect('/student/dashboard')
}