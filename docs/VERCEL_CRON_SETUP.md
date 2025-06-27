# Vercel Cron Setup for Database Reset

## Overview

This guide explains how to set up automated database resets using Vercel's built-in cron job functionality. Vercel cron jobs are reliable, serverless, and integrate seamlessly with your existing deployment.

## Features

- ✅ **Serverless Execution**: No additional infrastructure required
- ✅ **Reliable Scheduling**: Built into Vercel's platform
- ✅ **Automatic Scaling**: Handles traffic spikes gracefully
- ✅ **Monitoring**: Built-in logging and error tracking
- ✅ **Manual Triggers**: API endpoints for testing and admin control

## Files Created

1. **`api/cron/database-reset.js`** - Main cron job handler
2. **`api/admin/trigger-reset.js`** - Manual trigger endpoint
3. **`api/admin/reset-status.js`** - Status and health check endpoint
4. **`vercel.json`** - Updated with cron configuration

## Setup Instructions

### 1. Environment Variables

Add these environment variables to your Vercel project:

**Required:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Optional:**
```env
VITE_RESET_ENABLED=true
VITE_RESET_INTERVAL=daily
CRON_SECRET=your_secure_random_string
ADMIN_API_KEY=your_admin_api_key
```

### 2. Vercel Dashboard Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the required environment variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `SUPABASE_URL` | Your Supabase project URL | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | All |
| `VITE_RESET_ENABLED` | `true` | All |
| `VITE_RESET_INTERVAL` | `daily` | All |
| `CRON_SECRET` | Random secure string | All |
| `ADMIN_API_KEY` | Random secure string | All |

### 3. Deploy Configuration

The `vercel.json` file has been updated with the cron configuration:

```json
{
  "crons": [
    {
      "path": "/api/cron/database-reset",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Schedule Options:**
- `"0 0 * * *"` - Daily at midnight UTC
- `"0 */6 * * *"` - Every 6 hours
- `"0 0 * * 0"` - Weekly on Sunday at midnight
- `"0 */1 * * *"` - Hourly

### 4. Deploy to Vercel

```bash
# Deploy your changes
vercel --prod

# Or if using Git integration, just push to your main branch
git add .
git commit -m "Add Vercel cron for database reset"
git push origin main
```

## API Endpoints

### Cron Job Endpoint

**Endpoint:** `POST /api/cron/database-reset`

This endpoint is automatically called by Vercel's cron system. You can also call it manually for testing:

```bash
curl -X POST https://your-app.vercel.app/api/cron/database-reset \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"force": false}'
```

### Manual Trigger Endpoint

**Endpoint:** `POST /api/admin/trigger-reset`

For manual testing and admin control:

```bash
curl -X POST https://your-app.vercel.app/api/admin/trigger-reset \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "YOUR_ADMIN_API_KEY",
    "force": true,
    "dryRun": false
  }'
```

**Parameters:**
- `adminKey` (required): Admin API key for authentication
- `force` (optional): Force reset even if disabled
- `dryRun` (optional): Test without actually resetting

### Status Check Endpoint

**Endpoint:** `GET /api/admin/reset-status`

Check system health and configuration:

```bash
curl https://your-app.vercel.app/api/admin/reset-status
```

**Response Example:**
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "configuration": {
    "enabled": true,
    "interval": "daily",
    "notifyUsers": true,
    "supabaseConfigured": true,
    "serviceKeyConfigured": true
  },
  "system": {
    "platform": "vercel",
    "cronConfigured": true,
    "environment": "production"
  },
  "schedule": {
    "nextReset": "2024-01-02T00:00:00.000Z",
    "timeUntilNext": 86400000,
    "cronExpression": "0 0 * * *"
  },
  "health": {
    "overall": "healthy",
    "issues": []
  }
}
```

## Monitoring and Logging

### Vercel Function Logs

1. Go to your Vercel dashboard
2. Navigate to **Functions** tab
3. Click on the cron function to view logs
4. Monitor execution times and error rates

### Custom Monitoring

Add webhook notifications for reset events:

```env
RESET_WEBHOOK_URL=https://hooks.slack.com/your-webhook-url
```

The system will send notifications to your webhook on reset completion or failure.

## Testing

### Test the Cron Job Locally

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev

# Test the endpoint
curl -X POST http://localhost:3000/api/cron/database-reset \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

### Test Manual Trigger

```bash
curl -X POST http://localhost:3000/api/admin/trigger-reset \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "test-key",
    "dryRun": true
  }'
```

### Test Status Endpoint

```bash
curl http://localhost:3000/api/admin/reset-status
```

## Security Considerations

### Environment Variables
- Store sensitive keys in Vercel environment variables
- Use different keys for development and production
- Rotate keys regularly

### API Security
- Use strong, random values for `CRON_SECRET` and `ADMIN_API_KEY`
- Consider IP whitelisting for admin endpoints
- Monitor API usage for unusual patterns

### Access Control
- The cron endpoint requires a valid cron secret
- Admin endpoints require admin API key
- All endpoints validate request methods

## Troubleshooting

### Common Issues

1. **Cron job not running**
   - Check Vercel dashboard for function logs
   - Verify `vercel.json` cron configuration
   - Ensure environment variables are set

2. **Reset function fails**
   - Check Supabase service role key permissions
   - Verify Supabase URL is correct
   - Test the reset function directly

3. **Authentication errors**
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
   - Check if service role has necessary permissions
   - Ensure key is set in all environments

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_RESET=true
```

### Manual Testing

Use the status endpoint to verify configuration:
```bash
curl https://your-app.vercel.app/api/admin/reset-status
```

## Schedule Customization

### Different Intervals

Update `vercel.json` for different schedules:

```json
{
  "crons": [
    {
      "path": "/api/cron/database-reset",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Multiple Schedules

You can have multiple cron jobs:

```json
{
  "crons": [
    {
      "path": "/api/cron/database-reset",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/health-check",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

## Cost Considerations

- Vercel cron jobs are included in most plans
- Function execution time is typically under 5 seconds
- Monitor usage in Vercel dashboard
- Consider frequency vs. cost for your use case

## Next Steps

1. Deploy the configuration to Vercel
2. Set up environment variables
3. Test the endpoints manually
4. Monitor the first few automated runs
5. Set up alerting for failures
6. Document the process for your team

The Vercel cron system is now ready to automatically maintain your demo database! 🚀
