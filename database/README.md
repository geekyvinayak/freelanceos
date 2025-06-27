# FreelanceOS Database Setup & Demo Data

This directory contains all the necessary SQL scripts to set up the FreelanceOS database and populate it with demo data.

## 📁 Files Overview

- **`schema.sql`** - Complete database schema with tables, triggers, and RLS policies
- **`demo-data-auto.sql`** - Automatic demo data insertion (recommended)
- **`demo-data.sql`** - Manual demo data insertion (requires UUID replacement)
- **`verify-demo-data.sql`** - Verification script to check demo data
- **`seed.sql`** - Basic seed data template

## 🚀 Quick Setup

### 1. Database Schema Setup

First, run the schema script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of schema.sql
```

This creates:
- ✅ Tables: `projects`, `notes`, `bills`
- ✅ Custom types: `project_status`, `bill_status`
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for `updated_at` timestamps
- ✅ Indexes for performance
- ✅ Invoice number generation function

### 2. Create Demo User

The demo user should already exist if you created it through the FreelanceOS auth system:
- **Email**: `user@demo.com`
- **Password**: `Demo@123`

If not, create it through your Supabase Auth dashboard or the FreelanceOS signup form.

### 3. Insert Demo Data (Automatic)

Run the automatic demo data script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of demo-data-auto.sql
```

This automatically:
- ✅ Finds the demo user by email
- ✅ Clears any existing demo data
- ✅ Inserts 6 realistic projects
- ✅ Adds 15 project notes
- ✅ Creates 9 invoices/bills
- ✅ Shows success confirmation

### 4. Verify Demo Data

Run the verification script to confirm everything was inserted correctly:

```sql
-- Copy and paste the contents of verify-demo-data.sql
```

## 📊 Demo Data Overview

### Projects Created (6 total)
1. **E-commerce Website Redesign** (Active)
   - Modern fashion retailer platform
   - React.js + Node.js stack

2. **Mobile Banking App** (Active)
   - Secure banking application
   - React Native development

3. **Corporate Brand Identity** (Completed)
   - Tech startup branding
   - Logo, guidelines, materials

4. **Restaurant Management System** (On Hold)
   - POS integration system
   - Paused due to budget

5. **Real Estate Platform** (Active)
   - Property listing platform
   - MLS integration

6. **Healthcare Dashboard** (Completed)
   - Patient management system
   - HIPAA compliant

### Notes Created (15 total)
- **Realistic project updates** with timestamps
- **Client communication** records
- **Technical progress** notes
- **Project milestones** and deliverables

### Bills/Invoices Created (9 total)
- **Total Amount**: $37,200
- **Paid Invoices**: 5 ($25,300)
- **Pending Invoices**: 4 ($11,900)
- **Invoice Numbers**: INV-2024-0001 through INV-2024-0009

## 🎯 Demo User Experience

When someone logs in as the demo user, they will see:

### Dashboard
- **3 Active Projects** requiring attention
- **4 Pending Bills** worth $11,900
- **Recent Activity** from the last 30 days
- **Project Progress** indicators

### Projects Page
- **Diverse project types** (web, mobile, design, healthcare)
- **Different statuses** (active, completed, on hold)
- **Realistic descriptions** and timelines

### Bills Page
- **Professional invoices** with proper numbering
- **Mix of paid/pending** status
- **Realistic amounts** and descriptions
- **PDF generation** capability

### Project Detail Pages
- **Detailed project information**
- **Project-specific notes** and updates
- **Associated bills** and invoices
- **Progress tracking**

## 🔧 Troubleshooting

### Demo User Not Found
If you get an error about demo user not found:

1. Check if the user exists:
```sql
SELECT id, email FROM auth.users WHERE email = 'user@demo.com';
```

2. If not found, create the user through:
   - FreelanceOS signup form
   - Supabase Auth dashboard
   - Direct SQL insertion (not recommended)

### Data Already Exists
The automatic script clears existing demo data. If you want to keep existing data:

1. Comment out these lines in `demo-data-auto.sql`:
```sql
-- DELETE FROM bills WHERE project_id IN (SELECT id FROM projects WHERE user_id = demo_user_id);
-- DELETE FROM notes WHERE project_id IN (SELECT id FROM projects WHERE user_id = demo_user_id);
-- DELETE FROM projects WHERE user_id = demo_user_id;
```

### RLS Policy Issues
If you get permission errors:

1. Ensure RLS policies are properly set up
2. Check that the demo user is authenticated
3. Verify the user_id matches in all tables

## 📈 Customizing Demo Data

To modify the demo data:

1. **Edit project details** in the INSERT statements
2. **Adjust amounts** and dates as needed
3. **Add more notes** or bills for richer data
4. **Change project statuses** to show different scenarios

## 🔍 Monitoring Demo Usage

Track demo user activity:

```sql
-- Recent demo user activity
SELECT 
    'projects' as table_name,
    COUNT(*) as records,
    MAX(updated_at) as last_activity
FROM projects p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com'

UNION ALL

SELECT 
    'notes' as table_name,
    COUNT(*) as records,
    MAX(n.updated_at) as last_activity
FROM notes n
JOIN projects p ON n.project_id = p.id
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com'

UNION ALL

SELECT 
    'bills' as table_name,
    COUNT(*) as records,
    MAX(b.updated_at) as last_activity
FROM bills b
JOIN projects p ON b.project_id = p.id
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com';
```

## 🎉 Success!

After running these scripts, your demo user will have a fully populated FreelanceOS account that showcases all the platform's features with realistic, professional data.

Demo users can now:
- ✅ Explore active projects
- ✅ Review project notes and progress
- ✅ Generate and download PDF invoices
- ✅ See realistic financial data
- ✅ Experience the full FreelanceOS workflow
