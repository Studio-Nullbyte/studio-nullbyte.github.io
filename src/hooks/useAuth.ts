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
        console.warn('🚨 useAuth: Emergency timeout reached - forcing loading to false')
        setLoading(false)
      }
    }, 10000)

    return () => clearTimeout(emergencyTimeout)
  }, [loading])

  // Fetch user profile from database with retry
  const fetchProfile = async (userId: string, retryCount = 0): Promise<any | null> => {
    try {
      console.log(`🔄 useAuth: Fetching profile for user ${userId} (attempt ${retryCount + 1})`)
      
      // Create a timeout promise that rejects after 5 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
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
          console.log('📝 useAuth: No profile found for user (normal for new users)')
          return null
        }
        throw error
      }
      
      console.log('✅ useAuth: Profile fetched successfully')
      return data
    } catch (error) {
      console.error(`❌ useAuth: Error fetching profile (attempt ${retryCount + 1}):`, error)
      
      // Retry once on failure (but not on timeout)
      if (retryCount < 1 && error instanceof Error && !error.message.includes('timeout')) {
        console.log('🔄 useAuth: Retrying profile fetch...')
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
        return fetchProfile(userId, retryCount + 1)
      }
      
      console.warn('⚠️ useAuth: Profile fetch failed - continuing without profile')
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
    console.log('🚀 useAuth: Initializing auth...')
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔍 useAuth: Getting initial session...')
        
        // Add timeout for session fetch
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session fetch timeout')), 8000)
        })
        
        const result = await Promise.race([sessionPromise, timeoutPromise])
        const { data: { session }, error } = result as any
        
        if (error) {
          console.warn('⚠️ useAuth: Session fetch error (continuing anyway):', error)
        }
        
        console.log(`📋 useAuth: Initial session:`, session ? 'Found' : 'None')
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('👤 useAuth: Fetching user profile...')
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
        
        console.log('✅ useAuth: Initial auth setup complete')
        console.log('🔄 useAuth: Setting loading to false')
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
        console.log('🔄 useAuth: Auth state changed:', session ? 'User signed in' : 'User signed out')
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('👤 useAuth: Fetching updated profile...')
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
        }
        
        console.log('🔄 useAuth: Setting loading to false (auth change)')
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
