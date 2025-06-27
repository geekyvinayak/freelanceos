# Database Reset System Documentation

## Overview

The FreelanceOS Database Reset System provides automated and manual database cleanup functionality to maintain a clean demo environment. The system periodically restores the database to a pristine demo state with fresh sample data, ensuring users always have a consistent testing experience.

## Features

- ✅ **Automated Scheduling**: Configurable reset intervals (hourly, daily, weekly)
- ✅ **Manual Reset**: Admin interface for immediate database reset
- ✅ **Safety Measures**: Comprehensive error handling and logging
- ✅ **User Notifications**: Demo environment banner and reset notifications
- ✅ **Statistics & Monitoring**: Reset history and performance metrics
- ✅ **Multiple Implementation Options**: Supabase Edge Functions, cron jobs, external services

## Architecture

### Components

1. **Database Reset Service** (`src/services/databaseReset.ts`)
   - Core service for executing database resets
   - Configuration management
   - Statistics and logging

2. **Database Functions** (`database/reset-system.sql`)
   - PostgreSQL functions for safe data reset
   - Reset logging table and policies
   - Statistics and monitoring functions

3. **Supabase Edge Function** (`supabase/functions/database-reset/index.ts`)
   - HTTP endpoint for triggering resets
   - CORS support and error handling
   - Integration with scheduling systems

4. **UI Components**
   - Demo notification banner
   - Admin reset management interface
   - Reset status notifications

## Setup Instructions

### 1. Database Setup

Run the reset system SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database/reset-system.sql
```

This creates:
- `reset_logs` table for tracking reset activities
- `reset_demo_data()` function for executing resets
- Helper functions for statistics and monitoring
- Proper RLS policies for security

### 2. Environment Configuration

Add these variables to your `.env` file:

```env
# Database Reset Configuration
VITE_RESET_ENABLED=true
VITE_RESET_INTERVAL=daily
VITE_RESET_NOTIFY_USERS=true
```

### 3. Supabase Edge Function Deployment

Deploy the reset function to Supabase:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy database-reset
```

### 4. Scheduled Reset Setup (Choose One)

#### Option A: Supabase Cron Jobs (Recommended)

1. Enable the `pg_cron` extension in your Supabase dashboard
2. Run this SQL to schedule daily resets at midnight UTC:

```sql
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
```

#### Option B: External Cron Service

Use services like GitHub Actions, Vercel Cron, or Netlify Functions:

```yaml
# .github/workflows/database-reset.yml
name: Database Reset
on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight UTC
jobs:
  reset:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Reset
        run: |
          curl -X POST \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -d '{"triggeredBy": "scheduled"}' \
            https://your-project.supabase.co/functions/v1/database-reset
```

## Configuration Options

### Reset Intervals

- `hourly`: Reset every hour at the top of the hour
- `daily`: Reset daily at midnight UTC
- `weekly`: Reset weekly on Sunday at midnight UTC

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_RESET_ENABLED` | Enable/disable automatic resets | `false` |
| `VITE_RESET_INTERVAL` | Reset frequency | `daily` |
| `VITE_RESET_NOTIFY_USERS` | Show demo banner to users | `true` |

## API Reference

### Manual Reset Endpoint

```http
POST /functions/v1/database-reset
Content-Type: application/json
Authorization: Bearer YOUR_SERVICE_ROLE_KEY

{
  "triggeredBy": "manual",
  "force": false
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "duration": 1500,
  "recordsAffected": {
    "projects_deleted": 5,
    "notes_deleted": 12,
    "bills_deleted": 8,
    "projects_created": 6,
    "notes_created": 15,
    "bills_created": 9
  },
  "message": "Database reset completed successfully"
}
```

### Database Functions

#### `reset_demo_data()`
Executes the complete database reset process.

```sql
SELECT reset_demo_data();
```

#### `get_last_reset()`
Returns information about the most recent reset.

```sql
SELECT get_last_reset();
```

#### `get_reset_stats()`
Returns statistical information about reset history.

```sql
SELECT get_reset_stats();
```

## User Interface

### Demo Notification Banner

The system automatically displays a notification banner to inform users about the demo environment:

- Shows next reset countdown
- Displays last reset information
- Can be dismissed by users
- Automatically reappears after browser refresh

### Admin Interface

Access the reset management interface through the admin panel:

- Manual reset trigger
- Reset configuration overview
- Historical statistics
- Last reset details

## Safety Measures

### Data Protection

- Only affects the demo user (`user@demo.com`)
- Preserves authentication data
- Comprehensive error handling
- Transaction rollback on failures

### Monitoring

- All reset activities are logged
- Success/failure tracking
- Performance metrics
- Error reporting

### Rate Limiting

- Prevents excessive reset requests
- Configurable cooldown periods
- Force override for emergencies

## Troubleshooting

### Common Issues

1. **Demo user not found**
   - Ensure `user@demo.com` exists in `auth.users`
   - Check user creation process

2. **Reset function fails**
   - Verify database permissions
   - Check RLS policies
   - Review error logs

3. **Scheduled resets not working**
   - Confirm cron job configuration
   - Verify service role key permissions
   - Check function deployment

### Debugging

Enable debug logging by setting:
```env
VITE_DEBUG_RESET=true
```

View reset logs:
```sql
SELECT * FROM reset_logs ORDER BY timestamp DESC LIMIT 10;
```

## Security Considerations

- Service role key required for reset operations
- RLS policies protect reset logs
- Demo user isolation prevents data leakage
- CORS configuration for web access

## Performance

- Typical reset duration: 1-3 seconds
- Minimal impact on active users
- Optimized SQL operations
- Efficient data cleanup

## Monitoring & Alerts

Set up monitoring for:
- Reset success/failure rates
- Performance degradation
- Unusual reset patterns
- System availability

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review reset logs and statistics
3. Contact system administrator
4. Submit GitHub issue with logs
