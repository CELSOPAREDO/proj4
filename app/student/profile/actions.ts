'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated.' }
  }

  const full_name = formData.get('full_name') as string
  const student_id = formData.get('student_id') as string

  if (!full_name?.trim()) {
    return { error: 'Full name is required.' }
  }

  // Update the profile in the database
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: full_name.trim(),
      student_id: student_id?.trim() || null,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update profile. Please try again.' }
  }

  // Also update auth user metadata so the layout header stays in sync
  await supabase.auth.updateUser({
    data: { full_name: full_name.trim() }
  })

  revalidatePath('/student', 'layout')
  return { success: true }
}
