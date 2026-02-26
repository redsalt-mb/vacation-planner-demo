import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  /** True when user just signed up and hasn't completed onboarding */
  needsOnboarding: boolean
}

export interface UserProfile {
  id: string
  displayName: string | null
  language: string
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null; confirmEmail: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  updateProfile: (updates: { displayName?: string; language?: string }) => Promise<{ error: string | null }>
  deleteAccount: () => Promise<{ error: string | null }>
  setNeedsOnboarding: (value: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    needsOnboarding: false,
  })

  // Listen for auth state changes
  useEffect(() => {
    // If Supabase is not configured, skip auth and go to demo/splash
    if (!supabaseConfigured) {
      setState(s => ({ ...s, isLoading: false }))
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState(s => ({ ...s, user: session.user, session, isLoading: false }))
        loadProfile(session.user.id)
        checkOnboarding(session.user.id)
      } else {
        setState(s => ({ ...s, isLoading: false }))
      }
    }).catch(() => {
      // Supabase connection failed — proceed without auth
      setState(s => ({ ...s, isLoading: false }))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(s => ({
        ...s,
        user: session?.user ?? null,
        session,
        isLoading: false,
      }))
      if (session?.user) {
        loadProfile(session.user.id)
        checkOnboarding(session.user.id)
      } else {
        setState(s => ({ ...s, profile: null, needsOnboarding: false }))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, language')
      .eq('id', userId)
      .single()

    if (data) {
      setState(s => ({
        ...s,
        profile: {
          id: data.id,
          displayName: data.display_name,
          language: data.language,
        },
      }))
    }
  }

  async function checkOnboarding(userId: string) {
    // User needs onboarding if they have no active plans
    const { data } = await supabase
      .from('plans')
      .select('id')
      .eq('owner_id', userId)
      .eq('is_active', true)
      .limit(1)

    if (!data || data.length === 0) {
      setState(s => ({ ...s, needsOnboarding: true }))
    }
  }

  async function signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })
    if (!error) {
      setState(s => ({ ...s, needsOnboarding: true }))
    }
    // If signup succeeded but no session, email confirmation is required
    const confirmEmail = !error && !data.session
    return { error: error?.message ?? null, confirmEmail }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setState(s => ({ ...s, user: null, session: null, profile: null, needsOnboarding: false }))
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error: error?.message ?? null }
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return { error: error?.message ?? null }
  }

  async function updateProfile(updates: { displayName?: string; language?: string }) {
    if (!state.user) return { error: 'Not authenticated' }

    const dbUpdates: Record<string, string> = {}
    if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName
    if (updates.language !== undefined) dbUpdates.language = updates.language

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', state.user.id)

    if (!error) {
      setState(s => ({
        ...s,
        profile: s.profile ? {
          ...s.profile,
          ...(updates.displayName !== undefined ? { displayName: updates.displayName } : {}),
          ...(updates.language !== undefined ? { language: updates.language } : {}),
        } : null,
      }))
    }

    return { error: error?.message ?? null }
  }

  async function deleteAccount() {
    // Delete all user data first (cascade should handle this, but be explicit)
    if (!state.user) return { error: 'Not authenticated' }

    // Delete plans (cascades to statuses, days, items, notes)
    await supabase.from('plans').delete().eq('owner_id', state.user.id)
    // Delete profile
    await supabase.from('profiles').delete().eq('id', state.user.id)

    // Note: actual auth.users deletion requires a server-side function
    // For now, sign out. In production, use a Supabase Edge Function with admin key.
    await signOut()
    return { error: null }
  }

  const setNeedsOnboarding = useCallback((value: boolean) => {
    setState(s => ({ ...s, needsOnboarding: value }))
  }, [])

  return (
    <AuthContext.Provider value={{
      ...state,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      deleteAccount,
      setNeedsOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
