export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return <div className={`${sizes[size]} border-2 border-brand/20 border-t-brand rounded-full animate-spin ${className}`} />
}
