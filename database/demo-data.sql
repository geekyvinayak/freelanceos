-- Demo Data for FreelanceOS
-- Run this script to populate the demo user account with sample projects, notes, and bills
-- Demo user: user@demo.com (password: Demo@123)

-- First, you need to get the user_id for the demo user
-- Run this query first to get the user_id:
-- SELECT id FROM auth.users WHERE email = 'user@demo.com';

-- Replace 'DEMO_USER_ID_HERE' with the actual UUID from the query above
-- Example: '12345678-1234-1234-1234-123456789012'

-- ============================================================================
-- STEP 1: Insert Sample Projects
-- ============================================================================

INSERT INTO projects (user_id, name, description, status, created_at) VALUES
(
    'DEMO_USER_ID_HERE',
    'E-commerce Website Redesign',
    'Complete redesign and development of a modern e-commerce platform for a fashion retailer. Includes responsive design, payment integration, inventory management, and customer portal.',
    'active',
    NOW() - INTERVAL '15 days'
),
(
    'DEMO_USER_ID_HERE',
    'Mobile Banking App',
    'Development of a secure mobile banking application with features like account management, money transfers, bill payments, and investment tracking. Built with React Native.',
    'active',
    NOW() - INTERVAL '30 days'
),
(
    'DEMO_USER_ID_HERE',
    'Corporate Brand Identity',
    'Complete brand identity design for a tech startup including logo design, color palette, typography, business cards, letterheads, and brand guidelines.',
    'completed',
    NOW() - INTERVAL '45 days'
),
(
    'DEMO_USER_ID_HERE',
    'Restaurant Management System',
    'Custom restaurant management system with POS integration, inventory tracking, staff scheduling, and customer loyalty program. Web-based dashboard with mobile app.',
    'on_hold',
    NOW() - INTERVAL '60 days'
),
(
    'DEMO_USER_ID_HERE',
    'Real Estate Platform',
    'Modern real estate listing platform with advanced search filters, virtual tours, agent profiles, and lead management system. Includes both web and mobile versions.',
    'active',
    NOW() - INTERVAL '10 days'
),
(
    'DEMO_USER_ID_HERE',
    'Healthcare Dashboard',
    'Patient management dashboard for healthcare providers with appointment scheduling, medical records, billing integration, and telemedicine features.',
    'completed',
    NOW() - INTERVAL '90 days'
);

-- ============================================================================
-- STEP 2: Insert Sample Notes for Projects
-- ============================================================================

-- Notes for E-commerce Website Redesign
INSERT INTO notes (project_id, content, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'E-commerce Website Redesign' AND user_id = 'DEMO_USER_ID_HERE'),
    'Initial client meeting completed. Discussed requirements for the new e-commerce platform. Client wants modern design with focus on mobile experience.',
    NOW() - INTERVAL '14 days'
),
(
    (SELECT id FROM projects WHERE name = 'E-commerce Website Redesign' AND user_id = 'DEMO_USER_ID_HERE'),
    'Wireframes and mockups approved by client. Moving forward with development phase. Using React.js for frontend and Node.js for backend.',
    NOW() - INTERVAL '10 days'
),
(
    (SELECT id FROM projects WHERE name = 'E-commerce Website Redesign' AND user_id = 'DEMO_USER_ID_HERE'),
    'Payment gateway integration completed. Stripe and PayPal both working correctly. Testing phase begins next week.',
    NOW() - INTERVAL '5 days'
);

-- Notes for Mobile Banking App
INSERT INTO notes (project_id, content, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Mobile Banking App' AND user_id = 'DEMO_USER_ID_HERE'),
    'Security audit completed. All encryption protocols meet banking standards. Ready for beta testing with select users.',
    NOW() - INTERVAL '25 days'
),
(
    (SELECT id FROM projects WHERE name = 'Mobile Banking App' AND user_id = 'DEMO_USER_ID_HERE'),
    'Beta testing feedback received. Users love the intuitive interface. Minor UI adjustments needed for accessibility compliance.',
    NOW() - INTERVAL '15 days'
),
(
    (SELECT id FROM projects WHERE name = 'Mobile Banking App' AND user_id = 'DEMO_USER_ID_HERE'),
    'App store submission prepared. All documentation and compliance requirements met. Expecting approval within 2 weeks.',
    NOW() - INTERVAL '7 days'
);

-- Notes for Corporate Brand Identity
INSERT INTO notes (project_id, content, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Corporate Brand Identity' AND user_id = 'DEMO_USER_ID_HERE'),
    'Brand discovery session completed. Client vision: modern, trustworthy, innovative. Target audience: tech-savvy professionals aged 25-45.',
    NOW() - INTERVAL '40 days'
),
(
    (SELECT id FROM projects WHERE name = 'Corporate Brand Identity' AND user_id = 'DEMO_USER_ID_HERE'),
    'Logo concepts presented. Client selected option 2 with minor modifications. Color palette finalized: deep blue, silver, white.',
    NOW() - INTERVAL '35 days'
),
(
    (SELECT id FROM projects WHERE name = 'Corporate Brand Identity' AND user_id = 'DEMO_USER_ID_HERE'),
    'All brand materials delivered. Client extremely satisfied with the final result. Brand guidelines document completed and approved.',
    NOW() - INTERVAL '30 days'
);

-- Notes for Restaurant Management System
INSERT INTO notes (project_id, content, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Restaurant Management System' AND user_id = 'DEMO_USER_ID_HERE'),
    'Project on hold due to client budget constraints. Will resume in Q2 2024. 60% of development completed.',
    NOW() - INTERVAL '45 days'
),
(
    (SELECT id FROM projects WHERE name = 'Restaurant Management System' AND user_id = 'DEMO_USER_ID_HERE'),
    'Client requested to pause project temporarily. All work backed up and documented for future continuation.',
    NOW() - INTERVAL '30 days'
);

-- Notes for Real Estate Platform
INSERT INTO notes (project_id, content, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Real Estate Platform' AND user_id = 'DEMO_USER_ID_HERE'),
    'Project kickoff meeting scheduled. Requirements gathering phase begins. Client wants integration with MLS database.',
    NOW() - INTERVAL '9 days'
),
(
    (SELECT id FROM projects WHERE name = 'Real Estate Platform' AND user_id = 'DEMO_USER_ID_HERE'),
    'Database schema designed. Property listing structure finalized. Starting with search functionality implementation.',
    NOW() - INTERVAL '5 days'
),
(
    (SELECT id FROM projects WHERE name = 'Real Estate Platform' AND user_id = 'DEMO_USER_ID_HERE'),
    'Advanced search filters implemented. Map integration working perfectly. Client very happy with progress so far.',
    NOW() - INTERVAL '2 days'
);

-- Notes for Healthcare Dashboard
INSERT INTO notes (project_id, content, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Healthcare Dashboard' AND user_id = 'DEMO_USER_ID_HERE'),
    'HIPAA compliance review completed. All security measures implemented correctly. Dashboard ready for production deployment.',
    NOW() - INTERVAL '85 days'
),
(
    (SELECT id FROM projects WHERE name = 'Healthcare Dashboard' AND user_id = 'DEMO_USER_ID_HERE'),
    'Project successfully delivered. Client reported 40% improvement in patient management efficiency. Excellent feedback received.',
    NOW() - INTERVAL '80 days'
);

-- ============================================================================
-- STEP 3: Insert Sample Bills/Invoices
-- ============================================================================

-- Bills for E-commerce Website Redesign
INSERT INTO bills (project_id, invoice_number, amount, description, status, due_date, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'E-commerce Website Redesign' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0001',
    3500.00,
    'E-commerce Website Redesign - Phase 1: Design and Wireframing. Includes user research, wireframes, mockups, and design system creation.',
    'paid',
    CURRENT_DATE - INTERVAL '10 days',
    NOW() - INTERVAL '12 days'
),
(
    (SELECT id FROM projects WHERE name = 'E-commerce Website Redesign' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0002',
    4200.00,
    'E-commerce Website Redesign - Phase 2: Frontend Development. React.js implementation, responsive design, and component library.',
    'pending',
    CURRENT_DATE + INTERVAL '15 days',
    NOW() - INTERVAL '5 days'
);

-- Bills for Mobile Banking App
INSERT INTO bills (project_id, invoice_number, amount, description, status, due_date, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Mobile Banking App' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0003',
    8500.00,
    'Mobile Banking App Development - Complete app development with security features, user authentication, and core banking functionalities.',
    'paid',
    CURRENT_DATE - INTERVAL '20 days',
    NOW() - INTERVAL '25 days'
),
(
    (SELECT id FROM projects WHERE name = 'Mobile Banking App' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0004',
    2800.00,
    'Mobile Banking App - Security Audit and Testing. Comprehensive security testing, penetration testing, and compliance verification.',
    'paid',
    CURRENT_DATE - INTERVAL '5 days',
    NOW() - INTERVAL '10 days'
);

-- Bills for Corporate Brand Identity
INSERT INTO bills (project_id, invoice_number, amount, description, status, due_date, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Corporate Brand Identity' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0005',
    2200.00,
    'Corporate Brand Identity Package - Logo design, color palette, typography, business cards, letterheads, and comprehensive brand guidelines.',
    'paid',
    CURRENT_DATE - INTERVAL '35 days',
    NOW() - INTERVAL '40 days'
);

-- Bills for Restaurant Management System
INSERT INTO bills (project_id, invoice_number, amount, description, status, due_date, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Restaurant Management System' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0006',
    4500.00,
    'Restaurant Management System - Phase 1: Core system development including POS integration, inventory management, and basic reporting.',
    'pending',
    CURRENT_DATE + INTERVAL '30 days',
    NOW() - INTERVAL '50 days'
);

-- Bills for Real Estate Platform
INSERT INTO bills (project_id, invoice_number, amount, description, status, due_date, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Real Estate Platform' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0007',
    3200.00,
    'Real Estate Platform - Initial Development Phase. Database design, property listing system, and search functionality implementation.',
    'pending',
    CURRENT_DATE + INTERVAL '20 days',
    NOW() - INTERVAL '8 days'
);

-- Bills for Healthcare Dashboard
INSERT INTO bills (project_id, invoice_number, amount, description, status, due_date, created_at) VALUES
(
    (SELECT id FROM projects WHERE name = 'Healthcare Dashboard' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0008',
    6800.00,
    'Healthcare Dashboard Development - Complete patient management system with HIPAA compliance, appointment scheduling, and reporting features.',
    'paid',
    CURRENT_DATE - INTERVAL '85 days',
    NOW() - INTERVAL '90 days'
),
(
    (SELECT id FROM projects WHERE name = 'Healthcare Dashboard' AND user_id = 'DEMO_USER_ID_HERE'),
    'INV-2024-0009',
    1500.00,
    'Healthcare Dashboard - Maintenance and Support Package. 6 months of technical support, bug fixes, and minor feature updates.',
    'paid',
    CURRENT_DATE - INTERVAL '75 days',
    NOW() - INTERVAL '80 days'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the data was inserted correctly:

-- Check projects count
-- SELECT COUNT(*) as project_count FROM projects WHERE user_id = 'DEMO_USER_ID_HERE';

-- Check notes count
-- SELECT COUNT(*) as notes_count FROM notes n 
-- JOIN projects p ON n.project_id = p.id 
-- WHERE p.user_id = 'DEMO_USER_ID_HERE';

-- Check bills count and total amount
-- SELECT COUNT(*) as bills_count, SUM(amount) as total_amount FROM bills b
-- JOIN projects p ON b.project_id = p.id 
-- WHERE p.user_id = 'DEMO_USER_ID_HERE';

-- ============================================================================
-- INSTRUCTIONS FOR USE:
-- ============================================================================

-- 1. First, find the demo user ID:
--    SELECT id FROM auth.users WHERE email = 'user@demo.com';

-- 2. Replace all instances of 'DEMO_USER_ID_HERE' with the actual UUID

-- 3. Run this script in your Supabase SQL editor

-- 4. Verify the data using the verification queries above

-- This will create:
-- - 6 diverse projects (2 active, 2 completed, 1 on_hold, 1 active)
-- - 15 realistic project notes
-- - 9 invoices totaling $37,200 (5 paid, 4 pending)
