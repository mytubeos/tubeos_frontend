import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} glass rounded-2xl p-6 shadow-2xl`}>
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white text-lg">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmVariant = 'danger', loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-gray-400 text-sm mb-6">{message}</p>
    <div className="flex gap-3">
      <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
      <Button variant={confirmVariant} fullWidth onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
    </div>
  </Modal>
)
