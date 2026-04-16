import axios from 'axios'
import { API_URL } from '../utils/constants'

const api = axios.create({
  baseURL: `${API_URL}/api/v1`, // ✅ FIXED (prefix added)
  withCredentials: true,
  timeout: 30000,
})

// Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (err) => Promise.reject(err)
)

let isRefreshing = false
let failedQueue  = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original    = error.config
    const isAuthRoute = original?.url?.includes('/auth/')
    const is401       = error.response?.status === 401
    const isExpired   = error.response?.data?.message?.toLowerCase().includes('expired')

    if (is401 && isExpired && !original._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const res = await axios.post(
          `${API_URL}/api/v1/auth/refresh`, // ✅ FIXED
          {},
          { withCredentials: true }
        )

        const token = res.data.data?.tokens?.accessToken
        localStorage.setItem('accessToken', token)

        api.defaults.headers.common.Authorization = `Bearer ${token}`
        processQueue(null, token)

        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch (err) {
        processQueue(err, null)
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    if (is401 && !isExpired && !isAuthRoute && !original._retry) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
