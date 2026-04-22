'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markAttendance(qrCodeData: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  // 1. Find the registration by qr code
  const { data: registration } = await supabase
    .from('registrations')
    .select('*, profiles(full_name), events(title)')
    .eq('qr_code_data', qrCodeData)
    .single()

  if (!registration) {
    return { error: 'Invalid QR Code. Registration not found or forged.', success: false }
  }

  // 2. Insert into attendance
  const { error } = await supabase
    .from('attendance')
    .insert({
      registration_id: registration.id,
      scanned_by: user.id,
      status: 'present'
    })

  if (error) {
    // Error usually means unique constraint violation (already scanned)
    if (error.code === '23505') {
       return { error: `Student is already marked as Present for this event.`, success: false }
    }
    return { error: error.message, success: false }
  }

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/participants')
  
  // type casting for generic single record response
  const profiles = registration.profiles as any;
  const events = registration.events as any;

  return { 
    success: true, 
    message: `${profiles.full_name} is marked Present for ${events.title}!` 
  }
}
