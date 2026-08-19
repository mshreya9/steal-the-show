import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import type { ConfirmationResult } from 'firebase/auth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import OTPInput from '../../components/OTPInput/OTPInput'
import PromotionalBanner from '../../components/PromotionalBanner/PromotionalBanner'
import { useCountdown } from '../../hooks/useCountdown'
import { placeholderImage, GRADIENTS } from '../../utils/placeholder'
import { resetRecaptcha, sendMobileOtp, verifyMobileOtp } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

type Stage = 'mobile' | 'otp'

const MOBILE_REGEX = /^[6-9]\d{9}$/
const RECAPTCHA_ID = 'recaptcha-container-login'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshProfile } = useAuth()

  const [stage, setStage] = useState<Stage>('mobile')
  const [mobile, setMobile] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [sending, setSending] = useState(false)
  const [recaptchaKey, setRecaptchaKey] = useState(0)

  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const confirmationRef = useRef<ConfirmationResult | null>(null)
  const countdown = useCountdown(30)

  const heroImage = placeholderImage('Steal the Show', GRADIENTS.plum)

  useEffect(() => {
    return () => resetRecaptcha()
  }, [])

  const sendOtp = async () => {
    if (!MOBILE_REGEX.test(mobile)) {
      setMobileError('Enter a valid 10-digit Indian mobile number.')
      return
    }
    setMobileError('')
    setSending(true)
    // Force a brand-new reCAPTCHA container node before every attempt — reusing
    // the same DOM node across attempts is what triggers Google's "reCAPTCHA has
    // already been rendered in this element" error.
    flushSync(() => setRecaptchaKey((k) => k + 1))
    const result = await sendMobileOtp(`+91${mobile}`, RECAPTCHA_ID)
    setSending(false)
    if (!result.ok) {
      setMobileError(result.error)
      return
    }
    confirmationRef.current = result.data
    setOtp('')
    setOtpError('')
    setStage('otp')
    countdown.restart()
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    void sendOtp()
  }

  const handleVerify = async (code: string) => {
    if (!confirmationRef.current) return
    setVerifying(true)
    const result = await verifyMobileOtp(confirmationRef.current, code)
    setVerifying(false)
    if (!result.ok) {
      setOtpError(result.error)
      return
    }
    await refreshProfile()
    const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
    navigate(redirectTo, { replace: true })
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
            We'll handle the look - buy or rent event outfits, costumes and accessories, delivered within 24 hours.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-md flex-col justify-center">
          <div className="mb-6">
            <PromotionalBanner />
          </div>

          {stage === 'mobile' && (
            <>
              <h1 className="font-display text-3xl font-extrabold text-ink">Welcome back.</h1>
              <p className="mt-1 text-sm text-grey-DEFAULT">Log in with your mobile number to steal the show.</p>

              <form onSubmit={handleSendOtp} className="mt-8 flex flex-col gap-4">
                <Input
                  label="Mobile Number"
                  leftAdornment="+91"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  error={mobileError}
                />
                <Button type="submit" fullWidth size="lg" disabled={sending}>
                  {sending ? 'Sending OTP…' : 'Send OTP'}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-grey-DEFAULT">
                New to Steal the Show?{' '}
                <Link to="/register" className="font-semibold text-plum hover:underline">
                  Create an account
                </Link>
              </p>
            </>
          )}

          {stage === 'otp' && (
            <OtpStage
              description={`Enter the 6-digit OTP sent to +91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`}
              onBack={() => {
                setStage('mobile')
                setOtp('')
                setOtpError('')
              }}
              otp={otp}
              setOtp={setOtp}
              otpError={otpError}
              verifying={verifying}
              onVerify={handleVerify}
              countdown={countdown}
              onResend={sendOtp}
            />
          )}

          <div key={recaptchaKey} id={RECAPTCHA_ID} />
        </div>
      </div>
    </div>
  )
}

function OtpStage({
  description,
  onBack,
  otp,
  setOtp,
  otpError,
  verifying,
  onVerify,
  countdown,
  onResend,
}: {
  description: string
  onBack: () => void
  otp: string
  setOtp: (v: string) => void
  otpError: string
  verifying: boolean
  onVerify: (code: string) => void
  countdown: { seconds: number; isActive: boolean; restart: () => void }
  onResend: () => void
}) {
  return (
    <>
      <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-grey-DEFAULT hover:text-plum">
        <ArrowLeft size={15} /> Change mobile number
      </button>
      <h1 className="font-display text-2xl font-extrabold text-ink">Verify it's you</h1>
      <p className="mt-1 text-sm text-grey-DEFAULT">{description}</p>

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
          <button
            onClick={() => {
              countdown.restart()
              onResend()
            }}
            className="font-semibold text-plum hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </>
  )
}
