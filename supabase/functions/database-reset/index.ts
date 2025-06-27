import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ResetRequest {
  triggeredBy?: 'scheduled' | 'manual' | 'api'
  force?: boolean
}

interface ResetResponse {
  success: boolean
  timestamp: string
  duration: number
  recordsAffected?: any
  error?: string
  message: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Parse request body
    let requestData: ResetRequest = {}
    if (req.method === 'POST') {
      try {
        requestData = await req.json()
      } catch {
        // If no body or invalid JSON, use defaults
      }
    }

    const triggeredBy = requestData.triggeredBy || 'api'
    const force = requestData.force || false

    console.log(`Database reset requested - triggered by: ${triggeredBy}, force: ${force}`)

    // Check if reset is enabled (unless forced)
    if (!force) {
      const resetEnabled = Deno.env.get('RESET_ENABLED') === 'true'
      if (!resetEnabled) {
        return new Response(
          JSON.stringify({
            success: false,
            timestamp: new Date().toISOString(),
            duration: 0,
            error: 'Database reset is disabled',
            message: 'Reset functionality is currently disabled'
          } as ResetResponse),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Verify demo user exists before attempting reset
    const { data: demoUser, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', 'user@demo.com')
      .single()

    if (userError || !demoUser) {
      console.error('Demo user verification failed:', userError)
      return new Response(
        JSON.stringify({
          success: false,
          timestamp: new Date().toISOString(),
          duration: 0,
          error: 'Demo user not found',
          message: 'Demo user (user@demo.com) does not exist in the system'
        } as ResetResponse),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Demo user verified: ${demoUser.email} (${demoUser.id})`)

    // Execute the database reset
    const startTime = Date.now()
    const { data: resetResult, error: resetError } = await supabase
      .rpc('reset_demo_data')

    const duration = Date.now() - startTime

    if (resetError) {
      console.error('Database reset failed:', resetError)
      return new Response(
        JSON.stringify({
          success: false,
          timestamp: new Date().toISOString(),
          duration,
          error: resetError.message,
          message: 'Database reset operation failed'
        } as ResetResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!resetResult || !resetResult.success) {
      console.error('Reset function returned failure:', resetResult)
      return new Response(
        JSON.stringify({
          success: false,
          timestamp: new Date().toISOString(),
          duration,
          error: resetResult?.error || 'Unknown error',
          message: 'Database reset function reported failure'
        } as ResetResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Database reset completed successfully:', resetResult)

    // Return success response
    const response: ResetResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      duration,
      recordsAffected: resetResult.records_affected,
      message: 'Database reset completed successfully'
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error in database reset function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        timestamp: new Date().toISOString(),
        duration: 0,
        error: error.message || 'Unexpected error occurred',
        message: 'An unexpected error occurred during database reset'
      } as ResetResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/* 
Usage Examples:

1. Manual reset via API:
   POST /functions/v1/database-reset
   {
     "triggeredBy": "manual",
     "force": false
   }

2. Scheduled reset (called by cron):
   POST /functions/v1/database-reset
   {
     "triggeredBy": "scheduled"
   }

3. Force reset (bypasses enabled check):
   POST /functions/v1/database-reset
   {
     "triggeredBy": "api",
     "force": true
   }

Environment Variables Required:
- SUPABASE_URL: Your Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY: Service role key for database access
- RESET_ENABLED: Set to 'true' to enable automatic resets

Supabase Cron Job Setup:
To schedule this function, add to your Supabase dashboard:

1. Go to Database > Extensions
2. Enable pg_cron extension
3. Run this SQL to schedule daily resets at midnight UTC:

SELECT cron.schedule(
  'daily-demo-reset',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/database-reset',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
    body := '{"triggeredBy": "scheduled"}'::jsonb
  );
  $$
);

*/
