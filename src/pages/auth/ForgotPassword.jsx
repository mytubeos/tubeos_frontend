import { useState }     from 'react'
import { Link }         from 'react-router-dom'
import { Mail }         from 'lucide-react'
import { authApi }      from '../../api/auth.api'
import { Input }        from '../../components/ui/Input'
import { Button }       from '../../components/ui/Button'
import toast            from 'react-hot-toast'

export const ForgotPassword = () => {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent if email exists')
    } catch { toast.error('Something went wrong') }
    finally { setLoading(false) }
  }

  if (sent) return (
    <div className="text-center">
      <div className="w-14 h-14 bg-brand/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Mail size={24} className="text-brand" />
      </div>
      <h2 className="font-bold text-white text-xl mb-2">Check your email</h2>
      <p className="text-gray-400 text-sm mb-6">If this email is registered, a reset link has been sent.</p>
      <Link to="/login"><Button variant="ghost" fullWidth>Back to Login</Button></Link>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-white text-2xl mb-1">Forgot password</h1>
        <p className="text-gray-500 text-sm">Enter your email to receive a reset link</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" name="email" type="email" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} icon={Mail} required />
        <Button type="submit" fullWidth loading={loading} size="lg">Send Reset Link</Button>
      </form>
      <div className="mt-5 text-center">
        <Link to="/login" className="text-gray-500 text-sm hover:text-gray-300">Back to login</Link>
      </div>
    </div>
  )
}
