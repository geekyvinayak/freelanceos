
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PageLoadingState } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/Toaster'
import { initPerformanceTracking } from '@/utils/performance'
import { initImageOptimizations } from '@/utils/imageOptimization'

// Lazy load pages for better performance
const AuthPage = lazy(() => import('@/pages/AuthPage').then(module => ({ default: module.AuthPage })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })))
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then(module => ({ default: module.ProjectsPage })))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })))
const BillsPage = lazy(() => import('@/pages/BillsPage').then(module => ({ default: module.BillsPage })))
const EmailAssistantPage = lazy(() => import('@/pages/EmailAssistantPage').then(module => ({ default: module.EmailAssistantPage })))

function App() {
  // Initialize performance optimizations
  useEffect(() => {
    initPerformanceTracking()
    initImageOptimizations()
  }, [])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoadingState />}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bills"
                element={
                  <ProtectedRoute>
                    <BillsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/email"
                element={
                  <ProtectedRoute>
                    <EmailAssistantPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
