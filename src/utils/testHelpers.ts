// Test utilities and helpers for the application

export const testIds = {
  // Auth
  loginForm: 'login-form',
  signupForm: 'signup-form',
  emailInput: 'email-input',
  passwordInput: 'password-input',
  
  // Navigation
  sidebar: 'sidebar',
  mobileMenuButton: 'mobile-menu-button',
  
  // Projects
  projectsList: 'projects-list',
  projectCard: 'project-card',
  createProjectButton: 'create-project-button',
  projectForm: 'project-form',
  
  // Bills
  billsList: 'bills-list',
  billCard: 'bill-card',
  createBillButton: 'create-bill-button',
  billForm: 'bill-form',
  
  // Email Assistant
  emailForm: 'email-form',
  generatedEmail: 'generated-email',
  generateButton: 'generate-button',
  
  // Common
  loadingSpinner: 'loading-spinner',
  errorMessage: 'error-message',
  successMessage: 'success-message',
} as const

export const mockData = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  
  project: {
    id: 'test-project-id',
    user_id: 'test-user-id',
    name: 'Test Project',
    description: 'A test project for development',
    status: 'active' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  
  note: {
    id: 'test-note-id',
    project_id: 'test-project-id',
    content: 'This is a test note',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  
  bill: {
    id: 'test-bill-id',
    project_id: 'test-project-id',
    invoice_number: 'INV-2024-0001',
    amount: 1000,
    description: 'Test invoice for development work',
    status: 'pending' as const,
    due_date: '2024-02-01',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
}

// Utility functions for testing
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString()
}

// Environment checks
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
export const isTest = process.env.NODE_ENV === 'test'

// API endpoints (for testing)
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout'
  },
  projects: '/api/projects',
  notes: '/api/notes',
  bills: '/api/bills'
}

// Validation helpers
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  required: (value: string) => {
    return value.trim().length > 0
  },
  
  minLength: (value: string, min: number) => {
    return value.length >= min
  },
  
  amount: (value: string) => {
    const num = parseFloat(value)
    return !isNaN(num) && num > 0
  }
}
