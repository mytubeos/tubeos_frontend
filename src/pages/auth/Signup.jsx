import { useState }             from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Gift } from 'lucide-react'
import { useAuthStore }          from '../../store/authStore'
import { Input }                 from '../../components/ui/Input'
import { Button }                from '../../components/ui/Button'
import toast                     from 'react-hot-toast'

export const Signup = () => {
  const { register, isLoading } = useAuthStore()
  const [searchParams]           = useSearchParams()
  const navigate                 = useNavigate()

  const [form, setForm]     = useState({ name: '', email: '', password: '', referralCode: searchParams.get('ref') || '' })
  const [showPass, setShow] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 chars'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (form.password.length < 8) e.password = 'Min 8 characters'
    else if (!/[A-Z]/.test(form.password) || !/\d/.test(form.password)) e.password = 'Needs uppercase + number'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = await register(form)
    if (result.success) {
      if (result.requiresVerification && result.userId) {
        navigate(`/verify-email?userId=${result.userId}&email=${encodeURIComponent(form.email)}`)
      } else {
        toast.success('Account created! Please log in.')
        navigate('/login')
      }
    } else {
      toast.error(result.message || 'Registration failed')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-white text-2xl mb-1">Create account</h1>
        <p className="text-gray-500 text-sm">Join TubeOS and grow your YouTube channel with AI</p>
      </div>

      {/* Founders bar */}
      <div className="mb-6 p-3 glass rounded-xl border border-brand/20">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-gray-500">Founders spots (Creator plan)</span>
          <span className="text-xs font-bold text-brand">88 left</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-brand-gradient rounded-full" style={{ width: '82%' }} />
        </div>
        <p className="text-2xs text-gray-600 mt-1">412/500 spots taken — ₹199/mo locked forever</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" name="name" placeholder="Satish Kumar"
          value={form.name} onChange={set('name')} icon={User} error={errors.name} required />

        <Input label="Email" name="email" type="email" placeholder="you@example.com"
          value={form.email} onChange={set('email')} icon={Mail} error={errors.email} required />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Password <span className="text-rose">*</span></label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPass ? 'text' : 'password'} placeholder="Min 8 chars, uppercase + number"
              value={form.password} onChange={set('password')}
              className={`input-field pl-10 pr-10 ${errors.password ? 'border-rose/50' : ''}`}
            />
            <button type="button" onClick={() => setShow(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-rose text-xs">{errors.password}</p>}
        </div>

        <Input label="Referral Code (Optional)" name="referralCode" placeholder="e.g. SATISH4291"
          value={form.referralCode} onChange={set('referralCode')} icon={Gift}
          hint={form.referralCode ? '10% discount applied for 3 months! 🎉' : ''} />

        <Button type="submit" fullWidth loading={isLoading} size="lg">Create Account</Button>
      </form>

      <p className="text-gray-600 text-xs text-center mt-4">By signing up you agree to our Terms of Service.</p>
      <div className="mt-5 text-center">
        <p className="text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand hover:text-indigo-400 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
