import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client using the SERVICE ROLE KEY.
 * This bypasses Row Level Security (RLS) entirely.
 * Only use this on the server side for privileged operations like
 * auto-creating profiles for newly signed-up users.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.')
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
