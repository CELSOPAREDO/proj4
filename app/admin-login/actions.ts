'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please fill in all fields.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  // Verify the user is actually an admin
  const user = data.user
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).maybeSingle()
  const role = profile?.role || user?.user_metadata?.role || 'student'

  if (role !== 'admin') {
    // Sign them out — they don't have admin access
    await supabase.auth.signOut()
    return { error: 'Access denied. This login is for administrators only.' }
  }

  redirect('/admin/dashboard')
}
