import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        toast({
          title: 'Connection Restored',
          description: 'You are back online',
          variant: 'success',
        })
        setWasOffline(false)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
      toast({
        title: 'Connection Lost',
        description: 'You are currently offline. Some features may not work.',
        variant: 'destructive',
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [toast, wasOffline])

  return { isOnline, wasOffline }
}
