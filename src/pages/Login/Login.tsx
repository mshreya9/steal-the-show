import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Chrome, Sparkles } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import OTPInput from '../../components/OTPInput/OTPInput'
import PromotionalBanner from '../../components/PromotionalBanner/PromotionalBanner'
import { useAuth } from '../../context/AuthContext'
import { useCountdown } from '../../hooks/useCountdown'
import { placeholderImage, GRADIENTS } from '../../utils/placeholder'

type Stage = 'default' | 'email-entry' | 'mobile-otp' | 'email-otp'

const MOBILE_REGEX = /^[6-9]\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const { login, demoOtp } = useAuth()

  const [agreed, setAgreed] = useState(false)
  const [agreedError, setAgreedError] = useState('')
  const [stage, setStage] = useState<Stage>('default')

  const [mobile, setMobile] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const mobileCountdown = useCountdown(30)
  const emailCountdown = useCountdown(30)

  const heroImage = placeholderImage('Steal The Show', GRADIENTS.plum)

  const requireAgreement = () => {
    if (!agreed) {
      setAgreedError('Please accept the Terms of Use and confirm you are 18 or older to continue.')
      return false
    }
    setAgreedError('')
    return true
  }

  const handleSendMobileOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!requireAgreement()) return
    if (!MOBILE_REGEX.test(mobile)) {
      setMobileError('Enter a valid 10-digit Indian mobile number.')
      return
    }
    setMobileError('')
    setOtp('')
    setOtpError('')
    setStage('mobile-otp')
    mobileCountdown.restart()
  }

  const handleSendEmailCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!requireAgreement()) return
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Enter a valid email address.')
      return
    }
    setEmailError('')
    setOtp('')
    setOtpError('')
    setStage('email-otp')
    emailCountdown.restart()
  }

  const verifyOtp = (code: string, method: 'mobile' | 'email') => {
    setVerifying(true)
    window.setTimeout(() => {
      setVerifying(false)
      if (code !== demoOtp) {
        setOtpError(`Incorrect code. Use the demo OTP ${demoOtp} for this prototype.`)
        return
      }
      setOtpError('')
      login({
        name: method === 'mobile' ? `User ${mobile.slice(-4)}` : email.split('@')[0],
        mobile: method === 'mobile' ? mobile : undefined,
        email: method === 'email' ? email : undefined,
        authMethod: method,
      })
      navigate('/')
    }, 500)
  }

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    if (!requireAgreement()) return
    login({ name: provider === 'google' ? 'Google User' : 'Apple User', authMethod: provider })
    navigate('/')
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-900/70 via-plum-700/20 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <Sparkles size={28} className="mb-4 text-coral-300" />
          <h2 className="font-display text-4xl font-bold leading-tight">Steal the show.</h2>
          <p className="mt-2 max-w-sm text-white/85">
            We'll handle the look — buy or rent event outfits, costumes and accessories, delivered within 24 hours.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6">
            <PromotionalBanner />
          </div>

          {stage === 'default' && (
            <>
              <h1 className="font-display text-3xl font-extrabold text-ink">Welcome back.</h1>
              <p className="mt-1 text-sm text-grey-DEFAULT">Ready to steal the show?</p>

              <label className="mt-6 flex items-start gap-2.5 rounded-xl border border-grey-200 bg-white p-3.5">
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
                  By continuing, I agree to the{' '}
                  <Link to="/legal/terms" className="font-semibold text-plum hover:underline">
                    Terms of Use
                  </Link>{' '}
                  and{' '}
                  <Link to="/legal/privacy" className="font-semibold text-plum hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  and confirm that I am 18 years or older.
                </span>
              </label>
              {agreedError && (
                <p className="mt-1.5 text-xs font-medium text-coral-700" role="alert">
                  {agreedError}
                </p>
              )}

              <form onSubmit={handleSendMobileOtp} className="mt-4 flex flex-col gap-4">
                <Input
                  label="Mobile Number"
                  leftAdornment="+91"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  error={mobileError}
                />
                <Button type="submit" fullWidth>
                  Send OTP
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs font-semibold text-grey">
                <span className="h-px flex-1 bg-grey-200" /> OR <span className="h-px flex-1 bg-grey-200" />
              </div>

              <Button variant="secondary" fullWidth onClick={() => requireAgreement() && setStage('email-entry')}>
                Continue with Email
              </Button>

              <div className="mt-3 flex flex-col gap-3">
                <Button variant="secondary" fullWidth onClick={() => handleSocialLogin('google')}>
                  <Chrome size={17} /> Continue with Google
                </Button>
                <Button variant="secondary" fullWidth onClick={() => handleSocialLogin('apple')}>
                  <AppleIcon /> Continue with Apple
                </Button>
              </div>

              <p className="mt-8 text-center text-sm text-grey-DEFAULT">
                New to Steal The Show?{' '}
                <Link to="/register" className="font-semibold text-plum hover:underline">
                  Create an account
                </Link>
              </p>
            </>
          )}

          {stage === 'email-entry' && (
            <>
              <button
                onClick={() => setStage('default')}
                className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-grey-DEFAULT hover:text-plum"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <h1 className="font-display text-2xl font-extrabold text-ink">Continue with email</h1>
              <p className="mt-1 text-sm text-grey-DEFAULT">We'll send you a one-time verification code.</p>
              <form onSubmit={handleSendEmailCode} className="mt-6 flex flex-col gap-4">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                />
                <Button type="submit" fullWidth>
                  Send Verification Code
                </Button>
              </form>
            </>
          )}

          {stage === 'mobile-otp' && (
            <OtpStage
              description={`Enter the 6-digit OTP sent to +91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`}
              onBack={() => {
                setStage('default')
                setOtp('')
                setOtpError('')
              }}
              backLabel="Change mobile number"
              otp={otp}
              setOtp={setOtp}
              otpError={otpError}
              verifying={verifying}
              onVerify={(code) => verifyOtp(code, 'mobile')}
              countdown={mobileCountdown}
              demoOtp={demoOtp}
            />
          )}

          {stage === 'email-otp' && (
            <OtpStage
              description={`Enter the verification code sent to ${email}`}
              onBack={() => {
                setStage('email-entry')
                setOtp('')
                setOtpError('')
              }}
              backLabel="Change email"
              otp={otp}
              setOtp={setOtp}
              otpError={otpError}
              verifying={verifying}
              onVerify={(code) => verifyOtp(code, 'email')}
              countdown={emailCountdown}
              demoOtp={demoOtp}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function OtpStage({
  description,
  onBack,
  backLabel,
  otp,
  setOtp,
  otpError,
  verifying,
  onVerify,
  countdown,
  demoOtp,
}: {
  description: string
  onBack: () => void
  backLabel: string
  otp: string
  setOtp: (v: string) => void
  otpError: string
  verifying: boolean
  onVerify: (code: string) => void
  countdown: { seconds: number; isActive: boolean; restart: () => void }
  demoOtp: string
}) {
  return (
    <>
      <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-grey-DEFAULT hover:text-plum">
        <ArrowLeft size={15} /> {backLabel}
      </button>
      <h1 className="font-display text-2xl font-extrabold text-ink">Verify it's you</h1>
      <p className="mt-1 text-sm text-grey-DEFAULT">{description}</p>
      <p className="mt-1 inline-block rounded-md bg-plum-50 px-2 py-1 text-xs font-semibold text-plum-600">
        Prototype demo OTP: {demoOtp}
      </p>

      <div className="mt-6">
        <OTPInput onComplete={(code) => setOtp(code)} error={otpError} />
      </div>

      <Button fullWidth className="mt-6" disabled={otp.length !== 6 || verifying} onClick={() => onVerify(otp)}>
        {verifying ? 'Verifying…' : 'Verify OTP'}
      </Button>

      <div className="mt-4 text-center text-sm text-grey-DEFAULT">
        {countdown.isActive ? (
          <span>
            Resend OTP in <span className="font-semibold text-ink">{countdown.seconds}s</span>
          </span>
        ) : (
          <button onClick={countdown.restart} className="font-semibold text-plum hover:underline">
            Resend OTP
          </button>
        )}
      </div>
    </>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.416 2.14-1.25 3.01-.99 1.03-2.19 1.63-3.5 1.53-.05-1.12.41-2.24 1.26-3.09.83-.83 2.16-1.44 3.28-1.45.02.02.02.02.21.01zM20.7 17.5c-.5 1.16-.74 1.68-1.39 2.7-.9 1.42-2.18 3.19-3.76 3.2-1.41.02-1.77-.92-3.68-.91-1.91.01-2.31.93-3.72.91-1.58-.02-2.79-1.61-3.69-3.03C1.9 17.6.87 14.16 2.24 11.8c.68-1.18 1.9-1.93 3.22-1.95 1.35-.02 2.32.9 3.5.9 1.15 0 1.93-.9 3.5-.9.94.01 2.14.31 3.02.99-.79.46-1.85 1.37-1.85 2.83.01 2.03 1.83 2.73 1.86 2.74-.02.05-.3 1.03-.79 2.09z" />
    </svg>
  )
}
