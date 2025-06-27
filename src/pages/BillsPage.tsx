import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { LoadingState } from '@/components/ui/LoadingSpinner'
import { BillForm } from '@/components/billing/BillForm'
import { InvoicePreview } from '@/components/billing/InvoicePreview'
import { Plus, Search, Receipt, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { billService } from '@/services/database'
import { useToast } from '@/hooks/useToast'
import type { Bill } from '@/types'

export function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showBillForm, setShowBillForm] = useState(false)
  const [editingBill, setEditingBill] = useState<Bill | null>(null)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [previewBill, setPreviewBill] = useState<Bill | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const billsData = await billService.getAll()
      setBills(billsData)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load bills',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (billId: string, newStatus: 'paid' | 'pending') => {
    try {
      const updatedBill = newStatus === 'paid' 
        ? await billService.markAsPaid(billId)
        : await billService.markAsPending(billId)
      
      setBills(prev => prev.map(bill => 
        bill.id === billId ? updatedBill : bill
      ))
      
      toast({
        title: 'Success',
        description: `Bill marked as ${newStatus}`,
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update bill status',
        variant: 'destructive',
      })
    }
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getTotalStats = () => {
    const totalPaid = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + Number(b.amount), 0)
    const totalPending = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + Number(b.amount), 0)
    return { totalPaid, totalPending, totalRevenue: totalPaid + totalPending }
  }

  const stats = getTotalStats()

  const handleCreateBill = () => {
    setEditingBill(null)
    setShowBillForm(true)
  }

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill)
    setShowBillForm(true)
  }

  const handleFormSuccess = () => {
    loadData()
  }

  const handleViewInvoice = (bill: Bill) => {
    setPreviewBill(bill)
    setShowInvoicePreview(true)
  }

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading bills..." />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bills & Invoices</h1>
            <p className="text-gray-600">Manage your billing and track payments</p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={handleCreateBill}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalPaid)}
              </div>
              <p className="text-xs text-gray-600">Received payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(stats.totalPending)}
              </div>
              <p className="text-xs text-gray-600">Awaiting payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bills List */}
        {filteredBills.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Receipt className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {bills.length === 0 ? 'No invoices yet' : 'No invoices found'}
              </h3>
              <p className="text-gray-500 text-center mb-6">
                {bills.length === 0 
                  ? 'Create your first invoice to start tracking payments'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {bills.length === 0 && (
                <Button onClick={handleCreateBill}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Invoice
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBills.map((bill) => (
              <Card key={bill.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bill.invoice_number}
                        </h3>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                          {getStatusIcon(bill.status)}
                          <span className="capitalize">{bill.status}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{bill.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          Due: {new Date(bill.due_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" />
                          {formatCurrency(Number(bill.amount))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={bill.status}
                        onValueChange={(value: 'paid' | 'pending') => handleStatusChange(bill.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInvoice(bill)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBill(bill)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bill Form Dialog */}
        <BillForm
          open={showBillForm}
          onOpenChange={setShowBillForm}
          bill={editingBill}
          onSuccess={handleFormSuccess}
        />

        {/* Invoice Preview Dialog */}
        <InvoicePreview
          open={showInvoicePreview}
          onOpenChange={setShowInvoicePreview}
          bill={previewBill}
        />
      </div>
    </MainLayout>
  )
}
