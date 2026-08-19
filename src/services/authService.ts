import { RecaptchaVerifier, signInWithPhoneNumber, signOut, type ConfirmationResult } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigured } from '../lib/firebase'
import type { User } from '../types/user'

export type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string }

const NOT_CONFIGURED_ERROR =
  'Sign-in is not set up yet. Copy .env.example to .env, add your Firebase project config, and restart the app.'

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? ''

  // TEMPORARY diagnostic-only logging (dev builds only). Logs the full Firebase
  // error object so the exact code/message/customData is visible in devtools —
  // no API keys, tokens, OTPs, or credentials are included.
  if (import.meta.env.DEV) {
    console.error('[auth debug] raw Firebase error:', err)
  }

  switch (code) {
    case 'auth/invalid-phone-number':
      return 'Enter a valid mobile number.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a bit and try again.'
    case 'auth/invalid-verification-code':
      return 'Incorrect code. Please check and try again.'
    case 'auth/code-expired':
      return 'This code has expired. Request a new one.'
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled yet. In the Firebase console, go to Authentication → Sign-in method and enable it.'
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded for now. Please try again later.'
    default:
      return (err as Error)?.message || 'Something went wrong. Please try again.'
  }
}

let activeVerifier: RecaptchaVerifier | null = null

// A fresh RecaptchaVerifier is created for every send attempt against a container
// DOM node that the caller has just freshly (re)mounted (see the `key`-based
// remount in Login.tsx/Register.tsx). Reusing one widget/container across attempts
// is what causes Google's "reCAPTCHA has already been rendered in this element"
// error, since grecaptcha's internal registry is tied to the DOM node itself.
function createRecaptcha(authInstance: NonNullable<typeof auth>, containerId: string): RecaptchaVerifier {
  activeVerifier?.clear()
  activeVerifier = new RecaptchaVerifier(authInstance, containerId, { size: 'invisible' })
  return activeVerifier
}

export function resetRecaptcha(): void {
  activeVerifier?.clear()
  activeVerifier = null
}

export async function sendMobileOtp(
  phoneE164: string,
  containerId: string,
): Promise<ServiceResult<ConfirmationResult>> {
  if (!auth) return { ok: false, error: NOT_CONFIGURED_ERROR }
  try {
    const verifier = createRecaptcha(auth, containerId)
    const confirmationResult = await signInWithPhoneNumber(auth, phoneE164, verifier)
    return { ok: true, data: confirmationResult }
  } catch (err) {
    return { ok: false, error: friendlyError(err) }
  } finally {
    resetRecaptcha()
  }
}

export async function verifyMobileOtp(
  confirmationResult: ConfirmationResult,
  code: string,
): Promise<ServiceResult<{ uid: string }>> {
  try {
    const credential = await confirmationResult.confirm(code)
    return { ok: true, data: { uid: credential.user.uid } }
  } catch (err) {
    return { ok: false, error: friendlyError(err) }
  }
}

interface ProfileInput {
  name: string
  email: string
  mobile: string
  address?: string
  city?: string
  state?: string
  pincode?: string
}

export async function saveUserProfile(uid: string, profile: ProfileInput): Promise<ServiceResult<null>> {
  if (!db) return { ok: false, error: NOT_CONFIGURED_ERROR }
  try {
    await setDoc(doc(db, 'users', uid), { ...profile, updatedAt: serverTimestamp() }, { merge: true })
    return { ok: true, data: null }
  } catch (err) {
    return { ok: false, error: friendlyError(err) }
  }
}

export async function getUserProfile(uid: string): Promise<ServiceResult<User | null>> {
  if (!db) return { ok: false, error: NOT_CONFIGURED_ERROR }
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return { ok: true, data: null }
    const data = snap.data()
    return {
      ok: true,
      data: {
        uid,
        name: data.name ?? '',
        mobile: data.mobile ?? '',
        email: data.email ?? undefined,
        address: data.address ?? undefined,
        city: data.city ?? undefined,
        state: data.state ?? undefined,
        pincode: data.pincode ?? undefined,
      },
    }
  } catch (err) {
    return { ok: false, error: friendlyError(err) }
  }
}

export async function logout(): Promise<void> {
  if (!auth) return
  await signOut(auth)
}

export { firebaseConfigured }
