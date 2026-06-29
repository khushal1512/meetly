'use client'

import { format, addHours, startOfDay } from 'date-fns'
import type { Desk, Booking } from '../types'

interface DeskGridProps {
  desks: Desk[]
  currentDate: Date
  ownerToken: string | null
  onSlotClick: (desk: Desk, hour: number) => void
  onCancelClick: (bookingId: string) => void
}

const HOURS = Array.from({ length: 10 }).map((_, i) => i + 8) // 8 AM to 5 PM

export function DeskGrid({ desks, currentDate, ownerToken, onSlotClick, onCancelClick }: DeskGridProps) {
  return (
    <div className="border border-gray-200 rounded-[10px] overflow-hidden bg-white shadow-sm flex-1">
      {/* Header row with times */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        <div className="w-32 flex-shrink-0 border-r border-gray-200 p-4 font-semibold text-gray-700">Desk</div>
        <div className="flex-1 flex overflow-x-auto">
          {HOURS.map(hour => (
            <div key={hour} className="flex-1 min-w-[80px] text-center p-3 border-r border-gray-200 text-sm font-medium text-gray-500 last:border-r-0">
              {hour}:00
            </div>
          ))}
        </div>
      </div>
      
      {/* Desk rows */}
      {desks.map(desk => (
        <div key={desk.id} className="flex border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
          <div className="w-32 flex-shrink-0 border-r border-gray-200 p-4 flex items-center font-medium">
            {desk.name}
          </div>
          <div className="flex-1 flex overflow-x-auto relative">
            {HOURS.map(hour => {
              const slotStart = addHours(startOfDay(currentDate), hour)
              const slotEnd = addHours(startOfDay(currentDate), hour + 1)
              
              // Find overlapping booking
              const overlappingBooking = desk.bookings.find(b => {
                const bStart = new Date(b.startAt).getTime()
                const bEnd = new Date(b.endAt).getTime()
                return slotStart.getTime() < bEnd && slotEnd.getTime() > bStart
              })

              const isOwner = overlappingBooking && overlappingBooking.ownerToken === ownerToken

              return (
                <div 
                  key={hour} 
                  onClick={() => !overlappingBooking && onSlotClick(desk, hour)}
                  className={`flex-1 min-w-[80px] border-r border-gray-200 p-2 cursor-pointer transition-colors relative group last:border-r-0
                    ${overlappingBooking ? 'bg-[#FE4D00]/10 cursor-default' : 'hover:bg-gray-100'}`}
                >
                  {overlappingBooking && (
                    <div className="absolute inset-1 bg-[#FE4D00] rounded-[10px] p-2 flex flex-col justify-between overflow-hidden shadow-sm">
                      <div>
                        <span className="text-white text-xs font-semibold truncate block" title={overlappingBooking.bookedBy}>
                          {overlappingBooking.bookedBy}
                        </span>
                        {overlappingBooking.note && (
                          <span className="text-white/80 text-[10px] truncate block" title={overlappingBooking.note}>
                            {overlappingBooking.note}
                          </span>
                        )}
                      </div>
                      {isOwner && (
                        <button  
                          onClick={(e) => {
                            e.stopPropagation()
                            onCancelClick(overlappingBooking.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-white text-[10px] hover:underline text-left transition-opacity"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
