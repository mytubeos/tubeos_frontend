import { useState }   from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Input }        from '../../components/ui/Input'
import { Button }       from '../../components/ui/Button'
import toast            from 'react-hot-toast'

export const Login = () => {
  const { login, isLoading } = useAuthStore()
  const navigate              = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShow]   = useState(false)
  const [error, setError]     = useState('')

  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    const result = await login(form)
    if (result.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      if (result.code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Please verify your email first')
        navigate(`/verify-email?email=${encodeURIComponent(form.email)}`)
      } else {
        setError(result.message || 'Invalid credentials')
      }
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-white text-2xl mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm">Sign in to your Creator Command Center</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" name="email" type="email" placeholder="you@example.com"
          value={form.email} onChange={set('email')} icon={Mail} required />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type={showPass ? 'text' : 'password'} placeholder="Your password"
              value={form.password} onChange={set('password')}
              className="input-field pl-10 pr-10" />
            <button type="button" onClick={() => setShow(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="text-rose text-sm">{error}</p>}

        <div className="text-right">
          <Link to="/forgot-password" className="text-brand text-sm hover:text-indigo-400">Forgot password?</Link>
        </div>

        <Button type="submit" fullWidth loading={isLoading} size="lg">Sign In</Button>
      </form>

      {/* Founders offer */}
      <div className="mt-6 p-3 rounded-xl border border-amber/20 bg-amber/5">
        <p className="text-xs text-amber font-semibold">🏆 Founders Offer</p>
        <p className="text-xs text-gray-400 mt-1">Sign up now and lock in 50% off forever. Only <strong className="text-white">88 spots</strong> remaining on Creator plan.</p>
      </div>

      <div className="mt-5 text-center">
        <p className="text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand hover:text-indigo-400 font-medium">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
