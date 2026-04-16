import api from './axios'

export const paymentApi = {
  getPricing:    ()               => api.get('/payment/pricing'),
  createOrder:   (plan, period)   => api.post('/payment/order', { plan, period }),
  verifyPayment: (data)           => api.post('/payment/verify', data),
  getHistory:    ()               => api.get('/payment/history'),
}
