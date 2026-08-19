import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { getUserProfile, logout as authLogout } from '../services/authService'
import type { AuthStatus, User } from '../types/user'

const LEGACY_STORAGE_KEY = 'sts_auth_user'

// TEMPORARY dev-only bypass — lets you test cart/checkout/profile gating without
// a working Firebase OTP setup. `import.meta.env.DEV` is statically known at build
// time, so Vite/Rollup dead-code-eliminates everything below (including the fake
// user's placeholder data) out of production bundles entirely — not just hidden
// behind a runtime check. Remove this whole block once real phone OTP is confirmed
// working end-to-end.
const DEV_BYPASS_STORAGE_KEY = 'sts_dev_bypass'

function readDevBypass(): boolean {
  if (!import.meta.env.DEV) return false
  try {
    return localStorage.getItem(DEV_BYPASS_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function runDevLogin(setUser: (u: User) => void, setStatus: (s: AuthStatus) => void, bypassRef: { current: boolean }) {
  const DEV_TEST_USER: User = {
    uid: 'dev-test-uid',
    name: 'Test User (Dev)',
    mobile: '9999999999',
    email: 'devtest@example.com',
  }
  bypassRef.current = true
  try {
    localStorage.setItem(DEV_BYPASS_STORAGE_KEY, '1')
  } catch {
    // ignore
  }
  setUser(DEV_TEST_USER)
  setStatus('logged-in')
}

interface AuthContextValue {
  user: User | null
  status: AuthStatus
  isAuthenticated: boolean
  authPromptOpen: boolean
  closeAuthPrompt: () => void
  requireAuth: (onAuthenticated: () => void) => void
  refreshProfile: () => Promise<void>
  logout: () => Promise<void>
  devLogin: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [authPromptOpen, setAuthPromptOpen] = useState(false)
  const devBypassActiveRef = useRef(readDevBypass())

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
    if (devBypassActiveRef.current) {
      runDevLogin(setUser, setStatus, devBypassActiveRef)
      return
    }
    if (!auth) {
      setUser(null)
      setStatus('logged-out')
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (devBypassActiveRef.current) return
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
    devBypassActiveRef.current = false
    try {
      localStorage.removeItem(DEV_BYPASS_STORAGE_KEY)
    } catch {
      // ignore
    }
    await authLogout()
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    sessionStorage.clear()
    setUser(null)
    setStatus('logged-out')
  }

  const devLogin = () => {
    if (import.meta.env.DEV) runDevLogin(setUser, setStatus, devBypassActiveRef)
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
    devLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
