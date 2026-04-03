import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    if (!supabase || !userId) {
      setProfile(null)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      // We don't block the UI if profile fails; just clear it.
      setProfile(null)
      return
    }

    setProfile(data ?? null)
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const getInitialUser = async () => {
      const { data } = await supabase.auth.getUser()
      const currentUser = data?.user ?? null
      setUser(currentUser)
      if (currentUser?.id) {
        await fetchProfile(currentUser.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    }

    getInitialUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null
      setUser(nextUser)
      if (nextUser?.id) {
        fetchProfile(nextUser.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    if (!supabase) return { error: new Error('Supabase is not configured') }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) {
      const signedUser = result.data.user
      setUser(signedUser)
      if (signedUser?.id) {
        fetchProfile(signedUser.id)
      }
    }
    return result
  }

  const signUp = async (email, password, metadata = {}) => {
    if (!supabase) return { error: new Error('Supabase is not configured') }
    const result = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    if (!result.error) {
      const newUser = result.data.user
      setUser(newUser)
      if (newUser?.id) {
        fetchProfile(newUser.id)
      }
    }
    return result
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  const isAdmin = !!user && !!adminEmail && user.email === adminEmail

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
