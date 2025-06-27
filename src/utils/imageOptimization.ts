/**
 * Image Optimization Utilities
 * 
 * Utilities for optimizing images and assets in the FreelanceOS application
 */

// Lazy loading for images
export function lazyLoadImage(src: string, _placeholder?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = reject
    img.src = src
  })
}

// Image compression utility (for user uploads)
export function compressImage(
  file: File, 
  maxWidth: number = 1920, 
  maxHeight: number = 1080, 
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Preload critical images
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => lazyLoadImage(url))
  ).then(() => [])
}

// Generate responsive image srcSet
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ')
}

// Image format detection and optimization
export function getOptimalImageFormat(): 'webp' | 'avif' | 'jpeg' {
  // Check for AVIF support
  const avifSupported = new Promise((resolve) => {
    const avif = new Image()
    avif.onload = avif.onerror = () => resolve(avif.height === 2)
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
  })
  
  // Check for WebP support
  const webpSupported = new Promise((resolve) => {
    const webp = new Image()
    webp.onload = webp.onerror = () => resolve(webp.height === 2)
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
  
  return Promise.race([avifSupported, webpSupported]).then((supported) => {
    if (supported === true) return 'avif'
    return webpSupported.then(supported => supported ? 'webp' : 'jpeg')
  }) as any
}

// Asset preloading for critical resources
export function preloadCriticalAssets() {
  // Preload critical fonts
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ]
  
  fontLinks.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    document.head.appendChild(link)
  })
  
  // Preload critical icons (if using icon fonts)
  const iconFont = document.createElement('link')
  iconFont.rel = 'preload'
  iconFont.as = 'font'
  iconFont.type = 'font/woff2'
  iconFont.crossOrigin = 'anonymous'
  // iconFont.href = '/path/to/icons.woff2'
  // document.head.appendChild(iconFont)
}

// Intersection Observer for lazy loading
export function createLazyLoadObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}

// Performance monitoring for images
export function trackImagePerformance(src: string, startTime: number) {
  const loadTime = performance.now() - startTime
  
  // Log slow loading images in development
  if (import.meta.env.DEV && loadTime > 1000) {
    console.warn(`Slow image load detected: ${src} took ${loadTime.toFixed(2)}ms`)
  }
  
  // Send to analytics in production
  if (import.meta.env.PROD && loadTime > 2000) {
    // Analytics tracking would go here
    // analytics.track('slow_image_load', { src, loadTime })
  }
}

// Image error handling and fallbacks
export function handleImageError(
  img: HTMLImageElement, 
  fallbackSrc?: string,
  placeholder?: string
) {
  if (fallbackSrc && img.src !== fallbackSrc) {
    img.src = fallbackSrc
  } else if (placeholder) {
    img.src = placeholder
  } else {
    // Use a default placeholder
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='
  }
}

// Initialize image optimizations
export function initImageOptimizations() {
  // Preload critical assets
  preloadCriticalAssets()
  
  // Set up lazy loading for images
  const imageObserver = createLazyLoadObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src
        
        if (src) {
          const startTime = performance.now()
          img.src = src
          img.onload = () => trackImagePerformance(src, startTime)
          img.onerror = () => handleImageError(img)
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      }
    })
  })
  
  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img)
  })
  
  return imageObserver
}
