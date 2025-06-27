import { supabase } from '@/lib/supabase'
import type { Project, Note, Bill } from '@/types'

// Project services
export const projectService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Note services
export const noteService = {
  async getByProjectId(projectId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, content: string): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .update({ content })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Bill services
export const billService = {
  async getByProjectId(projectId: string): Promise<Bill[]> {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getAll(): Promise<Bill[]> {
    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        projects (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(bill: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'invoice_number'>): Promise<Bill> {
    // Generate invoice number using the database function
    const { data: invoiceData, error: invoiceError } = await supabase
      .rpc('generate_invoice_number')

    if (invoiceError) throw invoiceError

    const { data, error } = await supabase
      .from('bills')
      .insert([{ ...bill, invoice_number: invoiceData }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Bill>): Promise<Bill> {
    const { data, error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async markAsPaid(id: string): Promise<Bill> {
    return this.update(id, { status: 'paid' })
  },

  async markAsPending(id: string): Promise<Bill> {
    return this.update(id, { status: 'pending' })
  }
}
