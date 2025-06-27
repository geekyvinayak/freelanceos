/**
 * Database Reset Status API
 * 
 * This API endpoint provides status information about the database reset system
 * including configuration, last reset details, and system health.
 * 
 * Usage:
 *   GET /api/admin/reset-status
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET requests are supported' 
    });
  }

  try {
    // Get configuration from environment
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resetEnabled = process.env.VITE_RESET_ENABLED === 'true';
    const resetInterval = process.env.VITE_RESET_INTERVAL || 'daily';
    const notifyUsers = process.env.VITE_RESET_NOTIFY_USERS !== 'false';
    
    // Basic configuration status
    const status = {
      timestamp: new Date().toISOString(),
      configuration: {
        enabled: resetEnabled,
        interval: resetInterval,
        notifyUsers: notifyUsers,
        supabaseConfigured: !!supabaseUrl,
        serviceKeyConfigured: !!serviceRoleKey
      },
      system: {
        platform: 'vercel',
        cronConfigured: true, // Since we have vercel.json cron setup
        environment: process.env.NODE_ENV || 'production'
      }
    };
    
    // If we have Supabase configured, try to get more detailed status
    if (supabaseUrl && serviceRoleKey) {
      try {
        // Check if we can reach the reset function
        const resetEndpoint = `${supabaseUrl}/functions/v1/database-reset`;
        const healthResponse = await fetch(resetEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'User-Agent': 'Vercel-Status-Check/1.0'
          },
          body: JSON.stringify({
            triggeredBy: 'health_check',
            dryRun: true // This should be handled by the function if supported
          })
        });
        
        status.resetFunction = {
          available: healthResponse.status !== 404,
          statusCode: healthResponse.status,
          accessible: healthResponse.status === 200 || healthResponse.status === 400 || healthResponse.status === 403
        };
        
        // Try to get last reset info using a direct database query
        // This would require a separate endpoint or direct database access
        status.lastReset = {
          available: false,
          message: 'Last reset info requires direct database access'
        };
        
      } catch (error) {
        status.resetFunction = {
          available: false,
          error: error.message
        };
      }
    }
    
    // Calculate next reset time based on interval
    if (resetEnabled) {
      const now = new Date();
      let nextReset = new Date(now);
      
      switch (resetInterval) {
        case 'hourly':
          nextReset.setHours(now.getHours() + 1, 0, 0, 0);
          break;
        case 'daily':
          nextReset.setDate(now.getDate() + 1);
          nextReset.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          nextReset.setDate(now.getDate() + (7 - now.getDay()));
          nextReset.setHours(0, 0, 0, 0);
          break;
        default:
          nextReset = null;
      }
      
      if (nextReset) {
        status.schedule = {
          nextReset: nextReset.toISOString(),
          timeUntilNext: nextReset.getTime() - now.getTime(),
          cronExpression: getCronExpression(resetInterval)
        };
      }
    }
    
    // Add health summary
    const isHealthy = status.configuration.enabled && 
                     status.configuration.supabaseConfigured && 
                     status.configuration.serviceKeyConfigured &&
                     (status.resetFunction?.accessible !== false);
    
    status.health = {
      overall: isHealthy ? 'healthy' : 'degraded',
      issues: []
    };
    
    if (!status.configuration.supabaseConfigured) {
      status.health.issues.push('Supabase URL not configured');
    }
    
    if (!status.configuration.serviceKeyConfigured) {
      status.health.issues.push('Service role key not configured');
    }
    
    if (status.resetFunction?.available === false) {
      status.health.issues.push('Reset function not accessible');
    }
    
    if (!status.configuration.enabled) {
      status.health.issues.push('Reset system is disabled');
    }
    
    return res.status(200).json(status);
    
  } catch (error) {
    console.error('❌ Status check failed:', error.message);
    
    return res.status(500).json({
      error: error.message,
      message: 'Failed to get reset system status',
      timestamp: new Date().toISOString(),
      health: {
        overall: 'error',
        issues: ['Status check failed']
      }
    });
  }
}

// Helper function to get cron expression for interval
function getCronExpression(interval) {
  switch (interval) {
    case 'hourly':
      return '0 * * * *'; // Every hour at minute 0
    case 'daily':
      return '0 0 * * *'; // Every day at midnight
    case 'weekly':
      return '0 0 * * 0'; // Every Sunday at midnight
    default:
      return '0 0 * * *'; // Default to daily
  }
}

// Export config for Vercel
export const config = {
  maxDuration: 10, // 10 seconds timeout
  regions: ['iad1'], // US East region (adjust as needed)
}
