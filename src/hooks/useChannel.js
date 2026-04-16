import { useChannelStore } from '../store/channelStore'
import { youtubeApi }      from '../api/youtube.api'
import toast               from 'react-hot-toast'

export const useChannel = () => {
  const { channels, isLoading, fetchChannels, removeChannel, updateChannelStats } = useChannelStore()

  const connectChannel = async () => {
    try {
      const res = await youtubeApi.getAuthUrl()
      window.location.href = res.data.data.authUrl
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start YouTube connection')
    }
  }

  const disconnectChannel = async (id) => {
    try {
      await youtubeApi.disconnect(id)
      removeChannel(id)
      toast.success('Channel disconnected')
    } catch { toast.error('Failed to disconnect') }
  }

  const syncChannel = async (id) => {
    try {
      const res = await youtubeApi.syncChannel(id)
      updateChannelStats(id, res.data.data?.stats)
      toast.success('Channel synced!')
    } catch { toast.error('Failed to sync') }
  }

  const setPrimary = async (id) => {
    try {
      await youtubeApi.setPrimary(id)
      await fetchChannels()
      toast.success('Primary channel updated')
    } catch { toast.error('Failed to set primary') }
  }

  return { channels, isLoading, fetchChannels, connectChannel, disconnectChannel, syncChannel, setPrimary }
}
