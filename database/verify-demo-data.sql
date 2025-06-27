-- Verification Script for Demo Data
-- Run this to check if demo data was inserted correctly

-- Get demo user info
SELECT 
    'Demo User Info' as section,
    id as user_id,
    email,
    created_at
FROM auth.users 
WHERE email = 'user@demo.com';

-- Projects summary
SELECT 
    'Projects Summary' as section,
    COUNT(*) as total_projects,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN status = 'on_hold' THEN 1 END) as on_hold_projects
FROM projects p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com';

-- Projects list
SELECT 
    'Projects List' as section,
    p.name,
    p.status,
    p.created_at,
    LENGTH(p.description) as description_length
FROM projects p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com'
ORDER BY p.created_at DESC;

-- Notes summary
SELECT 
    'Notes Summary' as section,
    COUNT(*) as total_notes,
    COUNT(DISTINCT n.project_id) as projects_with_notes
FROM notes n
JOIN projects p ON n.project_id = p.id
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com';

-- Notes by project
SELECT 
    'Notes by Project' as section,
    p.name as project_name,
    COUNT(n.id) as note_count
FROM projects p
LEFT JOIN notes n ON p.id = n.project_id
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com'
GROUP BY p.id, p.name
ORDER BY note_count DESC;

-- Bills summary
SELECT 
    'Bills Summary' as section,
    COUNT(*) as total_bills,
    COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_bills,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bills,
    SUM(amount) as total_amount,
    SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_amount,
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount
FROM bills b
JOIN projects p ON b.project_id = p.id
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com';

-- Bills list
SELECT 
    'Bills List' as section,
    b.invoice_number,
    p.name as project_name,
    b.amount,
    b.status,
    b.due_date,
    b.created_at
FROM bills b
JOIN projects p ON b.project_id = p.id
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com'
ORDER BY b.created_at DESC;

-- Recent activity (last 30 days)
SELECT 
    'Recent Activity' as section,
    'Project' as type,
    p.name as item,
    p.created_at as date
FROM projects p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com' 
AND p.created_at > NOW() - INTERVAL '30 days'

UNION ALL

SELECT 
    'Recent Activity' as section,
    'Note' as type,
    LEFT(n.content, 50) || '...' as item,
    n.created_at as date
FROM notes n
JOIN projects p ON n.project_id = p.id
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com' 
AND n.created_at > NOW() - INTERVAL '30 days'

UNION ALL

SELECT 
    'Recent Activity' as section,
    'Bill' as type,
    b.invoice_number || ' - $' || b.amount as item,
    b.created_at as date
FROM bills b
JOIN projects p ON b.project_id = p.id
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'user@demo.com' 
AND b.created_at > NOW() - INTERVAL '30 days'

ORDER BY date DESC;

-- Dashboard stats (what user would see on dashboard)
SELECT 
    'Dashboard Stats' as section,
    (SELECT COUNT(*) FROM projects p JOIN auth.users u ON p.user_id = u.id WHERE u.email = 'user@demo.com' AND p.status = 'active') as active_projects,
    (SELECT COUNT(*) FROM bills b JOIN projects p ON b.project_id = p.id JOIN auth.users u ON p.user_id = u.id WHERE u.email = 'user@demo.com' AND b.status = 'pending') as pending_bills,
    (SELECT SUM(amount) FROM bills b JOIN projects p ON b.project_id = p.id JOIN auth.users u ON p.user_id = u.id WHERE u.email = 'user@demo.com' AND b.status = 'pending') as pending_amount,
    (SELECT COUNT(*) FROM notes n JOIN projects p ON n.project_id = p.id JOIN auth.users u ON p.user_id = u.id WHERE u.email = 'user@demo.com' AND n.created_at > NOW() - INTERVAL '7 days') as recent_notes;
