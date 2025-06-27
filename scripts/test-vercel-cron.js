#!/usr/bin/env node

/**
 * Vercel Cron Test Script
 * 
 * This script tests the Vercel cron endpoints to ensure they're working correctly.
 * 
 * Usage:
 *   node scripts/test-vercel-cron.js [options]
 * 
 * Options:
 *   --url <url>        Base URL of your Vercel deployment
 *   --admin-key <key>  Admin API key for testing
 *   --cron-secret <secret>  Cron secret for testing
 *   --dry-run          Test without actually triggering reset
 */

const https = require('https')
const http = require('http')
const url = require('url')

// Parse command line arguments
const args = process.argv.slice(2)
const config = {
  baseUrl: getArg('--url') || process.env.VERCEL_URL || 'http://localhost:3000',
  adminKey: getArg('--admin-key') || process.env.ADMIN_API_KEY || 'test-admin-key',
  cronSecret: getArg('--cron-secret') || process.env.CRON_SECRET || 'test-cron-secret',
  dryRun: args.includes('--dry-run')
}

function getArg(name) {
  const index = args.indexOf(name)
  return index !== -1 && index + 1 < args.length ? args[index + 1] : null
}

// Make HTTP request
function makeRequest(requestUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new url.URL(requestUrl)
    const isHttps = parsedUrl.protocol === 'https:'
    const client = isHttps ? https : http
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }
    
    const req = client.request(requestOptions, (res) => {
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
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
            parseError: error.message
          })
        }
      })
    })
    
    req.on('error', reject)
    
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    
    req.end()
  })
}

// Test status endpoint
async function testStatusEndpoint() {
  console.log('🔍 Testing status endpoint...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/admin/reset-status`)
    
    if (response.statusCode === 200) {
      console.log('✅ Status endpoint working')
      console.log(`   Health: ${response.body.health?.overall || 'unknown'}`)
      console.log(`   Reset enabled: ${response.body.configuration?.enabled || 'unknown'}`)
      console.log(`   Next reset: ${response.body.schedule?.nextReset || 'not scheduled'}`)
      
      if (response.body.health?.issues?.length > 0) {
        console.log('⚠️  Issues found:')
        response.body.health.issues.forEach(issue => {
          console.log(`   - ${issue}`)
        })
      }
    } else {
      console.log(`❌ Status endpoint failed (${response.statusCode})`)
      console.log(`   Error: ${response.body?.error || 'Unknown error'}`)
    }
    
    return response.statusCode === 200
  } catch (error) {
    console.log(`❌ Status endpoint error: ${error.message}`)
    return false
  }
}

// Test manual trigger endpoint
async function testManualTrigger() {
  console.log('🔧 Testing manual trigger endpoint...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/admin/trigger-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        adminKey: config.adminKey,
        dryRun: config.dryRun,
        force: true
      }
    })
    
    if (response.statusCode === 200) {
      console.log('✅ Manual trigger working')
      if (response.body.dryRun) {
        console.log('   Dry run completed successfully')
      } else {
        console.log(`   Reset completed in ${response.body.duration}ms`)
        console.log(`   Records affected: ${JSON.stringify(response.body.recordsAffected)}`)
      }
    } else if (response.statusCode === 401) {
      console.log('❌ Manual trigger failed - Invalid admin key')
      console.log('   Make sure ADMIN_API_KEY is set correctly')
    } else {
      console.log(`❌ Manual trigger failed (${response.statusCode})`)
      console.log(`   Error: ${response.body?.error || 'Unknown error'}`)
    }
    
    return response.statusCode === 200
  } catch (error) {
    console.log(`❌ Manual trigger error: ${error.message}`)
    return false
  }
}

// Test cron endpoint
async function testCronEndpoint() {
  console.log('⏰ Testing cron endpoint...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/cron/database-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.cronSecret}`
      },
      body: {
        force: config.dryRun ? false : true // Only force if not dry run
      }
    })
    
    if (response.statusCode === 200) {
      console.log('✅ Cron endpoint working')
      if (response.body.skipped) {
        console.log('   Reset was skipped (disabled)')
      } else {
        console.log(`   Reset completed in ${response.body.duration}ms`)
        console.log(`   Records affected: ${JSON.stringify(response.body.recordsAffected)}`)
      }
    } else if (response.statusCode === 401) {
      console.log('❌ Cron endpoint failed - Invalid cron secret')
      console.log('   Make sure CRON_SECRET is set correctly')
    } else {
      console.log(`❌ Cron endpoint failed (${response.statusCode})`)
      console.log(`   Error: ${response.body?.error || 'Unknown error'}`)
    }
    
    return response.statusCode === 200
  } catch (error) {
    console.log(`❌ Cron endpoint error: ${error.message}`)
    return false
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Vercel Cron System Test')
  console.log('==========================')
  console.log(`Base URL: ${config.baseUrl}`)
  console.log(`Dry Run: ${config.dryRun}`)
  console.log('')
  
  const results = {
    status: await testStatusEndpoint(),
    manual: await testManualTrigger(),
    cron: await testCronEndpoint()
  }
  
  console.log('')
  console.log('📊 Test Results:')
  console.log(`   Status endpoint: ${results.status ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Manual trigger:  ${results.manual ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Cron endpoint:   ${results.cron ? '✅ PASS' : '❌ FAIL'}`)
  
  const allPassed = Object.values(results).every(result => result)
  
  if (allPassed) {
    console.log('')
    console.log('🎉 All tests passed! Your Vercel cron system is ready.')
  } else {
    console.log('')
    console.log('⚠️  Some tests failed. Please check the configuration and try again.')
    process.exit(1)
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught exception:', error.message)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled rejection:', reason)
  process.exit(1)
})

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    console.error('💥 Test failed:', error.message)
    process.exit(1)
  })
}

module.exports = { testStatusEndpoint, testManualTrigger, testCronEndpoint }
