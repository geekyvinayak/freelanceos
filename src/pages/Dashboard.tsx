
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FolderOpen, Receipt, Mail, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalBills: number
  pendingAmount: number
  recentActivity: Array<{
    id: string
    type: 'project' | 'bill' | 'note'
    title: string
    date: string
  }>
}

export function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalBills: 0,
    pendingAmount: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, status')
        .eq('user_id', user?.id)

      // Calculate project stats
      const totalProjects = projects?.length || 0
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0

      // Fetch bills using a simpler approach that works with RLS
      const { data: bills } = await supabase
        .from('bills')
        .select(`
          id,
          amount,
          status,
          description,
          created_at,
          project_id,
          projects!inner (
            user_id
          )
        `)
        .eq('projects.user_id', user?.id)

      // Calculate bill stats
      const totalBills = bills?.length || 0
      const pendingAmount = bills
        ?.filter(b => b.status === 'pending')
        .reduce((sum, b) => sum + Number(b.amount), 0) || 0

      // Debug logging
      console.log('Dashboard Stats Debug:', {
        totalProjects,
        activeProjects,
        totalBills,
        pendingAmount,
        billsData: bills?.map(b => ({ id: b.id, amount: b.amount, status: b.status }))
      })

      // Fetch recent projects
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, name, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3)

      // Get recent bills from the bills we already fetched
      const recentBills = bills
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2) || []

      const recentActivity = [
        ...(recentProjects?.map(p => ({
          id: p.id,
          type: 'project' as const,
          title: `Created project: ${p.name}`,
          date: new Date(p.created_at).toLocaleDateString()
        })) || []),
        ...(recentBills.map(b => ({
          id: b.id,
          type: 'bill' as const,
          title: `Created invoice: ${b.description}`,
          date: new Date(b.created_at).toLocaleDateString()
        })) || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

      setStats({
        totalProjects,
        activeProjects,
        totalBills,
        pendingAmount,
        recentActivity
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your freelance business.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">
                {loading ? '...' : stats.activeProjects}
              </div>
              <p className="text-xs text-gray-600">
                Active projects ({loading ? '...' : stats.totalProjects} total)
              </p>
              <Link to="/projects">
                <Button className="mt-4 w-full" variant="outline" size="sm">
                  View Projects
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bills Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bills & Invoices</CardTitle>
              <Receipt className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${loading ? '...' : stats.pendingAmount.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600">
                Pending amount ({loading ? '...' : stats.totalBills} total bills)
              </p>
              <Link to="/bills">
                <Button className="mt-4 w-full" variant="outline" size="sm">
                  View Bills
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Email Assistant Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Email Assistant</CardTitle>
              <Mail className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">✨</div>
              <p className="text-xs text-gray-600">AI-powered writing</p>
              <Link to="/email">
                <Button className="mt-4 w-full" variant="outline" size="sm">
                  Write Email
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <Link to="/projects">
                <Button className="w-full justify-start mb-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </Link>
              <Link to="/bills">
                <Button className="w-full justify-start mb-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </Link>
              <Link to="/email">
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Write Email
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Loading...</p>
                </div>
              ) : stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 text-sm">
                      <div className="flex-shrink-0">
                        {activity.type === 'project' ? (
                          <FolderOpen className="h-4 w-4 text-blue-500" />
                        ) : activity.type === 'bill' ? (
                          <Receipt className="h-4 w-4 text-green-500" />
                        ) : (
                          <Mail className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">{activity.title}</p>
                        <p className="text-gray-500 text-xs">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start by creating your first project!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
