import { useState }         from 'react'
import { useAuthStore }     from '../../store/authStore'
import { authApi }          from '../../api/auth.api'
import { PaymentButton }    from '../../components/features/PaymentButton'
import { Button }           from '../../components/ui/Button'
import { Input }            from '../../components/ui/Input'
import { Badge }            from '../../components/ui/Badge'
import { PLANS, PLAN_COLORS } from '../../utils/constants'
import { User, Lock, CreditCard, CheckCircle } from 'lucide-react'
import toast                from 'react-hot-toast'

const PLAN_FEATURES = {
  creator: ['1 YouTube channel', '500 AI replies/mo', '5 video uploads/mo', 'Analytics dashboard', 'Smart scheduling'],
  pro:     ['3 YouTube channels', '1,200 AI replies/mo', '20 video uploads/mo', 'Everything in Creator', 'Growth intelligence'],
  agency:  ['25 YouTube channels', 'Unlimited AI replies', 'Unlimited uploads', 'Everything in Pro', 'Priority support'],
}

export const Settings = () => {
  const { user, refreshUser }    = useAuthStore()
  const [tab, setTab]            = useState('profile')
  const [name, setName]          = useState(user?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [passwords, setPasswords]= useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [savingPass, setSavingPass] = useState(false)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await authApi.updateMe({ name })
      await refreshUser()
      toast.success('Profile updated!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setSavingProfile(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirm) { toast.error('Passwords do not match'); return }
    if (passwords.newPassword.length < 8) { toast.error('Min 8 characters'); return }
    setSavingPass(true)
    try {
      await authApi.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      toast.success('Password changed!')
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password') }
    finally { setSavingPass(false) }
  }

  const tabs = [
    { id: 'profile',  label: 'Profile',  icon: User },
    { id: 'plan',     label: 'Plan',     icon: CreditCard },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-white text-2xl">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass p-1 rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-brand text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === 'profile' && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-white">Profile Information</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input label="Full Name" name="name" value={name} onChange={e => setName(e.target.value)} icon={User} />
            <Input label="Email" name="email" value={user?.email || ''} disabled />
            <Button type="submit" loading={savingProfile}>Save Changes</Button>
          </form>
        </div>
      )}

      {/* Plan */}
      {tab === 'plan' && (
        <div className="space-y-4">
          {/* Current plan */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-white">Current Plan</h2>
              <Badge variant={PLAN_COLORS[user?.plan] || 'gray'}>{user?.plan?.toUpperCase()}</Badge>
            </div>
            {user?.isFounder && <p className="text-xs text-amber">🏆 Founder #{user.founderNumber} — Price locked forever at ₹{(user.lockedPrice / 100).toFixed(0)}/mo</p>}
          </div>

          {/* Upgrade options */}
          {['creator', 'pro', 'agency'].filter(p => p !== user?.plan).map(plan => (
            <div key={plan} className={`glass rounded-2xl p-5 ${plan === 'pro' ? 'border-brand/30' : ''}`}>
              {plan === 'pro' && <p className="text-xs text-brand font-semibold mb-3">⭐ Most Popular</p>}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-white text-lg capitalize">{plan}</h3>
                  <p className="text-gray-500 text-sm">{PLANS[plan]?.channels} channel{PLANS[plan]?.channels > 1 ? 's' : ''} · {PLANS[plan]?.aiReplies === -1 ? 'Unlimited' : PLANS[plan]?.aiReplies} AI replies</p>
                </div>
              </div>
              <ul className="space-y-2 mb-5">
                {PLAN_FEATURES[plan]?.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-emerald flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <PaymentButton plan={plan} period="monthly" fullWidth
                variant={plan === 'pro' ? 'brand' : 'ghost'}
                onSuccess={() => window.location.reload()} />
            </div>
          ))}
        </div>
      )}

      {/* Security */}
      {tab === 'security' && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-white">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input label="Current Password" name="currentPassword" type="password"
              value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} icon={Lock} />
            <Input label="New Password" name="newPassword" type="password"
              value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} icon={Lock} />
            <Input label="Confirm New Password" name="confirm" type="password"
              value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} icon={Lock} />
            <Button type="submit" loading={savingPass}>Change Password</Button>
          </form>
        </div>
      )}
    </div>
  )
}
