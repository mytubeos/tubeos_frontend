import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, Clock, Calendar, Video,
  MessageSquare, Wand2, TrendingUp, Youtube, Gift,
  Settings, LogOut, Zap,
} from 'lucide-react'
import { useAuthStore }   from '../../store/authStore'
import { Badge }          from '../ui/Badge'
import { PLAN_COLORS }    from '../../utils/constants'

const NAV = [
  { label: 'OVERVIEW',  items: [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/analytics',  icon: BarChart2,       label: 'Analytics' },
    { to: '/time-intel', icon: Clock,           label: 'Time Intel' },
  ]},
  { label: 'CONTENT',   items: [
    { to: '/scheduler',  icon: Calendar,        label: 'Scheduler' },
    { to: '/videos',     icon: Video,           label: 'Videos' },
    { to: '/comments',   icon: MessageSquare,   label: 'Comments' },
  ]},
  { label: 'AI & GROWTH', items: [
    { to: '/ai',         icon: Wand2,           label: 'AI Tools' },
    { to: '/growth',     icon: TrendingUp,      label: 'Growth' },
  ]},
  { label: 'ACCOUNT',   items: [
    { to: '/channels',   icon: Youtube,         label: 'Channels' },
    { to: '/referral',   icon: Gift,            label: 'Referral' },
    { to: '/settings',   icon: Settings,        label: 'Settings' },
  ]},
]

export const Sidebar = () => {
  const { user, logout } = useAuthStore()
  const navigate         = useNavigate()
  const planColor        = PLAN_COLORS[user?.plan] || 'gray'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 h-screen fixed left-0 top-0 flex flex-col border-r border-white/5 bg-base-600 z-30">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">TubeOS</p>
            <p className="text-2xs text-gray-600">Command Center</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {NAV.map(({ label, items }) => (
          <div key={label}>
            <p className="text-2xs text-gray-700 font-semibold tracking-widest px-2 mb-1.5">{label}</p>
            {items.map(({ to, icon: Icon, label: name }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5 ${
                    isActive
                      ? 'bg-brand/15 text-white font-medium'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`
                }
              >
                <Icon size={15} />
                {name}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-brand/20 flex items-center justify-center text-brand font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <Badge variant={planColor} size="sm">{user?.plan || 'free'}</Badge>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-600 hover:text-rose rounded-lg hover:bg-rose/10 transition-all"
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  )
}
