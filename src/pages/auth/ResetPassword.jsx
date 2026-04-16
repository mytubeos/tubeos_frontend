import { useState }               from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Lock }                    from 'lucide-react'
import { authApi }                 from '../../api/auth.api'
import { Button }                  from '../../components/ui/Button'
import toast                       from 'react-hot-toast'

export const ResetPassword = () => {
  const [searchParams]          = useSearchParams()
  const navigate                 = useNavigate()
  const token                    = searchParams.get('token')
  const [password, setPassword]  = useState('')
  const [confirm, setConfirm]    = useState('')
  const [loading, setLoading]    = useState(false)
  const [error, setError]        = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError('Min 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (!token) { setError('Invalid reset link'); return }
    setLoading(true)
    try {
      await authApi.resetPassword(token, password)
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-white text-2xl mb-1">Reset password</h1>
        <p className="text-gray-500 text-sm">Enter your new password below</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">New Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="password" placeholder="Min 8 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              className="input-field pl-10" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="password" placeholder="Confirm password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              className="input-field pl-10" />
          </div>
        </div>
        {error && <p className="text-rose text-sm">{error}</p>}
        <Button type="submit" fullWidth loading={loading} size="lg">Reset Password</Button>
      </form>
      <div className="mt-5 text-center">
        <Link to="/login" className="text-gray-500 text-sm hover:text-gray-300">Back to login</Link>
      </div>
    </div>
  )
}
