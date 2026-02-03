import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client with service role (bypasses RLS).
 * Use only in API routes and server components.
 * Creates a new client each time to ensure fresh env vars in serverless.
 */
export function createSupabaseAdmin() {
  // Read env vars at function call time, not module load time
  // This is important for Vercel serverless functions
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(`Missing Supabase environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseServiceKey}`)
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  })
}
