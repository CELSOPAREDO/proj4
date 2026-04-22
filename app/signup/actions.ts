'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { AuthError } from '@supabase/supabase-js'

function isAlreadyRegisteredError(error: AuthError): boolean {
  const msg = error.message.toLowerCase()
  const code = (error as { code?: string }).code?.toLowerCase() ?? ''
  return (
    code === 'user_already_exists' ||
    msg.includes('already registered') ||
    msg.includes('already been registered') ||
    msg.includes('user already exists') ||
    msg.includes('email address is already')
  )
}

async function redirectAfterPasswordLogin(user: any) {
  const supabase = await createClient()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    const role = profile?.role || user.user_metadata?.role || 'student'
    if (role === 'admin') {
      redirect('/admin/dashboard')
    }
    redirect('/student/dashboard')
  }
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirm_password = formData.get('confirm_password') as string
  const full_name = formData.get('full_name') as string
  const role = (formData.get('role') as string) || 'student'
  const secret_code = formData.get('secret_code') as string

  if (!email || !password || !full_name || !confirm_password) {
    return { error: 'Please fill out all required fields.' }
  }

  // Validate admin secret code
  if (role === 'admin') {
    if (!secret_code) {
      return { error: 'Admin secret code is required.' }
    }
    const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE || 'ADMIN2026'
    if (secret_code !== ADMIN_SECRET) {
      return { error: 'Invalid admin secret code. Access denied.' }
    }
  }

  if (password !== confirm_password) {
    return { error: 'Passwords do not match.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        ...(role === 'admin' ? { role: 'admin' } : {}),
      },
    },
  })

  if (!error && data.session) {
    if (role === 'admin') {
      redirect('/admin/dashboard')
    }
    redirect('/student/dashboard')
  }

  if (!error && data.user && !data.session) {
    return {
      info:
        'Check your email for a confirmation link. After confirming, you can sign in. If you already have an account, use Sign in instead.',
    }
  }

  if (error) {
    const msg = error.message
    if (/rate limit/i.test(msg)) {
      return {
        error:
          'Too many attempts from this network right now. Please wait a few minutes. (Rate limits are set in Supabase; they cannot be turned off from the app.)',
      }
    }

    if (isAlreadyRegisteredError(error)) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        if (/invalid login credentials|invalid/i.test(signInError.message)) {
          return {
            error:
              'This email already has an account. Sign in with your password, or use Forgot password if you do not remember it.',
          }
        }
        return { error: signInError.message }
      }
      await redirectAfterPasswordLogin(signInData.user)
    }

    return { error: msg }
  }

  return { error: 'Could not complete signup. Try again or use Sign in.' }
}
