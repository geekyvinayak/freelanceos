#!/usr/bin/env node

/**
 * Database Reset Automation Script
 * 
 * This script can be used to trigger database resets from external systems
 * such as cron jobs, CI/CD pipelines, or monitoring systems.
 * 
 * Usage:
 *   node scripts/reset-automation.js [options]
 * 
 * Options:
 *   --force     Force reset even if disabled
 *   --interval  Override default interval check
 *   --dry-run   Show what would happen without executing
 * 
 * Environment Variables:
 *   SUPABASE_URL              - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key for API access
 *   RESET_WEBHOOK_URL         - Optional webhook for notifications
 */

const https = require('https')
const url = require('url')

// Configuration
const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  webhookUrl: process.env.RESET_WEBHOOK_URL,
  force: process.argv.includes('--force'),
  dryRun: process.argv.includes('--dry-run'),
  interval: process.argv.includes('--interval') ? 
    process.argv[process.argv.indexOf('--interval') + 1] : null
}

// Validate configuration
function validateConfig() {
  const errors = []
  
  if (!config.supabaseUrl) {
    errors.push('SUPABASE_URL environment variable is required')
  }
  
  if (!config.serviceRoleKey) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  }
  
  if (errors.length > 0) {
    console.error('Configuration errors:')
    errors.forEach(error => console.error(`  - ${error}`))
    process.exit(1)
  }
}

// Make HTTP request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          }
          resolve(response)
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`))
        }
      })
    })
    
    req.on('error', reject)
    
    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

// Send webhook notification
async function sendWebhookNotification(resetResult) {
  if (!config.webhookUrl) return
  
  try {
    const webhookData = {
      event: 'database_reset',
      timestamp: new Date().toISOString(),
      success: resetResult.success,
      duration: resetResult.duration,
      recordsAffected: resetResult.recordsAffected,
      triggeredBy: 'automation_script'
    }
    
    const webhookUrl = new url.URL(config.webhookUrl)
    const options = {
      hostname: webhookUrl.hostname,
      port: webhookUrl.port || (webhookUrl.protocol === 'https:' ? 443 : 80),
      path: webhookUrl.pathname + webhookUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FreelanceOS-Reset-Automation/1.0'
      }
    }
    
    await makeRequest(options, webhookData)
    console.log('✅ Webhook notification sent successfully')
  } catch (error) {
    console.warn(`⚠️  Failed to send webhook notification: ${error.message}`)
  }
}

// Execute database reset
async function executeReset() {
  console.log('🚀 Starting database reset automation...')
  
  if (config.dryRun) {
    console.log('🔍 DRY RUN MODE - No actual reset will be performed')
  }
  
  try {
    const resetUrl = new url.URL('/functions/v1/database-reset', config.supabaseUrl)
    const requestData = {
      triggeredBy: 'automation_script',
      force: config.force
    }
    
    if (config.interval) {
      requestData.interval = config.interval
    }
    
    const options = {
      hostname: resetUrl.hostname,
      port: resetUrl.port || 443,
      path: resetUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.serviceRoleKey}`,
        'User-Agent': 'FreelanceOS-Reset-Automation/1.0'
      }
    }
    
    console.log(`📡 Sending reset request to: ${resetUrl.toString()}`)
    
    if (config.dryRun) {
      console.log('📋 Request payload:', JSON.stringify(requestData, null, 2))
      console.log('✅ Dry run completed successfully')
      return
    }
    
    const response = await makeRequest(options, requestData)
    
    if (response.statusCode === 200 && response.body.success) {
      console.log('✅ Database reset completed successfully!')
      console.log(`⏱️  Duration: ${response.body.duration}ms`)
      console.log(`📊 Records affected:`, response.body.recordsAffected)
      
      // Send webhook notification
      await sendWebhookNotification(response.body)
      
    } else {
      console.error('❌ Database reset failed!')
      console.error(`Status: ${response.statusCode}`)
      console.error(`Error: ${response.body?.error || 'Unknown error'}`)
      process.exit(1)
    }
    
  } catch (error) {
    console.error('💥 Unexpected error during reset:', error.message)
    process.exit(1)
  }
}

// Check if reset should run based on schedule
function shouldRunReset() {
  if (config.force) {
    console.log('🔧 Force flag detected - bypassing schedule check')
    return true
  }
  
  // Add your scheduling logic here
  // For example, check last reset time, current time, etc.
  
  return true // For now, always run unless disabled
}

// Main execution
async function main() {
  console.log('🎯 FreelanceOS Database Reset Automation')
  console.log('==========================================')
  
  validateConfig()
  
  if (!shouldRunReset()) {
    console.log('⏭️  Reset not needed at this time')
    return
  }
  
  await executeReset()
  
  console.log('🎉 Automation completed successfully!')
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught exception:', error.message)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled rejection:', reason)
  process.exit(1)
})

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Script failed:', error.message)
    process.exit(1)
  })
}

module.exports = { executeReset, validateConfig, shouldRunReset }
