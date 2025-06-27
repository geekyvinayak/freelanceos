/**
 * Manual Database Reset Trigger API
 * 
 * This API endpoint allows manual triggering of database resets
 * for testing and administrative purposes.
 * 
 * Usage:
 *   POST /api/admin/trigger-reset
 *   {
 *     "force": true,
 *     "adminKey": "your-admin-key"
 *   }
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported' 
    });
  }

  const startTime = Date.now();
  
  try {
    // Get request data
    const { force = false, adminKey, dryRun = false } = req.body || {};
    
    // Verify admin access
    const requiredAdminKey = process.env.ADMIN_API_KEY;
    if (requiredAdminKey && adminKey !== requiredAdminKey) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid admin key' 
      });
    }
    
    console.log('🔧 Manual reset triggered via API');
    console.log(`   Force: ${force}`);
    console.log(`   Dry Run: ${dryRun}`);
    
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
    if (!resetEnabled && !force) {
      console.log('⏭️  Database reset is disabled');
      return res.status(200).json({
        success: true,
        message: 'Database reset is disabled. Use force=true to override.',
        skipped: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // Handle dry run
    if (dryRun) {
      console.log('🔍 Dry run mode - no actual reset will be performed');
      return res.status(200).json({
        success: true,
        message: 'Dry run completed - no actual reset performed',
        dryRun: true,
        timestamp: new Date().toISOString(),
        wouldReset: {
          endpoint: `${supabaseUrl}/functions/v1/database-reset`,
          payload: {
            triggeredBy: 'manual_api',
            force: force
          }
        }
      });
    }
    
    // Prepare reset request
    const resetEndpoint = `${supabaseUrl}/functions/v1/database-reset`;
    const resetPayload = {
      triggeredBy: 'manual_api',
      force: force
    };
    
    console.log(`📡 Calling reset endpoint: ${resetEndpoint}`);
    
    // Call the Supabase Edge Function
    const response = await fetch(resetEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'User-Agent': 'Vercel-Manual-DatabaseReset/1.0'
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
    
    console.log('✅ Manual database reset completed successfully');
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
      triggeredBy: 'manual_api',
      force: force
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Manual database reset failed:', error.message);
    
    // Send error response
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Database reset failed',
      timestamp: new Date().toISOString(),
      duration: duration,
      triggeredBy: 'manual_api'
    });
  }
}

// Export config for Vercel
export const config = {
  maxDuration: 30, // 30 seconds timeout
  regions: ['iad1'], // US East region (adjust as needed)
}
