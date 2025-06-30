# FreelanceOS Production Deployment Guide

This guide covers deploying FreelanceOS to production with optimal performance, security, and reliability.

## 🚀 Quick Deployment Checklist

- [ ] Set up production Supabase project
- [ ] Configure environment variables
- [ ] Set up Vercel deployment
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and analytics
- [ ] Test all functionality
- [ ] Set up backup and recovery

## 📋 Prerequisites

- Node.js 18+ installed locally
- Supabase account
- Vercel account
- Google AI Studio account (for Gemini API)
- Custom domain (optional)

## 🗄️ Database Setup

### 1. Create Production Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and set project details:
   - **Name**: `freelanceos-production`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users
4. Wait for project creation (2-3 minutes)

### 2. Configure Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Run the schema setup scripts in order:

```sql
-- 1. Run the main schema
-- Copy and paste contents of database/schema.sql

-- 2. Set up RLS policies
-- Copy and paste contents of database/policies.sql

-- 3. Set up demo data (optional for production)
-- Copy and paste contents of database/demo-data.sql

-- 4. Set up reset system (if using demo mode)
-- Copy and paste contents of database/reset-system.sql
```

### 3. Configure Authentication

1. Go to Authentication > Settings
2. Configure Auth settings:
   - **Site URL**: `https://your-domain.com`
   - **Redirect URLs**: `https://your-domain.com/**`
3. Enable email confirmations (recommended)
4. Set up email templates (optional)

## 🔧 Environment Configuration

### 1. Create Production Environment File

Create `.env.production` with production values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key

# Application Configuration
VITE_APP_NAME=FreelanceOS
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
NODE_ENV=production

# Feature Flags for Production
VITE_ENABLE_DEMO_MODE=false
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_PASSWORD_RESET=true

# Performance & Monitoring
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Optional: Error Reporting
VITE_SENTRY_DSN=your_sentry_dsn
```

### 2. Security Considerations

- Use strong, unique passwords for all services
- Generate secure random strings for API keys
- Enable 2FA on all accounts
- Regularly rotate API keys
- Use environment-specific Supabase projects

## 🌐 Vercel Deployment

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Configure Environment Variables

In Vercel project settings, add all environment variables from your `.env.production` file:

**Frontend Variables (VITE_*):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_APP_NAME`
- `VITE_APP_VERSION`
- `VITE_APP_ENV`
- All other `VITE_*` variables

**Backend Variables:**
- `NODE_ENV`

### 3. Deploy

1. Click "Deploy" in Vercel
2. Wait for build completion
3. Test the deployment URL
4. Configure custom domain (optional)

## 🔗 Custom Domain Setup

### 1. Add Domain to Vercel

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 2. Update Supabase Settings

1. Go to Supabase Authentication settings
2. Update Site URL to your custom domain
3. Update redirect URLs

### 3. Update Environment Variables

Update any hardcoded URLs in environment variables to use your custom domain.

## 📊 Monitoring & Analytics

### 1. Set up Google Analytics (Optional)

1. Create Google Analytics 4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `VITE_GOOGLE_ANALYTICS_ID` environment variable

### 2. Set up Error Reporting (Optional)

1. Create Sentry project
2. Get DSN
3. Add to `VITE_SENTRY_DSN` environment variable

### 3. Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor performance metrics
3. Set up alerts for issues

## 🔒 Security Hardening

### 1. Supabase Security

- Enable RLS on all tables
- Review and test all policies
- Enable email confirmation
- Set up proper CORS settings
- Regular security audits

### 2. Vercel Security

- Enable security headers
- Set up proper redirects
- Use HTTPS only
- Configure CSP headers

### 3. API Security

- Use strong API keys
- Implement rate limiting
- Monitor API usage
- Regular key rotation

## 🧪 Testing Production Deployment

### 1. Functional Testing

- [ ] User registration and login
- [ ] Project CRUD operations
- [ ] Notes functionality
- [ ] Bills and invoicing
- [ ] Email assistant
- [ ] PDF generation
- [ ] Data persistence

### 2. Performance Testing

- [ ] Page load times < 3 seconds
- [ ] Bundle size optimization
- [ ] Image optimization
- [ ] Database query performance
- [ ] API response times

### 3. Security Testing

- [ ] Authentication flows
- [ ] Authorization checks
- [ ] Data validation
- [ ] XSS protection
- [ ] CSRF protection

## 🔄 Backup & Recovery

### 1. Database Backups

- Supabase automatically backs up your database
- Set up additional backup strategies if needed
- Test restore procedures

### 2. Code Backups

- Use Git for version control
- Tag releases
- Maintain deployment history

## 📈 Performance Optimization

### 1. Build Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Optimize images
# Use WebP format where possible
# Implement lazy loading
```

### 2. Database Optimization

- Add indexes for frequently queried columns
- Optimize RLS policies
- Monitor query performance
- Use connection pooling

### 3. CDN Configuration

- Vercel automatically provides CDN
- Configure caching headers
- Optimize static assets

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify Node.js version
   - Clear cache and rebuild

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Review RLS policies

3. **Authentication Problems**
   - Check redirect URLs
   - Verify site URL configuration
   - Test email delivery

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

## 📞 Post-Deployment

### 1. Monitor Performance

- Set up alerts for downtime
- Monitor error rates
- Track user metrics
- Review performance regularly

### 2. Regular Maintenance

- Update dependencies monthly
- Security patches immediately
- Database maintenance
- Backup verification

### 3. User Feedback

- Set up feedback collection
- Monitor user behavior
- Plan feature updates
- Address user issues promptly

---

**🎉 Congratulations!** Your FreelanceOS application is now running in production with optimal performance, security, and reliability.
