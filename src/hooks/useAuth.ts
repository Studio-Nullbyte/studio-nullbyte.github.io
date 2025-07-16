import { useState, useEffect, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  profile: any | null
}

interface AuthActions {
  signUp: (email: string, password: string, userData?: any) => Promise<{ data: any; error: AuthError | null }>
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ data: any; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ data: any; error: AuthError | null }>
  updateProfile: (updates: any) => Promise<{ data: any; error: any }>
  updatePassword: (password: string) => Promise<{ data: any; error: AuthError | null }>
  refreshProfile: () => Promise<void>
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)

  // Emergency timeout to prevent infinite loading (10 seconds)
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
      }
    }, 10000)

    return () => clearTimeout(emergencyTimeout)
  }, [loading])

  // Fetch user profile from database with retry and better error handling
  const fetchProfile = useCallback(async (userId: string): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, return null
          return null
        }
        throw error
      }
      
      return data
    } catch (error) {
      console.warn('⚠️ useAuth: Profile fetch failed:', error)
      
      // Return null instead of retrying to avoid infinite loops
      return null
    }
  }, [supabase])

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  // Listen for auth changes
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        // Get session without timeout to avoid timeout errors
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('⚠️ useAuth: Session fetch error, continuing without session:', error)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('❌ useAuth: Error during auth initialization:', error)
        // Ensure loading is set to false even if there's an error
        setLoading(false)
        // Set default values in case of error
        setSession(null)
        setUser(null)
        setProfile(null)
      }
    }

    initializeAuth()

    // Listen for auth state changes with improved error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log('🔄 Auth state changed:', event, !!session)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
          // Clear any cached admin status when user logs out
          localStorage.removeItem('studio_nullbyte_admin_status')
          localStorage.removeItem('studio_nullbyte_admin_expiry')
        }
        
        setLoading(false)
      } catch (error) {
        console.error('❌ useAuth: Error during auth state change:', error)
        // Ensure loading is set to false even if there's an error
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // Handle session cleanup based on remember me preference
  useEffect(() => {
    const handleBeforeUnload = () => {
      const rememberMe = localStorage.getItem('rememberMe') === 'true'
      const tempSession = sessionStorage.getItem('tempSession') === 'true'
      
      if (!rememberMe && tempSession) {
        // Clear the session if remember me was not checked
        supabase.auth.signOut()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Auth actions
  const signUp = async (email: string, password: string, userData?: any) => {
    return await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: userData } 
    })
  }

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password })
      
      // After successful sign in, store the remember me preference
      if (result.data?.session) {
        localStorage.setItem('rememberMe', rememberMe.toString())
        
        // If remember me is false, we'll handle this in the sign out
        if (!rememberMe) {
          // Set a flag to clear session on browser close
          sessionStorage.setItem('tempSession', 'true')
        }
      }
      
      return result
    } catch (error) {
      return { data: null, error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error }
      }
      
      // Clear remember me preferences
      localStorage.removeItem('rememberMe')
      sessionStorage.removeItem('tempSession')
      
      // Clear local state immediately
      setUser(null)
      setSession(null)
      setProfile(null)
      
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  }

  const updateProfile = async (updates: any) => {
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

      if (!error) {
        setProfile(data)
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password })
  }

  return {
    user,
    session,
    loading,
    profile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    refreshProfile,
  }
}
