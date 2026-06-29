'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Check } from 'lucide-react'
import type { Desk } from '../types'

interface BookingModalProps {
  desk: Desk
  startAt: Date
  endAt: Date
  onClose: () => void
  onConfirm: (bookedBy: string, recurringWeeks: number, note: string) => Promise<void>
  error: string
}

export function BookingModal({ desk, startAt, endAt, onClose, onConfirm, error }: BookingModalProps) {
  const [bookedBy, setBookedBy] = useState('')
  const [note, setNote] = useState('')
  const [recurringWeeks, setRecurringWeeks] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!bookedBy.trim()) return
    setLoading(true)
    await onConfirm(bookedBy, recurringWeeks, note)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Book {desk.name}</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Date & Time</p>
            <p className="font-medium text-lg text-gray-900">
              {format(startAt, 'EEEE, MMMM do')}
            </p>
            <p className="font-medium text-lg text-gray-900">
              {format(startAt, 'h:mm a')} - {format(endAt, 'h:mm a')}
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input 
              type="text" 
              value={bookedBy}
              onChange={e => setBookedBy(e.target.value)}
              className="w-full border border-gray-300 rounded-[10px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FE4D00] focus:border-transparent transition-shadow text-gray-900"
              placeholder="e.g. Jane Doe"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
            <input 
              type="text" 
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE4D00] focus:border-transparent transition-shadow text-gray-900"
              placeholder="e.g. Project kick-off"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Repeat for (Weeks)</label>
            <input 
              type="number" 
              min={0} 
              max={12} 
              value={recurringWeeks}
              onChange={e => setRecurringWeeks(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE4D00] focus:border-transparent transition-shadow text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">Set to 0 for no repetition (max 12).</p>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm font-medium p-3 bg-red-50 rounded-[10px]">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-[10px] font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={!bookedBy.trim() || loading}
              className="flex-1 py-3 px-4 bg-[#FE4D00] hover:bg-[#E64600] text-white rounded-[10px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <span className="animate-pulse">Booking...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
