export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  status: 'active' | 'completed' | 'on_hold'
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  project_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface Bill {
  id: string
  project_id: string
  invoice_number: string
  amount: number
  description: string
  status: 'paid' | 'pending'
  due_date: string
  created_at: string
  updated_at: string
}

export interface EmailRequest {
  recipientName: string
  context: string
  tone: 'professional' | 'friendly' | 'urgent'
}

export interface EmailResponse {
  content: string
  subject: string
}
