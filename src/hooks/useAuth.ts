import { useState, useEffect } from 'react'
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
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>
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
  const fetchProfile = async (userId: string, retryCount = 0): Promise<any | null> => {
    try {
      // Increase timeout for profile fetch to reduce random failures
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000) // Increased from 5s to 10s
      })
      
      // Race the profile fetch against the timeout
      const result = await Promise.race([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single(),
        timeoutPromise
      ])
      
      const { data, error } = result as any
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }
      
      return data
    } catch (error) {
      // Retry up to 2 times on failure (but not on timeout for very slow connections)
      if (retryCount < 2 && error instanceof Error && !error.message.includes('timeout')) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
        return fetchProfile(userId, retryCount + 1)
      }
      
      // For timeouts, try one more time with a longer delay
      if (retryCount === 0 && error instanceof Error && error.message.includes('timeout')) {
        await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds
        return fetchProfile(userId, retryCount + 1)
      }
      
      return null
    }
  }

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        // Add timeout for session fetch
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session fetch timeout')), 8000)
        })
        
        const result = await Promise.race([sessionPromise, timeoutPromise])
        const { data: { session }, error } = result as any
        
        if (error) {
          // Session fetch error (continuing anyway)
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
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      try {
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
        console.error('❌ useAuth: Error during auth state change:', error)
        // Ensure loading is set to false even if there's an error
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Auth actions
  const signUp = async (email: string, password: string, userData?: any) => {
    return await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: userData } 
    })
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password })
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
