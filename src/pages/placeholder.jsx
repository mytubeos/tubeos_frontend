// Placeholder pages — replace with full implementation as needed
import { BarChart2, MessageSquare, Calendar, Video, Wand2, TrendingUp, Gift, Clock } from 'lucide-react'

const PlaceholderPage = ({ icon: Icon, title, desc, color = 'brand' }) => {
  const colors = { brand: 'bg-brand/15 text-brand', emerald: 'bg-emerald/15 text-emerald', amber: 'bg-amber/15 text-amber', rose: 'bg-rose/15 text-rose' }
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className={`w-16 h-16 ${colors[color]} rounded-3xl flex items-center justify-center mb-5`}>
        <Icon size={28} />
      </div>
      <h1 className="font-display font-bold text-white text-2xl mb-2">{title}</h1>
      <p className="text-gray-500 text-sm text-center max-w-xs">{desc}</p>
    </div>
  )
}

export const Analytics = () => <PlaceholderPage icon={BarChart2}    title="Analytics"         desc="Deep channel insights — coming soon" color="brand" />
export const CommentInbox = () => <PlaceholderPage icon={MessageSquare} title="Comment Inbox"   desc="AI-powered comment replies — coming soon" color="emerald" />
export const Scheduler    = () => <PlaceholderPage icon={Calendar}   title="Scheduler"         desc="Schedule videos at the best time — coming soon" color="amber" />
export const Videos       = () => <PlaceholderPage icon={Video}      title="Videos"            desc="Manage and upload your videos — coming soon" color="rose" />
export const AIContent    = () => <PlaceholderPage icon={Wand2}      title="AI Tools"          desc="Generate titles, scripts, tags — coming soon" color="brand" />
export const Growth       = () => <PlaceholderPage icon={TrendingUp} title="Growth"            desc="Growth intelligence and competitor tracking — coming soon" color="emerald" />
export const TimeIntel    = () => <PlaceholderPage icon={Clock}      title="Time Intelligence" desc="Best times to post for your audience — coming soon" color="amber" />

export const Referral = () => {
  const { useAuthStore } = require('../../store/authStore')
  // simple inline component
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display font-bold text-white text-2xl">Referral Program</h1>
        <p className="text-gray-500 text-sm mt-1">Invite creators, earn rewards</p>
      </div>
      <PlaceholderPage icon={Gift} title="Coming Soon" desc="Referral rewards program launching soon!" color="amber" />
    </div>
  )
}
