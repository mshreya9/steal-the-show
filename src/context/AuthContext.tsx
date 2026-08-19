import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { getUserProfile, logout as authLogout } from '../services/authService'
import type { AuthStatus, User } from '../types/user'

const LEGACY_STORAGE_KEY = 'sts_auth_user'

interface AuthContextValue {
  user: User | null
  status: AuthStatus
  isAuthenticated: boolean
  authPromptOpen: boolean
  closeAuthPrompt: () => void
  requireAuth: (onAuthenticated: () => void) => void
  refreshProfile: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [authPromptOpen, setAuthPromptOpen] = useState(false)

  const loadProfile = async (uid: string) => {
    const result = await getUserProfile(uid)
    if (result.ok && result.data) {
      setUser(result.data)
      setStatus('logged-in')
    } else {
      setUser(null)
      setStatus('logged-out')
    }
  }

  useEffect(() => {
    if (!auth) {
      setUser(null)
      setStatus('logged-out')
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        loadProfile(firebaseUser.uid)
      } else {
        setUser(null)
        setStatus('logged-out')
      }
    })
    return unsubscribe
  }, [])

  const requireAuth = (onAuthenticated: () => void) => {
    if (user) {
      onAuthenticated()
    } else {
      setAuthPromptOpen(true)
    }
  }

  const refreshProfile = async () => {
    if (auth?.currentUser) await loadProfile(auth.currentUser.uid)
  }

  const logout = async () => {
    await authLogout()
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    sessionStorage.clear()
    setUser(null)
    setStatus('logged-out')
  }

  const value: AuthContextValue = {
    user,
    status,
    isAuthenticated: !!user,
    authPromptOpen,
    closeAuthPrompt: () => setAuthPromptOpen(false),
    requireAuth,
    refreshProfile,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
