import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { billService, projectService } from '@/services/database'
import { useToast } from '@/hooks/useToast'
import type { Bill, Project } from '@/types'

interface BillFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill?: Bill | null
  onSuccess: () => void
  preSelectedProjectId?: string
}

export function BillForm({ open, onOpenChange, bill, onSuccess, preSelectedProjectId }: BillFormProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [formData, setFormData] = useState({
    project_id: bill?.project_id || preSelectedProjectId || '',
    amount: bill?.amount?.toString() || '',
    description: bill?.description || '',
    status: bill?.status || 'pending',
    due_date: bill?.due_date || ''
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadProjects()
    }
  }, [open])

  useEffect(() => {
    if (bill) {
      setFormData({
        project_id: bill.project_id,
        amount: bill.amount.toString(),
        description: bill.description,
        status: bill.status,
        due_date: bill.due_date
      })
    } else {
      setFormData({
        project_id: preSelectedProjectId || '',
        amount: '',
        description: '',
        status: 'pending',
        due_date: ''
      })
    }
  }, [bill])

  const loadProjects = async () => {
    try {
      const projectsData = await projectService.getAll()
      setProjects(projectsData)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load projects',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const billData = {
        project_id: formData.project_id,
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: formData.status as 'paid' | 'pending',
        due_date: formData.due_date
      }

      if (bill) {
        // Update existing bill
        await billService.update(bill.id, billData)
        toast({
          title: 'Success',
          description: 'Invoice updated successfully',
          variant: 'success',
        })
      } else {
        // Create new bill
        await billService.create(billData)
        toast({
          title: 'Success',
          description: 'Invoice created successfully',
          variant: 'success',
        })
      }
      
      onSuccess()
      onOpenChange(false)
      
      // Reset form if creating new bill
      if (!bill) {
        setFormData({
          project_id: '',
          amount: '',
          description: '',
          status: 'pending',
          due_date: ''
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save invoice',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {bill ? 'Edit Invoice' : 'Create New Invoice'}
          </DialogTitle>
          <DialogDescription>
            {bill 
              ? 'Update your invoice details below.'
              : 'Create a new invoice for your project. Fill in the details below.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="project_id" className="text-sm font-medium text-gray-700">
              Project *
            </label>
            <Select value={formData.project_id} onValueChange={(value) => handleInputChange('project_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount *
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter invoice description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="due_date" className="text-sm font-medium text-gray-700">
              Due Date *
            </label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.project_id || !formData.amount || !formData.description || !formData.due_date}>
              {loading ? 'Saving...' : (bill ? 'Update Invoice' : 'Create Invoice')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
