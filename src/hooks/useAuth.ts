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

  // Timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('useAuth: Loading timeout reached, forcing loading to false')
        setLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeout)
  }, [loading])

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      console.log('useAuth: Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('useAuth: Error fetching profile:', error)
        if (error.code === 'PGRST116') {
          console.log('useAuth: No profile found for user, this might be normal for new users')
        }
        return null
      }
      
      console.log('useAuth: Profile fetch result:', data)
      console.log('useAuth: User role:', data?.role)
      console.log('useAuth: Is admin?', data?.role === 'admin')
      return data
    } catch (error) {
      console.error('useAuth: Profile fetch exception:', error)
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
        console.log('useAuth: Initializing auth...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('useAuth: Error getting initial session:', error)
          // Still continue with initialization even if there's an error
        }
        
        console.log('useAuth: Initial session:', session)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('useAuth: Initial user found, fetching profile...')
          const profileData = await fetchProfile(session.user.id)
          console.log('useAuth: Initial profile data:', profileData)
          setProfile(profileData)
        }
        
        console.log('useAuth: Initial auth setup complete')
        setLoading(false)
      } catch (error) {
        console.error('useAuth: Error during auth initialization:', error)
        // Ensure loading is set to false even if there's an error
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log('useAuth: Auth state change event:', event, 'Session:', session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('useAuth: User logged in, fetching profile...')
          const profileData = await fetchProfile(session.user.id)
          console.log('useAuth: Profile data:', profileData)
          setProfile(profileData)
        } else {
          console.log('useAuth: No user, clearing profile')
          setProfile(null)
        }
        
        console.log('useAuth: Setting loading to false')
        setLoading(false)
      } catch (error) {
        console.error('useAuth: Error in auth state change handler:', error)
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
      console.log('useAuth: Starting sign in...')
      const result = await supabase.auth.signInWithPassword({ email, password })
      console.log('useAuth: Sign in completed, result:', result)
      
      if (result.error) {
        console.error('useAuth: Sign in error:', result.error)
      } else {
        console.log('useAuth: Sign in successful, user:', result.data.user)
      }
      
      return result
    } catch (error) {
      console.error('useAuth: Sign in exception:', error)
      return { data: null, error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      console.log('Starting sign out process...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Supabase signOut error:', error)
        return { error }
      }
      
      console.log('Supabase signOut successful, clearing local state...')
      // Clear local state immediately
      setUser(null)
      setSession(null)
      setProfile(null)
      
      console.log('Sign out completed successfully')
      return { error: null }
    } catch (error) {
      console.error('Error during sign out:', error)
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
