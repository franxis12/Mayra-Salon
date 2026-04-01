import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const getInitialUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
      setLoading(false)
    }

    getInitialUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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
      setUser(result.data.user)
    }
    return result
  }

  const signUp = async (email, password) => {
    if (!supabase) return { error: new Error('Supabase is not configured') }
    const result = await supabase.auth.signUp({ email, password })
    if (!result.error) {
      setUser(result.data.user)
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
