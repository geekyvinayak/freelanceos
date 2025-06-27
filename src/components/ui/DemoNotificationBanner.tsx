import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, X, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { databaseResetService } from '@/services/databaseReset'

interface DemoNotificationBannerProps {
  className?: string
}

export function DemoNotificationBanner({ className = '' }: DemoNotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [nextResetTime, setNextResetTime] = useState<Date | null>(null)
  const [timeUntilReset, setTimeUntilReset] = useState<string>('')
  const [lastReset, setLastReset] = useState<any>(null)

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('demo-banner-dismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
      return
    }

    // Get reset configuration and calculate next reset time
    const config = databaseResetService.getResetConfig()
    if (config.enabled) {
      const nextReset = databaseResetService.getNextResetTime(config)
      setNextResetTime(nextReset)
    }

    // Get last reset information
    databaseResetService.getLastReset().then(reset => {
      setLastReset(reset)
    })
  }, [])

  useEffect(() => {
    if (!nextResetTime) return

    const updateCountdown = () => {
      const now = new Date()
      const timeDiff = nextResetTime.getTime() - now.getTime()

      if (timeDiff <= 0) {
        setTimeUntilReset('Reset in progress...')
        return
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeUntilReset(`${days}d ${hours % 24}h`)
      } else if (hours > 0) {
        setTimeUntilReset(`${hours}h ${minutes}m`)
      } else {
        setTimeUntilReset(`${minutes}m`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [nextResetTime])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('demo-banner-dismissed', 'true')
  }

  const formatLastResetTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Recently'
    }
  }

  if (!isVisible) return null

  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-amber-600 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-sm font-semibold text-amber-800">
                🚀 Demo Environment
              </h3>
              {nextResetTime && (
                <div className="flex items-center space-x-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  <span>Next reset: {timeUntilReset}</span>
                </div>
              )}
            </div>
            <div className="text-sm text-amber-700 space-y-1">
              <p>
                Welcome to the <strong>FreelanceOS Demo</strong>! This is a live demo environment where you can explore all features.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Data resets automatically to maintain clean demo state</span>
                </span>
                {lastReset && (
                  <span className="text-amber-600">
                    Last reset: {formatLastResetTime(lastReset.timestamp)}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded border border-amber-200">
                <strong>Demo Account:</strong> user@demo.com
              </div>
              <div className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded border border-amber-200">
                <strong>Features:</strong> Full access to all tools
              </div>
              <div className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded border border-amber-200">
                <strong>Data:</strong> Sample projects, notes & invoices
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="flex-shrink-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100 -mt-1 -mr-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Reset notification component for when reset is happening
export function ResetInProgressNotification() {
  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-pulse">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
      <div>
        <p className="font-medium">Database Reset in Progress</p>
        <p className="text-sm text-blue-100">Refreshing demo data...</p>
      </div>
    </div>
  )
}

// Success notification for completed reset
export function ResetCompleteNotification({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000) // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between space-x-3">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-medium">Demo Data Reset Complete</p>
          <p className="text-sm text-green-100">Fresh sample data is now available</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="text-green-100 hover:text-white hover:bg-green-700 -mr-1"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
