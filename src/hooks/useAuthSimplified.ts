// SIMPLIFIED AUTHENTICATION SYSTEM
// Replace your current useAuth hook with this simplified version

import { useState, useEffect, useCallback } from 'react'
import { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { UserProfile } from '../lib/types/database'

interface SignUpData {
  full_name?: string
  role?: string
}

interface ProfileUpdateData {
  full_name?: string
  avatar_url?: string
}

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  profile: UserProfile | null
  isAdmin: boolean
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, userData?: SignUpData) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
  updateProfile: (updates: ProfileUpdateData) => Promise<{ data: UserProfile | null; error: Error | null }>
  updatePassword: (password: string) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Computed admin state - no caching needed
  const isAdmin = profile?.role === 'admin'

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      return data
    } catch (error) {
      console.warn('Profile fetch failed:', error)
      return null
    }
  }, [])

  // Single auth state handler
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setSession(null)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // Simplified auth actions
  const signIn = async (email: string, password: string): Promise<{ data: AuthResponse['data']; error: AuthError | null }> => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    const result = await supabase.auth.signOut()
    if (!result.error) {
      setUser(null)
      setSession(null)
      setProfile(null)
    }
    return result
  }

  const signUp = async (email: string, password: string, userData?: SignUpData): Promise<{ data: AuthResponse['data']; error: AuthError | null }> => {
    return await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: userData } 
    })
  }

  const resetPassword = async (email: string): Promise<{ data: AuthResponse['data']; error: AuthError | null }> => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  }

  const updateProfile = async (updates: ProfileUpdateData): Promise<{ data: UserProfile | null; error: Error | null }> => {
    if (!user) return { data: null, error: new Error('No user logged in') }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (!error && data) {
        setProfile(data as UserProfile)
      }

      return { data: data as UserProfile | null, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  const updatePassword = async (password: string): Promise<{ data: AuthResponse['data']; error: AuthError | null }> => {
    return await supabase.auth.updateUser({ password })
  }

  return {
    user,
    session,
    loading,
    profile,
    isAdmin,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updateProfile,
    updatePassword,
  }
}
