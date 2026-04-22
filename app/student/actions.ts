'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function redirectWithError(eventId: string, message: string) {
  redirect(`/student/events/${eventId}?error=${encodeURIComponent(message)}`)
}

export async function registerForEvent(eventId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Ensure profile exists before inserting a registration.
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!existingProfile) {
    const full_name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'
    const role = user.user_metadata?.role || 'student'

    // Try normal client first in case INSERT policy exists in this project.
    const { error: directProfileError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name, role }, { onConflict: 'id' })

    if (directProfileError) {
      // Fall back to service role client for setups that lock profile inserts via RLS.
      try {
        const adminClient = createAdminClient()
        const { error: profileError } = await adminClient
          .from('profiles')
          .upsert({ id: user.id, full_name, role }, { onConflict: 'id' })

        if (profileError) {
          console.error('Could not create profile with admin client:', profileError)
          redirectWithError(
            eventId,
            'Could not set up your profile. Ask admin to verify Supabase service role key.'
          )
        }
      } catch (adminClientError) {
        console.error('Admin client setup error:', adminClientError)
        redirectWithError(
          eventId,
          'Registration is blocked: missing or invalid Supabase service role key.'
        )
      }
    }
  }

  // ── Generate unique QR code data token ──
  const qrCodeData = `REG-${eventId.slice(0,8)}-${user.id.slice(0,8)}-${Date.now()}`

  const { error } = await supabase.from('registrations').insert({
    event_id: eventId,
    user_id: user.id,
    qr_code_data: qrCodeData
  })

  if (error) {
    console.error('Registration error:', error)
    if (error.code === '23505') {
      redirectWithError(eventId, 'You are already registered for this event.')
    }
    redirectWithError(eventId, error.message || 'Registration failed. Please try again.')
  }

  revalidatePath('/student/dashboard')
  revalidatePath('/student/registrations')
  revalidatePath(`/student/events/${eventId}`)
  revalidatePath('/admin/participants')

  redirect(`/student/events/${eventId}`)
}
