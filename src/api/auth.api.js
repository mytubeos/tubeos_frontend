import api from './axios'

export const authApi = {
  register:       (data)          => api.post('/api/v1/auth/register', data),
  login:          (data)          => api.post('/api/v1/auth/login', data),
  logout:         ()              => api.post('/api/v1/auth/logout'),
  refresh:        ()              => api.post('/api/v1/auth/refresh'),
  verifyEmail:    (token, data)   => data?.otp
                                     ? api.post('/api/v1/auth/verify-email', data)
                                     : api.get(`/api/v1/auth/verify-email?token=${token}`),
  resendOTP:      (email)         => api.post('/api/v1/auth/resend-otp', { email }),
  forgotPassword: (email)         => api.post('/api/v1/auth/forgot-password', { email }),
  resetPassword:  (token, password) => api.post(`/api/v1/auth/reset-password?token=${token}`, { password }),
  getMe:          ()              => api.get('/api/v1/auth/me'),
  updateMe:       (data)          => api.patch('/api/v1/auth/me', data),
  changePassword: (data)          => api.patch('/api/v1/auth/change-password', data),
    }
