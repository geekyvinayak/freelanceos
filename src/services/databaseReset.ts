import { supabase } from '@/lib/supabase'

export interface ResetConfig {
  interval: 'hourly' | 'daily' | 'weekly'
  enabled: boolean
  preserveAuth: boolean
  notifyUsers: boolean
  logActivity: boolean
}

export interface ResetResult {
  success: boolean
  timestamp: string
  duration: number
  recordsAffected: {
    projects: number
    notes: number
    bills: number
  }
  error?: string
}

export interface ResetLog {
  id: string
  timestamp: string
  success: boolean
  duration: number
  recordsAffected: any
  error?: string
  triggeredBy: 'scheduled' | 'manual' | 'api'
}

class DatabaseResetService {
  private readonly DEMO_USER_EMAIL = 'user@demo.com'

  /**
   * Execute database reset to demo state
   */
  async resetToDemo(_triggeredBy: 'scheduled' | 'manual' | 'api' = 'manual'): Promise<ResetResult> {
    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    try {
      // Execute the reset using the database function
      const { data: resetData, error: resetError } = await supabase
        .rpc('reset_demo_data')

      if (resetError) {
        throw new Error(`Database reset failed: ${resetError.message}`)
      }

      if (!resetData.success) {
        throw new Error(resetData.error || 'Database reset failed')
      }

      const duration = Date.now() - startTime
      const recordsAffected = {
        projects: resetData.records_affected?.projects_deleted || 0,
        notes: resetData.records_affected?.notes_deleted || 0,
        bills: resetData.records_affected?.bills_deleted || 0
      }

      const result: ResetResult = {
        success: true,
        timestamp,
        duration,
        recordsAffected
      }

      return result

    } catch (error: any) {
      const duration = Date.now() - startTime
      const result: ResetResult = {
        success: false,
        timestamp,
        duration,
        recordsAffected: { projects: 0, notes: 0, bills: 0 },
        error: error.message
      }

      return result
    }
  }

  /**
   * Check if demo user exists and is properly configured
   */
  async verifyDemoUser(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', this.DEMO_USER_EMAIL)
        .single()

      return !error && !!data
    } catch {
      return false
    }
  }

  /**
   * Get the last reset information
   */
  async getLastReset(): Promise<ResetLog | null> {
    try {
      const { data, error } = await supabase.rpc('get_last_reset')

      if (error || !data?.last_reset) {
        return null
      }

      return {
        id: data.last_reset.id,
        timestamp: data.last_reset.timestamp,
        success: data.last_reset.success,
        duration: data.last_reset.duration_ms,
        recordsAffected: data.last_reset.records_affected,
        error: data.last_reset.error_message,
        triggeredBy: data.last_reset.triggered_by
      }
    } catch {
      return null
    }
  }

  /**
   * Get reset statistics
   */
  async getResetStats(): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('get_reset_stats')

      if (error) {
        throw new Error(`Failed to get reset stats: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Failed to get reset stats:', error)
      return null
    }
  }

  /**
   * Get reset configuration from environment or database
   */
  getResetConfig(): ResetConfig {
    return {
      interval: (import.meta.env.VITE_RESET_INTERVAL as any) || 'daily',
      enabled: import.meta.env.VITE_RESET_ENABLED === 'true',
      preserveAuth: true,
      notifyUsers: import.meta.env.VITE_RESET_NOTIFY_USERS !== 'false',
      logActivity: true
    }
  }

  /**
   * Calculate next reset time based on configuration
   */
  getNextResetTime(config: ResetConfig): Date {
    const now = new Date()
    const nextReset = new Date(now)

    switch (config.interval) {
      case 'hourly':
        nextReset.setHours(now.getHours() + 1, 0, 0, 0)
        break
      case 'daily':
        nextReset.setDate(now.getDate() + 1)
        nextReset.setHours(0, 0, 0, 0) // Reset at midnight
        break
      case 'weekly':
        nextReset.setDate(now.getDate() + (7 - now.getDay())) // Next Sunday
        nextReset.setHours(0, 0, 0, 0)
        break
    }

    return nextReset
  }
}

export const databaseResetService = new DatabaseResetService()
