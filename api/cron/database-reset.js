/**
 * Vercel Cron Job for Database Reset
 * 
 * This API route is designed to be called by Vercel's cron job system
 * to automatically reset the database to demo state at scheduled intervals.
 * 
 * Vercel Cron Configuration:
 * Add this to your vercel.json:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/database-reset",
 *       "schedule": "0 0 * * *"
 *     }
 *   ]
 * }
 */

export default async function handler(req, res) {
  // Verify this is a cron request (Vercel adds this header)
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  
  // Security check: Verify cron secret or Vercel cron header
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid cron secret' 
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  const startTime = Date.now();
  
  try {
    console.log('🚀 Vercel Cron: Starting database reset...');
    
    // Get configuration from environment
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resetEnabled = process.env.VITE_RESET_ENABLED === 'true';
    
    // Validate required environment variables
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is required');
    }
    
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    }
    
    // Check if reset is enabled (can be overridden with force parameter)
    const forceReset = req.body?.force === true;
    if (!resetEnabled && !forceReset) {
      console.log('⏭️  Database reset is disabled');
      return res.status(200).json({
        success: true,
        message: 'Database reset is disabled',
        skipped: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // Prepare reset request
    const resetEndpoint = `${supabaseUrl}/functions/v1/database-reset`;
    const resetPayload = {
      triggeredBy: 'vercel_cron',
      force: forceReset
    };
    
    console.log(`📡 Calling reset endpoint: ${resetEndpoint}`);
    
    // Call the Supabase Edge Function
    const response = await fetch(resetEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'User-Agent': 'Vercel-Cron-DatabaseReset/1.0'
      },
      body: JSON.stringify(resetPayload)
    });
    
    const responseData = await response.json();
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`Reset API returned ${response.status}: ${responseData.error || 'Unknown error'}`);
    }
    
    if (!responseData.success) {
      throw new Error(responseData.error || 'Reset operation failed');
    }
    
    console.log('✅ Database reset completed successfully');
    console.log(`⏱️  Total duration: ${duration}ms`);
    console.log(`📊 Records affected:`, responseData.recordsAffected);
    
    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Database reset completed successfully',
      timestamp: new Date().toISOString(),
      duration: duration,
      resetDuration: responseData.duration,
      recordsAffected: responseData.recordsAffected,
      triggeredBy: 'vercel_cron'
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Database reset failed:', error.message);
    
    // Send error response
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Database reset failed',
      timestamp: new Date().toISOString(),
      duration: duration,
      triggeredBy: 'vercel_cron'
    });
  }
}

// Export config for Vercel
export const config = {
  maxDuration: 30, // 30 seconds timeout
  regions: ['iad1'], // US East region (adjust as needed)
}
