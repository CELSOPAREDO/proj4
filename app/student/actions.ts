'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function registerForEvent(eventId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // ── Auto-create profile if missing using admin client (bypasses RLS INSERT restriction) ──
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!existingProfile) {
    const full_name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'
    const role = user.user_metadata?.role || 'student'

    const adminClient = createAdminClient()
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({ id: user.id, full_name, role }, { onConflict: 'id' })

    if (profileError) {
      console.error('Could not create profile:', profileError)
      return { error: 'Could not set up your account. Please try again.' }
    }
  }

  // ── Generate unique QR code data token ──
  const qrCodeData = `REG-${eventId.slice(0,8)}-${user.id.slice(0,8)}-${Date.now()}`

  const { error } = await supabase.from('registrations').insert({
    event_id: eventId,
    student_id: user.id,
    qr_code_data: qrCodeData,
    status: 'registered'
  })

  if (error) {
    console.error('Registration error:', error)
    return { error: error.message }
  }

  revalidatePath('/student/dashboard')
  revalidatePath('/student/registrations')
  revalidatePath(`/student/events/${eventId}`)
  revalidatePath('/admin/participants')

  redirect(`/student/events/${eventId}`)
}
