import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Mail }    from 'lucide-react'
import { authApi }   from '../../api/auth.api'
import { Button }    from '../../components/ui/Button'
import { Spinner }   from '../../components/ui/Spinner'
import toast         from 'react-hot-toast'

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate       = useNavigate()

  const userId = searchParams.get('userId')
  const email  = searchParams.get('email')
  const token  = searchParams.get('token')   // legacy link

  const [otp, setOtp]       = useState(['', '', '', '', '', ''])
  const [loading, setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')
  const [countdown, setCountdown] = useState(60)
  const refs = useRef([])

  // Legacy token auto-verify
  useEffect(() => {
    if (token && !userId) {
      setLoading(true)
      authApi.verifyEmail(token)
        .then(res => {
          const t = res.data.data?.tokens?.accessToken
          if (t) localStorage.setItem('accessToken', t)
          setSuccess(true)
          setTimeout(() => navigate('/dashboard'), 1800)
        })
        .catch(() => setError('Link expired or invalid'))
        .finally(() => setLoading(false))
    }
  }, [token])

  // Countdown
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next); setError('')
    if (val && idx < 5) refs.current[idx + 1]?.focus()
    if (next.every(d => d) && val) handleVerify(next.join(''))
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus()
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) { setOtp(text.split('')); handleVerify(text) }
  }

  const handleVerify = async (otpStr) => {
    const code = otpStr || otp.join('')
    if (code.length !== 6) { setError('Enter all 6 digits'); return }
    setLoading(true)
    try {
      const res = await authApi.verifyEmail(null, { otp: code, userId })
      const t   = res.data.data?.tokens?.accessToken
      if (t) localStorage.setItem('accessToken', t)
      setSuccess(true)
      toast.success('Email verified! Welcome 🎉')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Try again.')
      setOtp(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    if (countdown > 0 || !email) return
    setResending(true)
    try {
      await authApi.resendOTP(email)
      setCountdown(60); setOtp(['', '', '', '', '', '']); setError('')
      toast.success('New OTP sent!'); refs.current[0]?.focus()
    } catch { toast.error('Failed to resend OTP') }
    finally { setResending(false) }
  }

  // Legacy loading
  if (token && !userId && loading) return (
    <div className="text-center py-12">
      <Spinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-400">Verifying your email...</p>
    </div>
  )
  if (token && !userId && error) return (
    <div className="text-center py-10">
      <div className="w-14 h-14 bg-rose/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <XCircle size={24} className="text-rose" />
      </div>
      <h2 className="font-bold text-white text-xl mb-2">Link Expired</h2>
      <p className="text-gray-500 text-sm mb-5">This link is invalid or expired.</p>
      <Link to="/login"><Button>Back to Login</Button></Link>
    </div>
  )

  if (success) return (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-emerald/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={28} className="text-emerald" />
      </div>
      <h2 className="font-bold text-white text-xl mb-2">Email Verified!</h2>
      <p className="text-gray-500 text-sm mb-3">Redirecting to dashboard...</p>
      <Spinner size="sm" className="mx-auto" />
    </div>
  )

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="w-14 h-14 bg-brand/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-brand" />
        </div>
        <h1 className="font-display font-bold text-white text-2xl mb-2">Check your inbox</h1>
        <p className="text-gray-500 text-sm">
          We sent a 6-digit code to{' '}
          {email && <span className="text-white font-medium">{decodeURIComponent(email)}</span>}
        </p>
      </div>

      {/* 6-box OTP */}
      <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input key={i} ref={el => refs.current[i] = el}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border bg-white/5 text-white
                        transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                        ${error  ? 'border-rose/60'  : 'border-white/10'}
                        ${digit  ? 'border-brand/50 bg-brand/10' : ''}`}
          />
        ))}
      </div>

      {error && <p className="text-rose text-sm text-center mb-4">{error}</p>}

      <Button fullWidth size="lg" loading={loading} disabled={otp.some(d => !d)} onClick={() => handleVerify()}>
        Verify
      </Button>

      <p className="text-center text-sm text-gray-500 mt-5">
        Didn't receive it?{' '}
        {countdown > 0
          ? <span className="text-gray-600">Resend in {countdown}s</span>
          : <button onClick={handleResend} disabled={resending}
              className="text-brand hover:text-indigo-400 font-medium transition-colors">
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
        }
      </p>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-gray-500 text-sm hover:text-gray-300">Back to login</Link>
      </div>
    </div>
  )
}
