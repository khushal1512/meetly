'use client'

import { useState } from 'react'

interface CancelConfirmationModalProps {
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function CancelConfirmationModal({ onClose, onConfirm }: CancelConfirmationModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Cancel Booking?</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-[10px] font-medium transition-colors disabled:opacity-50"
            >
              Keep Booking
            </button>
            <button 
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-[10px] font-medium transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Canceling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
