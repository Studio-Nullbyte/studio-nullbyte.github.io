import { createContext, useContext, ReactNode } from 'react'
import { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js'
import { useAuth } from '../hooks/useAuth'
import { UserProfile } from '../lib/types/database'

interface ProfileUpdateData {
  full_name?: string
  avatar_url?: string
}

interface SignUpData {
  full_name?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  profile: UserProfile | null
  isAdmin: boolean
  signUp: (email: string, password: string, userData?: SignUpData) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
  updateProfile: (updates: ProfileUpdateData) => Promise<{ data: UserProfile | null; error: Error | null }>
  updatePassword: (password: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
