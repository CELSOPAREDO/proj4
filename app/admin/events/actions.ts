'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Ensures the user has a profile row in the database.
// Calls a SECURITY DEFINER function that bypasses RLS.
async function ensureProfile(supabase: any) {
  await supabase.rpc('ensure_profile')
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  console.log('=== CREATE EVENT DEBUG ===')
  console.log('User ID:', user.id)
  console.log('User metadata role:', user.user_metadata?.role)

  // Make sure this user has a profile (fixes RLS issues)
  const { error: rpcError } = await supabase.rpc('ensure_profile')
  console.log('RPC ensure_profile error:', rpcError)

  // Check if profile exists now
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle()
  console.log('Profile after RPC:', profile)
  console.log('Profile error:', profileError)

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const location = formData.get('location') as string

  if (!title || !date || !time || !location) {
    return { error: 'Please fill in all required fields.' }
  }

  // Combine date and time
  const dateTime = new Date(`${date}T${time}`).toISOString()

  const { error } = await supabase
    .from('events')
    .insert({
      title,
      description,
      date: dateTime,
      starts_at: dateTime,
      location,
      venue: location,
      created_by: user.id,
    })

  console.log('Event insert error:', error)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/events')
  redirect('/admin/events')
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/events')
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin-login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const location = formData.get('location') as string

  if (!title || !date || !time || !location) {
    redirect(`/admin/events/${id}/edit?error=${encodeURIComponent('Please fill all required fields.')}`)
  }

  const dateTime = new Date(`${date}T${time}`).toISOString()

  const { error } = await supabase.from('events').update({
    title, description, date: dateTime, starts_at: dateTime, location, venue: location
  }).eq('id', id)

  if (error) {
    redirect(`/admin/events/${id}/edit?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/events')
  redirect('/admin/events')
}
