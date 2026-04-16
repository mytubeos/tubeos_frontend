export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-white/10 text-gray-300',
    brand:   'bg-brand/20 text-indigo-300',
    emerald: 'bg-emerald/15 text-emerald',
    rose:    'bg-rose/15 text-rose',
    amber:   'bg-amber/15 text-amber',
    gray:    'bg-white/5 text-gray-500',
  }
  const sizes = { sm: 'text-2xs px-2 py-0.5', md: 'text-xs px-2.5 py-1' }
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export const StatusBadge = ({ status }) => {
  const map = {
    connected:    { label: 'Connected',    variant: 'emerald' },
    disconnected: { label: 'Disconnected', variant: 'gray' },
    token_expired:{ label: 'Reconnect',    variant: 'rose' },
    error:        { label: 'Error',        variant: 'rose' },
  }
  const { label, variant } = map[status] || { label: status, variant: 'default' }
  return <Badge variant={variant} size="sm">{label}</Badge>
}
