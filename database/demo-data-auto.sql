-- Auto Demo Data for FreelanceOS
-- This script automatically finds the demo user and populates their account
-- Demo user: user@demo.com (password: Demo@123)

-- ============================================================================
-- AUTOMATIC DEMO DATA INSERTION
-- ============================================================================

DO $$
DECLARE
    demo_user_id UUID;
    project_ecommerce UUID;
    project_banking UUID;
    project_brand UUID;
    project_restaurant UUID;
    project_realestate UUID;
    project_healthcare UUID;
BEGIN
    -- Get the demo user ID
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'user@demo.com';
    
    IF demo_user_id IS NULL THEN
        RAISE EXCEPTION 'Demo user not found. Please ensure user@demo.com exists in auth.users';
    END IF;

    -- Clear existing demo data (optional - remove if you want to keep existing data)
    DELETE FROM bills WHERE project_id IN (SELECT id FROM projects WHERE user_id = demo_user_id);
    DELETE FROM notes WHERE project_id IN (SELECT id FROM projects WHERE user_id = demo_user_id);
    DELETE FROM projects WHERE user_id = demo_user_id;

    -- Insert Projects and capture IDs
    INSERT INTO projects (user_id, name, description, status, created_at) VALUES
    (demo_user_id, 'E-commerce Website Redesign', 'Complete redesign and development of a modern e-commerce platform for a fashion retailer. Includes responsive design, payment integration, inventory management, and customer portal.', 'active', NOW() - INTERVAL '15 days')
    RETURNING id INTO project_ecommerce;

    INSERT INTO projects (user_id, name, description, status, created_at) VALUES
    (demo_user_id, 'Mobile Banking App', 'Development of a secure mobile banking application with features like account management, money transfers, bill payments, and investment tracking. Built with React Native.', 'active', NOW() - INTERVAL '30 days')
    RETURNING id INTO project_banking;

    INSERT INTO projects (user_id, name, description, status, created_at) VALUES
    (demo_user_id, 'Corporate Brand Identity', 'Complete brand identity design for a tech startup including logo design, color palette, typography, business cards, letterheads, and brand guidelines.', 'completed', NOW() - INTERVAL '45 days')
    RETURNING id INTO project_brand;

    INSERT INTO projects (user_id, name, description, status, created_at) VALUES
    (demo_user_id, 'Restaurant Management System', 'Custom restaurant management system with POS integration, inventory tracking, staff scheduling, and customer loyalty program. Web-based dashboard with mobile app.', 'on_hold', NOW() - INTERVAL '60 days')
    RETURNING id INTO project_restaurant;

    INSERT INTO projects (user_id, name, description, status, created_at) VALUES
    (demo_user_id, 'Real Estate Platform', 'Modern real estate listing platform with advanced search filters, virtual tours, agent profiles, and lead management system. Includes both web and mobile versions.', 'active', NOW() - INTERVAL '10 days')
    RETURNING id INTO project_realestate;

    INSERT INTO projects (user_id, name, description, status, created_at) VALUES
    (demo_user_id, 'Healthcare Dashboard', 'Patient management dashboard for healthcare providers with appointment scheduling, medical records, billing integration, and telemedicine features.', 'completed', NOW() - INTERVAL '90 days')
    RETURNING id INTO project_healthcare;

    -- Insert Notes
    INSERT INTO notes (project_id, content, created_at) VALUES
    -- E-commerce notes
    (project_ecommerce, 'Initial client meeting completed. Discussed requirements for the new e-commerce platform. Client wants modern design with focus on mobile experience.', NOW() - INTERVAL '14 days'),
    (project_ecommerce, 'Wireframes and mockups approved by client. Moving forward with development phase. Using React.js for frontend and Node.js for backend.', NOW() - INTERVAL '10 days'),
    (project_ecommerce, 'Payment gateway integration completed. Stripe and PayPal both working correctly. Testing phase begins next week.', NOW() - INTERVAL '5 days'),
    
    -- Banking app notes
    (project_banking, 'Security audit completed. All encryption protocols meet banking standards. Ready for beta testing with select users.', NOW() - INTERVAL '25 days'),
    (project_banking, 'Beta testing feedback received. Users love the intuitive interface. Minor UI adjustments needed for accessibility compliance.', NOW() - INTERVAL '15 days'),
    (project_banking, 'App store submission prepared. All documentation and compliance requirements met. Expecting approval within 2 weeks.', NOW() - INTERVAL '7 days'),
    
    -- Brand identity notes
    (project_brand, 'Brand discovery session completed. Client vision: modern, trustworthy, innovative. Target audience: tech-savvy professionals aged 25-45.', NOW() - INTERVAL '40 days'),
    (project_brand, 'Logo concepts presented. Client selected option 2 with minor modifications. Color palette finalized: deep blue, silver, white.', NOW() - INTERVAL '35 days'),
    (project_brand, 'All brand materials delivered. Client extremely satisfied with the final result. Brand guidelines document completed and approved.', NOW() - INTERVAL '30 days'),
    
    -- Restaurant system notes
    (project_restaurant, 'Project on hold due to client budget constraints. Will resume in Q2 2024. 60% of development completed.', NOW() - INTERVAL '45 days'),
    (project_restaurant, 'Client requested to pause project temporarily. All work backed up and documented for future continuation.', NOW() - INTERVAL '30 days'),
    
    -- Real estate notes
    (project_realestate, 'Project kickoff meeting scheduled. Requirements gathering phase begins. Client wants integration with MLS database.', NOW() - INTERVAL '9 days'),
    (project_realestate, 'Database schema designed. Property listing structure finalized. Starting with search functionality implementation.', NOW() - INTERVAL '5 days'),
    (project_realestate, 'Advanced search filters implemented. Map integration working perfectly. Client very happy with progress so far.', NOW() - INTERVAL '2 days'),
    
    -- Healthcare notes
    (project_healthcare, 'HIPAA compliance review completed. All security measures implemented correctly. Dashboard ready for production deployment.', NOW() - INTERVAL '85 days'),
    (project_healthcare, 'Project successfully delivered. Client reported 40% improvement in patient management efficiency. Excellent feedback received.', NOW() - INTERVAL '80 days');

    -- Insert Bills
    INSERT INTO bills (project_id, invoice_number, amount, description, status, due_date, created_at) VALUES
    -- E-commerce bills
    (project_ecommerce, 'INV-2024-0001', 3500.00, 'E-commerce Website Redesign - Phase 1: Design and Wireframing. Includes user research, wireframes, mockups, and design system creation.', 'paid', CURRENT_DATE - INTERVAL '10 days', NOW() - INTERVAL '12 days'),
    (project_ecommerce, 'INV-2024-0002', 4200.00, 'E-commerce Website Redesign - Phase 2: Frontend Development. React.js implementation, responsive design, and component library.', 'pending', CURRENT_DATE + INTERVAL '15 days', NOW() - INTERVAL '5 days'),
    
    -- Banking app bills
    (project_banking, 'INV-2024-0003', 8500.00, 'Mobile Banking App Development - Complete app development with security features, user authentication, and core banking functionalities.', 'paid', CURRENT_DATE - INTERVAL '20 days', NOW() - INTERVAL '25 days'),
    (project_banking, 'INV-2024-0004', 2800.00, 'Mobile Banking App - Security Audit and Testing. Comprehensive security testing, penetration testing, and compliance verification.', 'paid', CURRENT_DATE - INTERVAL '5 days', NOW() - INTERVAL '10 days'),
    
    -- Brand identity bill
    (project_brand, 'INV-2024-0005', 2200.00, 'Corporate Brand Identity Package - Logo design, color palette, typography, business cards, letterheads, and comprehensive brand guidelines.', 'paid', CURRENT_DATE - INTERVAL '35 days', NOW() - INTERVAL '40 days'),
    
    -- Restaurant system bill
    (project_restaurant, 'INV-2024-0006', 4500.00, 'Restaurant Management System - Phase 1: Core system development including POS integration, inventory management, and basic reporting.', 'pending', CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '50 days'),
    
    -- Real estate bill
    (project_realestate, 'INV-2024-0007', 3200.00, 'Real Estate Platform - Initial Development Phase. Database design, property listing system, and search functionality implementation.', 'pending', CURRENT_DATE + INTERVAL '20 days', NOW() - INTERVAL '8 days'),
    
    -- Healthcare bills
    (project_healthcare, 'INV-2024-0008', 6800.00, 'Healthcare Dashboard Development - Complete patient management system with HIPAA compliance, appointment scheduling, and reporting features.', 'paid', CURRENT_DATE - INTERVAL '85 days', NOW() - INTERVAL '90 days'),
    (project_healthcare, 'INV-2024-0009', 1500.00, 'Healthcare Dashboard - Maintenance and Support Package. 6 months of technical support, bug fixes, and minor feature updates.', 'paid', CURRENT_DATE - INTERVAL '75 days', NOW() - INTERVAL '80 days');

    -- Output summary
    RAISE NOTICE 'Demo data inserted successfully for user: %', demo_user_id;
    RAISE NOTICE 'Created 6 projects, 15 notes, and 9 bills';
    RAISE NOTICE 'Total invoice amount: $37,200 (5 paid: $25,300, 4 pending: $11,900)';

END $$;
