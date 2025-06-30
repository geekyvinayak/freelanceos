import { useState, useEffect } from 'react'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DemoNotificationBannerProps {
  className?: string
}

export function DemoNotificationBanner({ className = '' }: DemoNotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('demo-banner-dismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
    }
  }, [])



  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('demo-banner-dismissed', 'true')
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
            </div>
            <div className="text-sm text-amber-700 space-y-1">
              <p>
                Welcome to the <strong>FreelanceOS Demo</strong>! This is a live demo environment where you can explore all features.
              </p>
              <p className="text-xs">
                Feel free to create, edit, and delete projects, notes, and bills to test the functionality.
              </p>
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


