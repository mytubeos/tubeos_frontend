import { create }     from 'zustand'
import { youtubeApi } from '../api/youtube.api'

export const useChannelStore = create((set, get) => ({
  channels:      [],
  isLoading:     false,

  fetchChannels: async () => {
    set({ isLoading: true })
    try {
      const res = await youtubeApi.getChannels()
      set({ channels: res.data.data || [], isLoading: false })
    } catch { set({ isLoading: false }) }
  },

  removeChannel: (id) => set(s => ({ channels: s.channels.filter(c => c._id !== id) })),

  updateChannelStats: (id, stats) => set(s => ({
    channels: s.channels.map(c => c._id === id ? { ...c, stats } : c),
  })),
}))
