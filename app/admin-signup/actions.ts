'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function adminSignup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const secret_code = formData.get('secret_code') as string

  if (!email || !password || !full_name || !secret_code) {
    return { error: 'Please fill out all fields.' }
  }

  // Validate the secret code against the environment variable
  const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE || 'ADMIN2026'
  if (secret_code !== ADMIN_SECRET) {
    return { error: 'Invalid admin secret code. Access denied.' }
  }

  const supabase = await createClient()

  // Pass role: 'admin' in the metadata — the DB trigger will pick this up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { 
        full_name,
        role: 'admin'   // ← trigger reads this and sets role = 'admin' in profiles
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Signup failed. Please try again.' }
  }

  redirect('/admin/dashboard')
}
