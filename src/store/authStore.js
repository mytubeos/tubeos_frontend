import { create } from 'zustand'
import { authApi }  from '../api/auth.api'

export const useAuthStore = create((set, get) => ({
  user:      null,
  isLoading: false,
  isChecked: false,

  register: async (data) => {
    set({ isLoading: true })
    try {
      const res = await authApi.register(data)
      const { userId, requiresVerification } = res.data.data || {}
      set({ isLoading: false })
      return { success: true, userId, requiresVerification }
    } catch (err) {
      set({ isLoading: false })
      return { success: false, message: err.response?.data?.message || 'Registration failed' }
    }
  },

  login: async (data) => {
    set({ isLoading: true })
    try {
      const res   = await authApi.login(data)
      const token = res.data.data?.tokens?.accessToken
      if (token) localStorage.setItem('accessToken', token)
      set({ user: res.data.data?.user, isLoading: false })
      return { success: true }
    } catch (err) {
      set({ isLoading: false })
      return { success: false, message: err.response?.data?.message || 'Login failed', code: err.response?.data?.code }
    }
  },

  logout: async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('accessToken')
    set({ user: null })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) { set({ isChecked: true }); return }
    try {
      const res = await authApi.getMe()
      set({ user: res.data.data, isChecked: true })
    } catch {
      localStorage.removeItem('accessToken')
      set({ user: null, isChecked: true })
    }
  },

  refreshUser: async () => {
    try {
      const res = await authApi.getMe()
      set({ user: res.data.data })
    } catch {}
  },

  setUser: (user) => set({ user }),
}))
