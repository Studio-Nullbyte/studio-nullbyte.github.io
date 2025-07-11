import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext()
  const location = useLocation()

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-violet"></div>
      </div>
    )
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !user) {
    // Redirect to auth page with current location as redirect target
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  // If user is logged in but trying to access auth pages
  if (!requireAuth && user && location.pathname.startsWith('/auth')) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
