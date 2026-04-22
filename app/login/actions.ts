'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Please fill out all fields.' }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect based on profile role
  const user = data.user;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const role = profile?.role || user.user_metadata?.role || 'student'
    if (role === 'admin') {
      redirect('/admin/dashboard')
    } else {
      redirect('/student/dashboard')
    }
  }

  redirect('/')
}
