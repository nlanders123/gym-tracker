import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const diag = window.__diag || (() => {})
    diag('AuthProvider: calling getSession...')
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        diag('AuthProvider: getSession resolved, user=' + (session?.user?.email || 'none'))
        setUser(session?.user ?? null)
        setLoading(false)
        // Hide boot diagnostics once app is ready
        const el = document.getElementById('boot-diag')
        if (el) el.style.display = 'none'
      })
      .catch((err) => {
        diag('AuthProvider: getSession FAILED: ' + (err?.message || err))
        setLoading(false)
        const el = document.getElementById('boot-diag')
        if (el) el.style.display = 'none'
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
