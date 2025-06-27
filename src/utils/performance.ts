/**
 * Performance Monitoring Utilities
 * 
 * Tools for monitoring and optimizing application performance
 */

// Performance metrics interface
interface PerformanceMetrics {
  name: string
  duration: number
  timestamp: number
  type: 'navigation' | 'resource' | 'measure' | 'custom'
  details?: Record<string, any>
}

// Performance observer for monitoring
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initObservers()
  }

  private initObservers() {
    // Monitor navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.recordMetric({
                name: 'page_load',
                duration: entry.duration,
                timestamp: entry.startTime,
                type: 'navigation',
                details: {
                  domContentLoaded: (entry as PerformanceNavigationTiming).domContentLoadedEventEnd,
                  loadComplete: (entry as PerformanceNavigationTiming).loadEventEnd,
                  firstPaint: this.getFirstPaint(),
                  firstContentfulPaint: this.getFirstContentfulPaint()
                }
              })
            }
          })
        })
        navObserver.observe({ entryTypes: ['navigation'] })
        this.observers.push(navObserver)
      } catch (e) {
        console.warn('Navigation timing observer not supported')
      }

      // Monitor resource loading
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 1000) { // Only track slow resources
              this.recordMetric({
                name: 'slow_resource',
                duration: entry.duration,
                timestamp: entry.startTime,
                type: 'resource',
                details: {
                  name: entry.name,
                  size: (entry as PerformanceResourceTiming).transferSize,
                  type: (entry as PerformanceResourceTiming).initiatorType
                }
              })
            }
          })
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
        this.observers.push(resourceObserver)
      } catch (e) {
        console.warn('Resource timing observer not supported')
      }

      // Monitor long tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordMetric({
              name: 'long_task',
              duration: entry.duration,
              timestamp: entry.startTime,
              type: 'measure',
              details: {
                attribution: (entry as any).attribution
              }
            })
          })
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
        this.observers.push(longTaskObserver)
      } catch (e) {
        console.warn('Long task observer not supported')
      }
    }
  }

  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    return firstPaint ? firstPaint.startTime : null
  }

  private getFirstContentfulPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint')
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcp ? fcp.startTime : null
  }

  recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log('Performance metric:', metric)
    }
    
    // Send to analytics in production
    if (import.meta.env.PROD) {
      this.sendToAnalytics(metric)
    }
  }

  private sendToAnalytics(_metric: PerformanceMetrics) {
    // This would integrate with your analytics service
    // Example: Google Analytics, Mixpanel, etc.
    try {
      // gtag('event', 'performance_metric', {
      //   metric_name: metric.name,
      //   metric_duration: metric.duration,
      //   metric_type: metric.type
      // })
    } catch (e) {
      console.warn('Failed to send performance metric to analytics:', e)
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  getMetricsByType(type: PerformanceMetrics['type']): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.type === type)
  }

  clearMetrics() {
    this.metrics = []
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.clearMetrics()
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for manual performance tracking
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const startTime = performance.now()
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - startTime
      performanceMonitor.recordMetric({
        name,
        duration,
        timestamp: startTime,
        type: 'custom'
      })
    })
  } else {
    const duration = performance.now() - startTime
    performanceMonitor.recordMetric({
      name,
      duration,
      timestamp: startTime,
      type: 'custom'
    })
    return result
  }
}

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  const startTime = performance.now()
  
  return {
    trackRender: () => {
      const duration = performance.now() - startTime
      performanceMonitor.recordMetric({
        name: `${componentName}_render`,
        duration,
        timestamp: startTime,
        type: 'custom',
        details: { component: componentName }
      })
    },
    
    trackAction: (actionName: string) => {
      const actionStartTime = performance.now()
      return () => {
        const duration = performance.now() - actionStartTime
        performanceMonitor.recordMetric({
          name: `${componentName}_${actionName}`,
          duration,
          timestamp: actionStartTime,
          type: 'custom',
          details: { component: componentName, action: actionName }
        })
      }
    }
  }
}

// Web Vitals monitoring
export function trackWebVitals() {
  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        performanceMonitor.recordMetric({
          name: 'largest_contentful_paint',
          duration: lastEntry.startTime,
          timestamp: lastEntry.startTime,
          type: 'measure',
          details: {
            element: (lastEntry as any).element?.tagName,
            url: (lastEntry as any).url
          }
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('LCP observer not supported')
    }

    // Track First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          performanceMonitor.recordMetric({
            name: 'first_input_delay',
            duration: (entry as any).processingStart - entry.startTime,
            timestamp: entry.startTime,
            type: 'measure',
            details: {
              eventType: (entry as any).name
            }
          })
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.warn('FID observer not supported')
    }

    // Track Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        })
        
        performanceMonitor.recordMetric({
          name: 'cumulative_layout_shift',
          duration: clsValue,
          timestamp: performance.now(),
          type: 'measure'
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('CLS observer not supported')
    }
  }
}

// Memory usage monitoring
export function trackMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    
    performanceMonitor.recordMetric({
      name: 'memory_usage',
      duration: memory.usedJSHeapSize,
      timestamp: performance.now(),
      type: 'custom',
      details: {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    })
  }
}

// Bundle size tracking
export function trackBundleSize() {
  if ('PerformanceObserver' in window) {
    const resourceObserver = new PerformanceObserver((list) => {
      let totalSize = 0
      let jsSize = 0
      let cssSize = 0
      
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming
        if (resource.transferSize) {
          totalSize += resource.transferSize
          
          if (resource.name.endsWith('.js')) {
            jsSize += resource.transferSize
          } else if (resource.name.endsWith('.css')) {
            cssSize += resource.transferSize
          }
        }
      })
      
      performanceMonitor.recordMetric({
        name: 'bundle_size',
        duration: totalSize,
        timestamp: performance.now(),
        type: 'custom',
        details: {
          total: totalSize,
          javascript: jsSize,
          css: cssSize
        }
      })
    })
    
    resourceObserver.observe({ entryTypes: ['resource'] })
  }
}

// Initialize all performance tracking
export function initPerformanceTracking() {
  trackWebVitals()
  trackMemoryUsage()
  trackBundleSize()
  
  // Track memory usage periodically
  setInterval(trackMemoryUsage, 30000) // Every 30 seconds
}

// Performance report generation
export function generatePerformanceReport() {
  const metrics = performanceMonitor.getMetrics()
  
  const report = {
    timestamp: new Date().toISOString(),
    navigation: metrics.filter(m => m.type === 'navigation'),
    resources: metrics.filter(m => m.type === 'resource'),
    measures: metrics.filter(m => m.type === 'measure'),
    custom: metrics.filter(m => m.type === 'custom'),
    summary: {
      totalMetrics: metrics.length,
      averagePageLoad: metrics
        .filter(m => m.name === 'page_load')
        .reduce((acc, m) => acc + m.duration, 0) / metrics.filter(m => m.name === 'page_load').length || 0,
      slowResources: metrics.filter(m => m.name === 'slow_resource').length,
      longTasks: metrics.filter(m => m.name === 'long_task').length
    }
  }
  
  return report
}
