import { useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import type { ConfirmationResult } from 'firebase/auth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import OTPInput from '../../components/OTPInput/OTPInput'
import { useAuth } from '../../context/AuthContext'
import { useCountdown } from '../../hooks/useCountdown'
import { resetRecaptcha, saveUserProfile, sendMobileOtp, verifyMobileOtp } from '../../services/authService'
import { auth } from '../../lib/firebase'

const MOBILE_REGEX = /^[6-9]\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RECAPTCHA_ID = 'recaptcha-container-register'

interface PasswordChecks {
  length: boolean
  number: boolean
  special: boolean
}

function checkPassword(pw: string): PasswordChecks {
  return {
    length: pw.length >= 8,
    number: /\d/.test(pw),
    special: /[!@#$%^&*(),.?":{}|<>_\-[\];'`~+=/\\]/.test(pw),
  }
}

export default function Register() {
  const navigate = useNavigate()
  const { refreshProfile } = useAuth()

  const [name, setName] = useState('')
  const [nameTouched, setNameTouched] = useState(false)

  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  const [mobile, setMobile] = useState('')
  const [mobileVerified, setMobileVerified] = useState(false)
  const [mobileTouched, setMobileTouched] = useState(false)
  const [mobileSending, setMobileSending] = useState(false)
  const [mobileError, setMobileError] = useState('')
  const [recaptchaKey, setRecaptchaKey] = useState(0)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmTouched, setConfirmTouched] = useState(false)

  const [agreed, setAgreed] = useState(false)
  const [agreedError, setAgreedError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const mobileCountdown = useCountdown(30)
  const confirmationRef = useRef<ConfirmationResult | null>(null)

  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const passwordChecks = checkPassword(password)
  const passwordValid = passwordChecks.length && passwordChecks.number && passwordChecks.special
  const confirmValid = confirmPassword.length > 0 && confirmPassword === password

  const emailValid = EMAIL_REGEX.test(email)
  const mobileValid = MOBILE_REGEX.test(mobile)
  const nameValid = name.trim().length > 1

  const formValid = nameValid && emailValid && mobileValid && mobileVerified && passwordValid && confirmValid && agreed

  const openMobileVerify = async () => {
    if (!mobileValid) {
      setMobileTouched(true)
      return
    }
    setMobileError('')
    setMobileSending(true)
    // Force a brand-new reCAPTCHA container node before every attempt — reusing
    // the same DOM node across attempts is what triggers Google's "reCAPTCHA has
    // already been rendered in this element" error.
    flushSync(() => setRecaptchaKey((k) => k + 1))
    const result = await sendMobileOtp(`+91${mobile}`, RECAPTCHA_ID)
    setMobileSending(false)
    if (!result.ok) {
      setMobileError(result.error)
      return
    }
    confirmationRef.current = result.data
    setOtp('')
    setOtpError('')
    setModalOpen(true)
    mobileCountdown.restart()
  }

  const handleVerifyMobile = async () => {
    if (!confirmationRef.current) return
    setVerifying(true)
    const result = await verifyMobileOtp(confirmationRef.current, otp)
    setVerifying(false)
    if (!result.ok) {
      setOtpError(result.error)
      return
    }
    setMobileVerified(true)
    setModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameTouched(true)
    setEmailTouched(true)
    setMobileTouched(true)
    setConfirmTouched(true)
    if (!agreed) setAgreedError('Please accept the Terms & Privacy Policy to continue.')
    if (!formValid) {
      setSubmitError('Please complete all required fields correctly before continuing.')
      return
    }
    const uid = auth?.currentUser?.uid
    if (!uid) {
      setSubmitError('Please verify your mobile number to create your account.')
      return
    }
    setSubmitError('')
    setSubmitting(true)
    const result = await saveUserProfile(uid, { name: name.trim(), email, mobile })
    setSubmitting(false)
    if (!result.ok) {
      setSubmitError(result.error)
      return
    }
    await refreshProfile()
    navigate('/')
  }

  const requirementRows = useMemo(
    () => [
      { key: 'length', label: 'At least 8 characters', met: passwordChecks.length },
      { key: 'number', label: 'At least one number', met: passwordChecks.number },
      { key: 'special', label: 'At least one special character', met: passwordChecks.special },
    ],
    [passwordChecks],
  )

  return (
    <div className="container-shell flex justify-center py-10 sm:py-14">
      <div className="w-full max-w-lg">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Create your account</h1>
        <p className="mt-1 text-sm text-grey-DEFAULT">Your next scene starts here.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            error={nameTouched && !nameValid ? 'Please enter your full name.' : undefined}
          />

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            error={emailTouched && !emailValid ? 'Enter a valid email address.' : undefined}
          />

          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Input
                  label="Mobile"
                  leftAdornment="+91"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  disabled={mobileVerified}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
                    setMobileVerified(false)
                  }}
                  onBlur={() => setMobileTouched(true)}
                  error={mobileTouched && !mobileValid ? 'Enter a valid Indian mobile number.' : mobileError || undefined}
                />
              </div>
              {mobileVerified ? (
                <span className="flex h-11 shrink-0 items-center gap-1 rounded-xl bg-success-50 px-3 text-sm font-bold text-success sm:mb-1">
                  <Check size={15} /> Verified
                </span>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={openMobileVerify}
                  disabled={mobileSending}
                  className="shrink-0 sm:mb-0 sm:w-auto"
                >
                  {mobileSending ? 'Sending…' : 'Verify Mobile'}
                </Button>
              )}
            </div>
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ul className="mt-2 flex flex-col gap-1">
              {requirementRows.map((r) => (
                <li key={r.key} className={`flex items-center gap-1.5 text-xs ${r.met ? 'text-success' : 'text-grey'}`}>
                  {r.met ? <Check size={13} /> : <X size={13} />} {r.label}
                </li>
              ))}
            </ul>
          </div>

          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setConfirmTouched(true)}
            error={confirmTouched && !confirmValid ? 'Passwords do not match.' : undefined}
          />

          <label className="flex items-start gap-2.5 rounded-xl border border-grey-200 bg-white p-3.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked)
                if (e.target.checked) setAgreedError('')
              }}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-grey-300 text-plum focus:ring-plum"
            />
            <span className="text-xs leading-relaxed text-grey-DEFAULT">
              I agree to the{' '}
              <Link to="/legal/terms" className="font-semibold text-plum hover:underline">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link to="/legal/privacy" className="font-semibold text-plum hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {agreedError && (
            <p className="-mt-3 text-xs font-medium text-coral-700" role="alert">
              {agreedError}
            </p>
          )}

          {submitError && (
            <p className="rounded-lg bg-coral-50 px-3 py-2 text-sm font-medium text-coral-700" role="alert">
              {submitError}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={!formValid || submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-grey-DEFAULT">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-plum hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          resetRecaptcha()
        }}
        title="Verify your mobile"
      >
        <p className="text-sm text-grey-DEFAULT">Enter the 6-digit code sent to +91 {mobile}.</p>
        <div className="mt-4">
          <OTPInput onComplete={setOtp} error={otpError} />
        </div>
        <Button fullWidth className="mt-5" disabled={otp.length !== 6 || verifying} onClick={handleVerifyMobile}>
          {verifying ? 'Verifying…' : 'Verify'}
        </Button>
        <div className="mt-3 text-center text-sm text-grey-DEFAULT">
          {mobileCountdown.isActive ? (
            <span>
              Resend code in <span className="font-semibold text-ink">{mobileCountdown.seconds}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                mobileCountdown.restart()
                openMobileVerify()
              }}
              className="font-semibold text-plum hover:underline"
            >
              Resend code
            </button>
          )}
        </div>
      </Modal>

      <div key={recaptchaKey} id={RECAPTCHA_ID} />
    </div>
  )
}
