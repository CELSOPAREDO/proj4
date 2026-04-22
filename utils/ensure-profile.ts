import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Ensures a profile row exists for the given user.
 * If the DB trigger didn't create one, this will insert it.
 * Uses upsert so it's safe to call multiple times.
 */
export async function ensureProfile(supabase: SupabaseClient, user: any) {
  if (!user) return null

  // First, try to get the existing profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (profile) return profile

  // Profile doesn't exist — create it from auth metadata
  const full_name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const role = user.user_metadata?.role || 'student'

  const { data: newProfile, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        full_name,
        role,
      },
      { onConflict: 'id' }
    )
    .select('*')
    .single()

  if (error) {
    console.error('ensureProfile: failed to create profile:', error)
    return null
  }

  console.log('ensureProfile: created missing profile for', user.email, '| role:', role)
  return newProfile
}
