import { initializeApp, getApps } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let auth: Auth | null = null
let db: Firestore | null = null
let firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

if (firebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)

    // TEMPORARY diagnostic-only logging (dev builds only, strips out of production).
    // No secrets logged — see conversation for what triggered this.
    if (import.meta.env.DEV) {
      console.info('[firebase debug] project ID:', app.options.projectId)
      console.info('[firebase debug] auth domain:', app.options.authDomain)
      console.info('[firebase debug] app name:', app.name)
      console.info('[firebase debug] existing Firebase apps count:', getApps().length)
    }
  } catch (err) {
    // An invalid/placeholder config must never crash the whole app — fall back to
    // a "not configured" state so the UI can show a friendly message instead.
    console.error('Firebase failed to initialize. Check your .env values.', err)
    firebaseConfigured = false
    auth = null
    db = null
  }
} else {
  console.warn('Firebase is not configured — copy .env.example to .env and fill in your project config.')
}

export { auth, db, firebaseConfigured }
