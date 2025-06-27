import { useCallback } from 'react'
import { useToast } from '@/hooks/useToast'

interface ErrorHandlerOptions {
  showToast?: boolean
  toastTitle?: string
  logError?: boolean
}

export function useErrorHandler() {
  const { toast } = useToast()

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      toastTitle = 'Error',
      logError = true
    } = options

    // Log error to console in development
    if (logError && process.env.NODE_ENV === 'development') {
      console.error('Error handled:', error)
    }

    // Extract error message
    let errorMessage = 'An unexpected error occurred'
    
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as any).message)
    }

    // Show toast notification
    if (showToast) {
      toast({
        title: toastTitle,
        description: errorMessage,
        variant: 'destructive',
      })
    }

    // In production, you might want to send errors to a logging service
    if (process.env.NODE_ENV === 'production' && logError) {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error)
    }

    return errorMessage
  }, [toast])

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn()
    } catch (error) {
      handleError(error, options)
      return null
    }
  }, [handleError])

  return {
    handleError,
    handleAsyncError
  }
}
