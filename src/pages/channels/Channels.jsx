import { useState, useEffect }   from 'react'
import { useSearchParams }        from 'react-router-dom'
import { Youtube, Plus, RefreshCw, Star, Trash2, ExternalLink } from 'lucide-react'
import { useChannel }             from '../../hooks/useChannel'
import { useAuthStore }           from '../../store/authStore'
import { Button }                 from '../../components/ui/Button'
import { Badge, StatusBadge }     from '../../components/ui/Badge'
import { ConfirmModal }           from '../../components/ui/Modal'
import { Spinner }                from '../../components/ui/Spinner'
import { formatNumber, formatDate } from '../../utils/formatters'
import { PLANS }                  from '../../utils/constants'
import toast                      from 'react-hot-toast'

export const Channels = () => {
  const { user }                          = useAuthStore()
  const { channels, isLoading, fetchChannels, connectChannel, disconnectChannel, syncChannel, setPrimary } = useChannel()
  const [searchParams, setSearchParams]   = useSearchParams()
  const [disconnectId, setDisconnectId]   = useState(null)
  const [disconnecting, setDisconnecting] = useState(false)
  const [syncingId, setSyncingId]         = useState(null)
  const [connecting, setConnecting]       = useState(false)

  const planLimit = PLANS[user?.plan]?.channels || 1

  // Handle OAuth callback
  useEffect(() => {
    fetchChannels()
    const ytConnected = searchParams.get('youtube_connected')
    const ytError     = searchParams.get('youtube_error')
    const channel     = searchParams.get('channel')
    if (ytConnected) {
      toast.success(`✅ ${decodeURIComponent(channel || 'Channel')} connected!`)
      fetchChannels()
      setSearchParams({})
    } else if (ytError) {
      const msgs = { access_denied: 'Access denied', missing_params: 'OAuth failed — try again', invalid_state: 'Session expired — try again' }
      toast.error(msgs[ytError] || decodeURIComponent(ytError))
      setSearchParams({})
    }
  }, [])

  const handleConnect = async () => { setConnecting(true); await connectChannel(); setConnecting(false) }
  const handleSync    = async (id) => { setSyncingId(id); await syncChannel(id); setSyncingId(null) }
  const handleDisconnect = async () => {
    if (!disconnectId) return
    setDisconnecting(true)
    await disconnectChannel(disconnectId)
    setDisconnecting(false); setDisconnectId(null)
  }

  const atLimit = channels.length >= planLimit

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">Channels</h1>
          <p className="text-gray-500 text-sm mt-0.5">{channels.length}/{planLimit} channels connected{atLimit && <span className="text-amber ml-2">· Limit reached</span>}</p>
        </div>
        <Button icon={Plus} onClick={handleConnect} loading={connecting} disabled={atLimit}>
          Connect Channel
        </Button>
      </div>

      {/* Slot bar */}
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Youtube size={15} className="text-rose" /><span className="text-sm font-medium text-white">Channel Slots</span></div>
          <Badge variant={atLimit ? 'rose' : 'emerald'} size="sm">{channels.length}/{planLimit} used</Badge>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${atLimit ? 'bg-rose' : 'bg-brand-gradient'}`}
            style={{ width: `${Math.min(100, (channels.length / planLimit) * 100)}%` }} />
        </div>
        {atLimit && <p className="text-xs text-amber mt-2">Upgrade to Pro for 3 channels or Agency for 25</p>}
      </div>

      {/* Loading */}
      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

      {/* Empty */}
      {!isLoading && !channels.length && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-rose/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Youtube size={28} className="text-rose" />
          </div>
          <h2 className="font-display font-bold text-white text-xl mb-2">Connect your first channel</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">Link your YouTube channel via OAuth to start using TubeOS</p>
          <Button icon={Plus} size="lg" onClick={handleConnect} loading={connecting}>Connect YouTube Channel</Button>
        </div>
      )}

      {/* Channel cards */}
      <div className="space-y-4">
        {channels.map(ch => (
          <div key={ch._id} className="glass rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img src={ch.thumbnail || `https://ui-avatars.com/api/?name=${ch.channelName}&background=4F46E5&color=fff&size=48`}
                  alt={ch.channelName} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10" />
                {ch.isPrimary && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber rounded-full flex items-center justify-center">
                    <Star size={11} className="text-white fill-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{ch.channelName}</h3>
                    {ch.channelHandle && <p className="text-xs text-gray-500">{ch.channelHandle}</p>}
                  </div>
                  <StatusBadge status={ch.connectionStatus || 'connected'} />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'Subscribers', value: formatNumber(ch.stats?.subscriberCount) },
                    { label: 'Videos',      value: formatNumber(ch.stats?.videoCount) },
                    { label: 'Total Views', value: formatNumber(ch.stats?.viewCount) },
                  ].map(({ label, value }) => (
                    <div key={label} className="glass p-2 rounded-xl text-center">
                      <p className="font-bold text-white text-sm">{value}</p>
                      <p className="text-2xs text-gray-600">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {!ch.isPrimary && <Button size="xs" variant="ghost" icon={Star} onClick={() => setPrimary(ch._id)}>Set Primary</Button>}
                  <Button size="xs" variant="ghost" icon={RefreshCw} onClick={() => handleSync(ch._id)} loading={syncingId === ch._id}>Sync</Button>
                  <a href={`https://youtube.com/channel/${ch.channelId}`} target="_blank" rel="noopener noreferrer">
                    <Button size="xs" variant="ghost" icon={ExternalLink}>View</Button>
                  </a>
                  <Button size="xs" variant="danger" icon={Trash2} onClick={() => setDisconnectId(ch._id)}>Disconnect</Button>
                </div>
                {ch.stats?.lastSyncedAt && <p className="text-2xs text-gray-600 mt-2">Last synced: {formatDate(ch.stats.lastSyncedAt, 'datetime')}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={!!disconnectId} onClose={() => setDisconnectId(null)} onConfirm={handleDisconnect}
        title="Disconnect Channel" message="This will remove the channel from TubeOS. Your YouTube channel won't be affected."
        confirmLabel="Disconnect" confirmVariant="danger" loading={disconnecting} />
    </div>
  )
}
