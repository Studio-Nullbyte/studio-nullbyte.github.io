import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAuth = true, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuthContext()
  const location = useLocation()

  console.log('ProtectedRoute: Checking access -', {
    user: !!user,
    profile: !!profile,
    loading,
    requireAuth,
    requireAdmin,
    pathname: location.pathname
  })

  // Show loading spinner while checking auth state
  if (loading) {
    console.log('ProtectedRoute: Still loading auth state...')
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
      </div>
    )
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !user) {
    console.log('ProtectedRoute: Auth required but no user, redirecting to auth...')
    // Redirect to auth page with current location as redirect target
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  // If admin access is required
  if (requireAdmin) {
    // First check if user is logged in
    if (!user) {
      console.log('ProtectedRoute: Admin required but no user, redirecting to auth...')
      return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />
    }
    
    // Then check if user has admin role
    if (profile?.role !== 'admin') {
      console.log('ProtectedRoute: Admin required but user is not admin, redirecting to home...')
      return <Navigate to="/" replace />
    }
  }

  // If user is logged in but trying to access auth pages
  if (!requireAuth && user && location.pathname.startsWith('/auth')) {
    console.log('ProtectedRoute: User logged in but accessing auth page, redirecting to home...')
    return <Navigate to="/" replace />
  }

  console.log('ProtectedRoute: Access granted, rendering children')
  return <>{children}</>
}
