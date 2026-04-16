export const formatNumber = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}

export const formatDate = (d, format = 'date') => {
  if (!d) return '—'
  const date = new Date(d)
  if (format === 'datetime') return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  if (format === 'relative') {
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1)  return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24)  return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }
  return date.toLocaleDateString('en-IN', { dateStyle: 'medium' })
}

export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
