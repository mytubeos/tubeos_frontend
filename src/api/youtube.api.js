import api from './axios'

export const youtubeApi = {
  getAuthUrl:    ()            => api.get('/youtube/auth'),
  getChannels:   ()            => api.get('/youtube/channels'),
  syncChannel:   (id)          => api.post(`/youtube/channels/${id}/sync`),
  disconnect:    (id)          => api.delete(`/youtube/channels/${id}`),
  setPrimary:    (id)          => api.patch(`/youtube/channels/${id}/primary`),
}
