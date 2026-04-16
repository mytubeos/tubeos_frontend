import { useState }      from 'react'
import { paymentApi }    from '../../api/payment.api'
import { useAuthStore }  from '../../store/authStore'
import { Button }        from '../ui/Button'
import toast             from 'react-hot-toast'

const loadRazorpay = () => new Promise(resolve => {
  if (window.Razorpay) { resolve(true); return }
  const s = document.createElement('script')
  s.src = 'https://checkout.razorpay.com/v1/checkout.js'
  s.onload = () => resolve(true); s.onerror = () => resolve(false)
  document.body.appendChild(s)
})

const LABELS = {
  creator: { monthly: '₹199/mo', yearly: '₹1,599/yr' },
  pro:     { monthly: '₹499/mo', yearly: '₹3,999/yr' },
  agency:  { monthly: '₹2,999/mo', yearly: '₹23,999/yr' },
}

export const PaymentButton = ({ plan, period = 'monthly', label, variant = 'brand', size = 'md', fullWidth = false, onSuccess }) => {
  const { refreshUser } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) { toast.error('Payment gateway failed to load'); return }

      const orderRes = await paymentApi.createOrder(plan, period)
      const order    = orderRes.data.data

      const options = {
        key:         order.keyId,
        amount:      order.amount,
        currency:    order.currency,
        name:        'TubeOS',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan — ${period}`,
        order_id:    order.orderId,
        prefill:     { name: order.userName, email: order.userEmail },
        theme:       { color: '#4F46E5' },
        handler: async (response) => {
          try {
            const res = await paymentApi.verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            await refreshUser()
            toast.success(res.data.data?.message || 'Payment successful! 🎉')
            onSuccess?.(res.data.data)
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed')
          }
        },
        modal: { ondismiss: () => toast('Payment cancelled') },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (r) => toast.error(`Payment failed: ${r.error.description}`))
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment')
    } finally { setLoading(false) }
  }

  return (
    <Button variant={variant} size={size} fullWidth={fullWidth} loading={loading} onClick={handlePay}>
      {label || `Upgrade — ${LABELS[plan]?.[period] || 'Subscribe'}`}
    </Button>
  )
}
