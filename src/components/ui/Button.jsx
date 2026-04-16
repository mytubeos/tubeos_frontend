export const Button = ({
  children, onClick, type = 'button', variant = 'brand',
  size = 'md', fullWidth = false, loading = false,
  disabled = false, icon: Icon, className = '',
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    brand:  'bg-brand hover:bg-indigo-500 text-white shadow-lg shadow-brand/20',
    ghost:  'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10',
    danger: 'bg-rose/10 hover:bg-rose/20 text-rose border border-rose/20',
    success:'bg-emerald/10 hover:bg-emerald/20 text-emerald border border-emerald/20',
  }
  const sizes = {
    xs: 'text-xs px-2.5 py-1.5',
    sm: 'text-sm px-3.5 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : Icon && <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  )
}
