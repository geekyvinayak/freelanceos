import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Download, Eye } from 'lucide-react'
import { projectService } from '@/services/database'
import { downloadInvoicePDF, previewInvoicePDF } from '@/utils/pdfGenerator'
import { useToast } from '@/hooks/useToast'
import type { Bill, Project } from '@/types'

interface InvoicePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill: Bill | null
}

export function InvoicePreview({ open, onOpenChange, bill }: InvoicePreviewProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (bill && open) {
      loadProject()
    }
  }, [bill, open])

  const loadProject = async () => {
    if (!bill) return
    
    try {
      setLoading(true)
      const projectData = await projectService.getById(bill.project_id)
      setProject(projectData)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load project details',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!bill) return
    
    try {
      downloadInvoicePDF({
        ...bill,
        project: project || undefined
      })
      
      toast({
        title: 'Success',
        description: 'Invoice downloaded successfully',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive',
      })
    }
  }

  const handlePreview = () => {
    if (!bill) return
    
    try {
      previewInvoicePDF({
        ...bill,
        project: project || undefined
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to preview invoice',
        variant: 'destructive',
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

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

  if (!bill) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gray-50">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">Invoice Preview</DialogTitle>
          <DialogDescription className="text-gray-500">
            Review and download your professional invoice
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-8 py-6">
            {/* Invoice Header - Clean & Minimal */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Invoice #{bill.invoice_number}
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(bill.status)}`}>
                  {bill.status}
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Created on {new Date(bill.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Main Invoice Content - Clean Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left Column */}
              <div className="space-y-6">
                {/* Project Info */}
                {project && (
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Project</h4>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{project.name}</p>
                      {project.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Invoice Details */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-600">Due Date</span>
                      <span className="font-medium text-gray-900">
                        {new Date(bill.due_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="font-semibold text-lg text-gray-900">{formatCurrency(Number(bill.amount))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{bill.description}</p>
                </div>

                {/* Company Info */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">From</h4>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">FreelanceOS</p>
                    <p className="text-sm text-gray-600">123 Business St, City, State 12345</p>
                    <p className="text-sm text-gray-600">contact@freelanceos.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount - Prominent Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Amount</p>
                  <p className="text-xs text-gray-500 mt-1">Due by {new Date(bill.due_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(Number(bill.amount))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t pt-6 mt-8">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Close
            </Button>
            <div className="flex gap-3 flex-1">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={loading}
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview PDF
              </Button>
              <Button
                onClick={handleDownload}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
