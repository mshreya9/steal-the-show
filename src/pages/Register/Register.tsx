import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import OTPInput from '../../components/OTPInput/OTPInput'
import { useAuth } from '../../context/AuthContext'
import { useCountdown } from '../../hooks/useCountdown'

const MOBILE_REGEX = /^[6-9]\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  const { login, demoOtp } = useAuth()

  const [name, setName] = useState('')
  const [nameTouched, setNameTouched] = useState(false)

  const [email, setEmail] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  const [mobile, setMobile] = useState('')
  const [mobileVerified, setMobileVerified] = useState(false)
  const [mobileTouched, setMobileTouched] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmTouched, setConfirmTouched] = useState(false)

  const [modalTarget, setModalTarget] = useState<'email' | 'mobile' | null>(null)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const countdown = useCountdown(30)
  const [submitError, setSubmitError] = useState('')

  const passwordChecks = checkPassword(password)
  const passwordValid = passwordChecks.length && passwordChecks.number && passwordChecks.special
  const confirmValid = confirmPassword.length > 0 && confirmPassword === password

  const emailValid = EMAIL_REGEX.test(email)
  const mobileValid = MOBILE_REGEX.test(mobile)
  const nameValid = name.trim().length > 1

  const formValid = nameValid && emailValid && emailVerified && mobileValid && mobileVerified && passwordValid && confirmValid

  const openVerify = (target: 'email' | 'mobile') => {
    if (target === 'email' && !emailValid) {
      setEmailTouched(true)
      return
    }
    if (target === 'mobile' && !mobileValid) {
      setMobileTouched(true)
      return
    }
    setOtp('')
    setOtpError('')
    setModalTarget(target)
    countdown.restart()
  }

  const handleVerify = () => {
    if (otp !== demoOtp) {
      setOtpError(`Incorrect code. Use the demo OTP ${demoOtp} for this prototype.`)
      return
    }
    if (modalTarget === 'email') setEmailVerified(true)
    if (modalTarget === 'mobile') setMobileVerified(true)
    setModalTarget(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNameTouched(true)
    setEmailTouched(true)
    setMobileTouched(true)
    setConfirmTouched(true)
    if (!formValid) {
      setSubmitError('Please complete all required fields correctly before continuing.')
      return
    }
    setSubmitError('')
    login({ name: name.trim(), email, mobile, authMethod: 'email' })
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

          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  disabled={emailVerified}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailVerified(false)
                  }}
                  onBlur={() => setEmailTouched(true)}
                  error={emailTouched && !emailValid ? 'Enter a valid email address.' : undefined}
                />
              </div>
              {emailVerified ? (
                <span className="mb-1 flex h-11 items-center gap-1 rounded-xl bg-success-50 px-3 text-sm font-bold text-success">
                  <Check size={15} /> Verified
                </span>
              ) : (
                <Button type="button" variant="secondary" size="md" onClick={() => openVerify('email')} className="mb-0">
                  Verify Email
                </Button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Mobile"
                  leftAdornment="+91"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  disabled={mobileVerified}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
                    setMobileVerified(false)
                  }}
                  onBlur={() => setMobileTouched(true)}
                  error={mobileTouched && !mobileValid ? 'Enter a valid Indian mobile number.' : undefined}
                />
              </div>
              {mobileVerified ? (
                <span className="mb-1 flex h-11 items-center gap-1 rounded-xl bg-success-50 px-3 text-sm font-bold text-success">
                  <Check size={15} /> Verified
                </span>
              ) : (
                <Button type="button" variant="secondary" size="md" onClick={() => openVerify('mobile')} className="mb-0">
                  Verify Mobile
                </Button>
              )}
            </div>
          </div>

          <div>
            <Input
              label="Password"
              type="password"
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
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setConfirmTouched(true)}
            error={confirmTouched && !confirmValid ? 'Passwords do not match.' : undefined}
          />

          {submitError && (
            <p className="rounded-lg bg-coral-50 px-3 py-2 text-sm font-medium text-coral-700" role="alert">
              {submitError}
            </p>
          )}

          <Button type="submit" fullWidth size="lg">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-grey-DEFAULT">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-plum hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <Modal open={modalTarget !== null} onClose={() => setModalTarget(null)} title={`Verify your ${modalTarget}`}>
        <p className="text-sm text-grey-DEFAULT">
          Enter the 6-digit code sent to {modalTarget === 'email' ? email : `+91 ${mobile}`}.
        </p>
        <p className="mt-1 inline-block rounded-md bg-plum-50 px-2 py-1 text-xs font-semibold text-plum-600">
          Prototype demo OTP: {demoOtp}
        </p>
        <div className="mt-4">
          <OTPInput onComplete={setOtp} error={otpError} />
        </div>
        <Button fullWidth className="mt-5" disabled={otp.length !== 6} onClick={handleVerify}>
          Verify
        </Button>
        <div className="mt-3 text-center text-sm text-grey-DEFAULT">
          {countdown.isActive ? (
            <span>
              Resend code in <span className="font-semibold text-ink">{countdown.seconds}s</span>
            </span>
          ) : (
            <button onClick={countdown.restart} className="font-semibold text-plum hover:underline">
              Resend code
            </button>
          )}
        </div>
      </Modal>
    </div>
  )
}
