import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Receipt, FileText, DollarSign } from 'lucide-react'
import { projectService, noteService, billService } from '@/services/database'
import { BillForm } from '@/components/billing/BillForm'
import { useToast } from '@/hooks/useToast'
import type { Project, Note, Bill } from '@/types'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showBillForm, setShowBillForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'notes' | 'bills'>('notes')
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      loadProjectAndNotes()
    }
  }, [id])

  const loadProjectAndNotes = async () => {
    if (!id) return

    try {
      setLoading(true)
      const [projectData, notesData, billsData] = await Promise.all([
        projectService.getById(id),
        noteService.getByProjectId(id),
        billService.getByProjectId(id)
      ])

      if (!projectData) {
        toast({
          title: 'Error',
          description: 'Project not found',
          variant: 'destructive',
        })
        navigate('/projects')
        return
      }

      setProject(projectData)
      setNotes(notesData)
      setBills(billsData)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load project',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNoteContent.trim() || !id) return

    try {
      const newNote = await noteService.create({
        project_id: id,
        content: newNoteContent.trim()
      })
      
      setNotes(prev => [newNote, ...prev])
      setNewNoteContent('')
      setIsAddingNote(false)
      
      toast({
        title: 'Success',
        description: 'Note added successfully',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add note',
        variant: 'destructive',
      })
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id)
    setEditingContent(note.content)
  }

  const handleSaveEdit = async () => {
    if (!editingNoteId || !editingContent.trim()) return

    try {
      const updatedNote = await noteService.update(editingNoteId, editingContent.trim())
      
      setNotes(prev => prev.map(note => 
        note.id === editingNoteId ? updatedNote : note
      ))
      
      setEditingNoteId(null)
      setEditingContent('')
      
      toast({
        title: 'Success',
        description: 'Note updated successfully',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update note',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      await noteService.delete(noteId)
      setNotes(prev => prev.filter(note => note.id !== noteId))
      
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete note',
        variant: 'destructive',
      })
    }
  }

  const cancelEdit = () => {
    setEditingNoteId(null)
    setEditingContent('')
  }

  const handleBillSuccess = () => {
    setShowBillForm(false)
    loadProjectAndNotes() // Reload to get updated bills
    toast({
      title: 'Success',
      description: 'Bill created successfully',
      variant: 'success',
    })
  }

  const handleDeleteBill = async (billId: string) => {
    if (!confirm('Are you sure you want to delete this bill?')) return

    try {
      await billService.delete(billId)
      setBills(prev => prev.filter(bill => bill.id !== billId))

      toast({
        title: 'Success',
        description: 'Bill deleted successfully',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete bill',
        variant: 'destructive',
      })
    }
  }

  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    )
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {formatStatus(project.status)}
                </span>
                <span className="text-sm text-gray-500">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowBillForm(true)}>
              <Receipt className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
            <Button onClick={() => {
              setActiveTab('notes')
              setIsAddingNote(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Project Description */}
        {project.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline-block w-4 h-4 mr-2" />
              Notes ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('bills')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bills'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Receipt className="inline-block w-4 h-4 mr-2" />
              Bills ({bills.length})
            </button>
          </nav>
        </div>

        {/* Notes Section */}
        {activeTab === 'notes' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Notes</CardTitle>
                  <CardDescription>
                    Keep track of important information and updates for this project
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddingNote(true)} disabled={isAddingNote}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
            {/* Add New Note */}
            {isAddingNote && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <Textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write your note here..."
                  rows={3}
                  className="mb-3"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAddNote} disabled={!newNoteContent.trim()}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsAddingNote(false)
                    setNewNoteContent('')
                  }}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Notes List */}
            {notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No notes yet</p>
                <p className="text-sm">Add your first note to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4">
                    {editingNoteId === note.id ? (
                      <div>
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={3}
                          className="mb-3"
                        />
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveEdit} disabled={!editingContent.trim()}>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button variant="outline" onClick={cancelEdit}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {new Date(note.created_at).toLocaleString()}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditNote(note)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Bills Section */}
        {activeTab === 'bills' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Bills</CardTitle>
                  <CardDescription>
                    Manage invoices and billing for this project
                  </CardDescription>
                </div>
                <Button onClick={() => setShowBillForm(true)}>
                  <Receipt className="mr-2 h-4 w-4" />
                  Create Bill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bills List */}
              {bills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No bills yet</p>
                  <p className="text-sm">Create your first invoice to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bills.map((bill) => (
                    <div key={bill.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{bill.invoice_number}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBillStatusColor(bill.status)}`}>
                              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{bill.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatCurrency(Number(bill.amount))}
                            </span>
                            <span>Due: {new Date(bill.due_date).toLocaleDateString()}</span>
                            <span>Created: {new Date(bill.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBill(bill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bill Form Modal */}
        <BillForm
          open={showBillForm}
          onOpenChange={setShowBillForm}
          onSuccess={handleBillSuccess}
          preSelectedProjectId={id}
        />
      </div>
    </MainLayout>
  )
}
