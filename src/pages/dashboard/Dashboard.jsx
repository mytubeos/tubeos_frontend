import { useEffect }     from 'react'
import { Link }          from 'react-router-dom'
import { Youtube, BarChart2, MessageSquare, Wand2, ArrowRight, TrendingUp } from 'lucide-react'
import { useAuthStore }  from '../../store/authStore'
import { useChannelStore } from '../../store/channelStore'
import { formatNumber }  from '../../utils/formatters'
import { Button }        from '../../components/ui/Button'
import { Spinner }       from '../../components/ui/Spinner'

const StatCard = ({ icon: Icon, label, value, color = 'brand' }) => {
  const colors = { brand: 'bg-brand/15 text-brand', emerald: 'bg-emerald/15 text-emerald', rose: 'bg-rose/15 text-rose', amber: 'bg-amber/15 text-amber' }
  return (
    <div className="glass rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-display font-bold text-white">{value}</p>
      <p className="text-gray-500 text-sm mt-0.5">{label}</p>
    </div>
  )
}

export const Dashboard = () => {
  const { user }                    = useAuthStore()
  const { channels, fetchChannels, isLoading } = useChannelStore()

  useEffect(() => { fetchChannels() }, [])

  const primary = channels.find(c => c.isPrimary) || channels[0]
  const stats   = primary?.stats

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-white text-2xl">
          {channels.length ? 'Dashboard' : `Welcome, ${user?.name?.split(' ')[0]}! 👋`}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {channels.length ? `Showing stats for ${primary?.channelName}` : 'Connect your YouTube channel to get started'}
        </p>
      </div>

      {/* No channel */}
      {!isLoading && !channels.length && (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-rose/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Youtube size={28} className="text-rose" />
          </div>
          <h2 className="font-display font-bold text-white text-xl mb-2">Connect your YouTube channel</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Link your channel to start tracking analytics, scheduling videos, and automating engagement.
          </p>
          <Link to="/channels">
            <Button size="lg">Connect Channel</Button>
          </Link>
        </div>
      )}

      {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {/* Stats */}
      {primary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={TrendingUp}    label="Subscribers" value={formatNumber(stats?.subscriberCount)} color="brand" />
            <StatCard icon={BarChart2}     label="Total Views"  value={formatNumber(stats?.viewCount)}       color="emerald" />
            <StatCard icon={Youtube}       label="Videos"       value={formatNumber(stats?.videoCount)}      color="rose" />
            <StatCard icon={MessageSquare} label="Plan"         value={user?.plan?.toUpperCase() || 'FREE'}  color="amber" />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { to: '/comments', icon: MessageSquare, title: 'Reply to Comments', desc: 'AI-powered comment replies', color: 'brand' },
              { to: '/ai',       icon: Wand2,         title: 'Generate Content',  desc: 'Titles, scripts, tags',      color: 'emerald' },
              { to: '/scheduler',icon: BarChart2,     title: 'Schedule Videos',   desc: 'Post at the best time',      color: 'amber' },
              { to: '/analytics',icon: TrendingUp,    title: 'View Analytics',    desc: 'Deep channel insights',      color: 'rose' },
            ].map(({ to, icon: Icon, title, desc, color }) => {
              const colors = { brand: 'bg-brand/10 text-brand', emerald: 'bg-emerald/10 text-emerald', amber: 'bg-amber/10 text-amber', rose: 'bg-rose/10 text-rose' }
              return (
                <Link key={to} to={to}>
                  <div className="glass rounded-2xl p-5 hover:border-white/15 transition-all flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{title}</p>
                      <p className="text-gray-600 text-xs">{desc}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
