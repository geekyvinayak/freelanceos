import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
)

export default async function handler(req, res) {
  // Verify the request is from Vercel Cron
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Optional: Add authentication check
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Replace this with your actual demo user ID from Supabase Auth dashboard
    // Go to Supabase Dashboard → Authentication → Users → find user@demo.com → copy User ID
    let userId = '5ef288d4-e9eb-4e17-8d8a-bbe41073441a'

    // Try to find existing user ID from projects table
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('user_id')
      .limit(1)

    if (existingProjects && existingProjects.length > 0) {
      userId = existingProjects[0].user_id
      console.log('Using existing user ID from projects:', userId)
    } else {
      console.log('Using default demo user ID:', userId)
    }

    // Delete existing data (in correct order)
    console.log('Deleting existing data...')

    // Get project IDs first
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId)

    const projectIds = projects?.map(p => p.id) || []

    if (projectIds.length > 0) {
      // Delete bills
      await supabase
        .from('bills')
        .delete()
        .in('project_id', projectIds)

      // Delete notes
      await supabase
        .from('notes')
        .delete()
        .in('project_id', projectIds)
    }

    // Delete projects
    await supabase
      .from('projects')
      .delete()
      .eq('user_id', userId)

    console.log('Inserting new demo data...')

    // Insert projects
    const { data: newProjects, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userId,
          name: 'E-commerce Website Redesign',
          description: 'Complete redesign and development of a modern e-commerce platform for a fashion retailer. Includes responsive design, payment integration, inventory management, and customer portal.',
          status: 'active',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          user_id: userId,
          name: 'Mobile Banking App',
          description: 'Development of a secure mobile banking application with features like account management, money transfers, bill payments, and investment tracking. Built with React Native.',
          status: 'active',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          user_id: userId,
          name: 'Corporate Brand Identity',
          description: 'Complete brand identity design for a tech startup including logo design, color palette, typography, business cards, letterheads, and brand guidelines.',
          status: 'completed',
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          user_id: userId,
          name: 'Restaurant Management System',
          description: 'Custom restaurant management system with POS integration, inventory tracking, staff scheduling, and customer loyalty program. Web-based dashboard with mobile app.',
          status: 'on_hold',
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          user_id: userId,
          name: 'Real Estate Platform',
          description: 'Modern real estate listing platform with advanced search filters, virtual tours, agent profiles, and lead management system. Includes both web and mobile versions.',
          status: 'active',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          user_id: userId,
          name: 'Healthcare Dashboard',
          description: 'Patient management dashboard for healthcare providers with appointment scheduling, medical records, billing integration, and telemedicine features.',
          status: 'completed',
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      ])
      .select()

    if (projectError) {
      console.error('Error inserting projects:', projectError)
      return res.status(500).json({ error: 'Failed to insert projects' })
    }

    // Get project IDs for notes and bills
    const projectMap = {}
    newProjects?.forEach(project => {
      projectMap[project.name] = project.id
    })

    // Insert notes
    const { error: notesError } = await supabase
      .from('notes')
      .insert([
        {
          project_id: projectMap['E-commerce Website Redesign'],
          content: 'Initial client meeting completed. Discussed requirements for the new e-commerce platform. Client wants modern design with focus on mobile experience.',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['E-commerce Website Redesign'],
          content: 'Wireframes and mockups approved by client. Moving forward with development phase. Using React.js for frontend and Node.js for backend.',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['E-commerce Website Redesign'],
          content: 'Payment gateway integration completed. Stripe and PayPal both working correctly. Testing phase begins next week.',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Mobile Banking App'],
          content: 'Security audit completed. All encryption protocols meet banking standards. Ready for beta testing with select users.',
          created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Mobile Banking App'],
          content: 'Beta testing feedback received. Users love the intuitive interface. Minor UI adjustments needed for accessibility compliance.',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Mobile Banking App'],
          content: 'App store submission prepared. All documentation and compliance requirements met. Expecting approval within 2 weeks.',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Corporate Brand Identity'],
          content: 'Brand discovery session completed. Client vision: modern, trustworthy, innovative. Target audience: tech-savvy professionals aged 25-45.',
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Corporate Brand Identity'],
          content: 'Logo concepts presented. Client selected option 2 with minor modifications. Color palette finalized: deep blue, silver, white.',
          created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Corporate Brand Identity'],
          content: 'All brand materials delivered. Client extremely satisfied with the final result. Brand guidelines document completed and approved.',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Restaurant Management System'],
          content: 'Project on hold due to client budget constraints. Will resume in Q2 2024. 60% of development completed.',
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Restaurant Management System'],
          content: 'Client requested to pause project temporarily. All work backed up and documented for future continuation.',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Real Estate Platform'],
          content: 'Project kickoff meeting scheduled. Requirements gathering phase begins. Client wants integration with MLS database.',
          created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Real Estate Platform'],
          content: 'Database schema designed. Property listing structure finalized. Starting with search functionality implementation.',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Real Estate Platform'],
          content: 'Advanced search filters implemented. Map integration working perfectly. Client very happy with progress so far.',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Healthcare Dashboard'],
          content: 'HIPAA compliance review completed. All security measures implemented correctly. Dashboard ready for production deployment.',
          created_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString()
        }
      ])

    if (notesError) {
      console.error('Error inserting notes:', notesError)
      return res.status(500).json({ error: 'Failed to insert notes' })
    }

    // Insert bills
    const { error: billsError } = await supabase
      .from('bills')
      .insert([
        {
          project_id: projectMap['E-commerce Website Redesign'],
          invoice_number: 'DEM-2023-0001',
          amount: 3500.00,
          description: 'E-commerce Website Redesign - Phase 1: Design and Wireframing',
          status: 'paid',
          due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['E-commerce Website Redesign'],
          invoice_number: 'DEM-2023-0002',
          amount: 4200.00,
          description: 'E-commerce Website Redesign - Phase 2: Frontend Development',
          status: 'pending',
          due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Mobile Banking App'],
          invoice_number: 'DEM-2023-0003',
          amount: 8500.00,
          description: 'Mobile Banking App Development - Complete app development',
          status: 'paid',
          due_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Mobile Banking App'],
          invoice_number: 'DEM-2023-0004',
          amount: 2800.00,
          description: 'Mobile Banking App - Security Audit and Testing',
          status: 'paid',
          due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Corporate Brand Identity'],
          invoice_number: 'DEM-2023-0005',
          amount: 2200.00,
          description: 'Corporate Brand Identity Package - Complete branding',
          status: 'paid',
          due_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Restaurant Management System'],
          invoice_number: 'DEM-2023-0006',
          amount: 4500.00,
          description: 'Restaurant Management System - Phase 1 Development',
          status: 'pending',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Real Estate Platform'],
          invoice_number: 'DEM-2023-0007',
          amount: 3200.00,
          description: 'Real Estate Platform - Initial Development Phase',
          status: 'pending',
          due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Healthcare Dashboard'],
          invoice_number: 'DEM-2023-0008',
          amount: 6800.00,
          description: 'Healthcare Dashboard Development - Complete system',
          status: 'paid',
          due_date: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          project_id: projectMap['Healthcare Dashboard'],
          invoice_number: 'DEM-2023-0009',
          amount: 1500.00,
          description: 'Healthcare Dashboard - Maintenance and Support Package',
          status: 'paid',
          due_date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString()
        }
      ])

    if (billsError) {
      console.error('Error inserting bills:', billsError)
      return res.status(500).json({ error: 'Failed to insert bills' })
    }

    console.log('Demo data reset completed successfully')
    return res.status(200).json({
      message: 'Demo data reset successfully',
      projects: newProjects?.length || 0,
      notes: 15,
      bills: 9,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in reset function:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
