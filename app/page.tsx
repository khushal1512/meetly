'use client'

import { useState, useEffect } from 'react'
import { format, startOfDay, addHours } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { getDesksAndBookings, bookDesk, cancelBooking } from './actions'
import type { Desk } from '../types'

import { CalendarSidebar } from '../components/CalendarSidebar'
import { DeskGrid } from '../components/DeskGrid'
import { BookingModal } from '../components/BookingModal'
import { CancelConfirmationModal } from '../components/CancelConfirmationModal'

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [desks, setDesks] = useState<Desk[]>([])
  const [loading, setLoading] = useState(true)
  const [ownerToken, setOwnerToken] = useState<string | null>(null)

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null)
  const [selectedStart, setSelectedStart] = useState<Date | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)
  const [bookingError, setBookingError] = useState('')

  // Cancel Modal State
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

  // Initialize identity token
  useEffect(() => {
    let token = localStorage.getItem('meetly_owner_token')
    if (!token) {
      token = uuidv4()
      localStorage.setItem('meetly_owner_token', token)
    }
    setOwnerToken(token)
  }, [])

  const fetchDesks = async () => {
    setLoading(true)
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    try {
      const data = await getDesksAndBookings(dateStr)
      // Since Server Actions serialize dates as strings, we parse them back to Date objects if needed, 
      // but standard Prisma output handles them fine in Server Components. 
      // However, to be safe, if they come back as strings, we parse them.
      // Wait, next.js server actions handle Dates correctly in recent versions.
      setDesks(data as unknown as Desk[])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDesks()
  }, [currentDate])

  const handleSlotClick = (desk: Desk, hour: number) => {
    const start = addHours(startOfDay(currentDate), hour)
    const end = addHours(startOfDay(currentDate), hour + 1)

    setSelectedDesk(desk)
    setSelectedStart(start)
    setSelectedEnd(end)
    setBookingError('')
    setIsBookingModalOpen(true)
  }

  const handleBookConfirm = async (bookedBy: string, recurringWeeks: number, note: string) => {
    if (!selectedDesk || !selectedStart || !selectedEnd || !ownerToken) return

    setBookingError('')
    const res = await bookDesk({
      deskId: selectedDesk.id,
      startAt: selectedStart,
      endAt: selectedEnd,
      bookedBy,
      ownerToken,
      recurringWeeks,
      note: note.trim() || undefined
    })

    if (!res.success) {
      setBookingError(res.error || 'Failed to book desk')
      return
    }

    setIsBookingModalOpen(false)
    fetchDesks()
  }

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId)
  }

  const handleCancelConfirm = async () => {
    if (!bookingToCancel || !ownerToken) return

    const res = await cancelBooking(bookingToCancel, ownerToken)
    if (!res.success) {
      alert(res.error || 'Failed to cancel')
    }
    setBookingToCancel(null)
    fetchDesks()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#FE4D00]">Meetly</h1>
            <p className="text-gray-500 mt-1">Office Desk & Room Booking</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <CalendarSidebar
            selectedDate={currentDate}
            onDateSelect={setCurrentDate}
          />

          <div className="flex-1 w-full">
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-[10px] border border-gray-200">
                <div className="text-gray-500 animate-pulse font-medium">Loading availability...</div>
              </div>
            ) : (
              <DeskGrid
                desks={desks}
                currentDate={currentDate}
                ownerToken={ownerToken}
                onSlotClick={handleSlotClick}
                onCancelClick={handleCancelClick}
              />
            )}
          </div>
        </div>
      </div>

      {isBookingModalOpen && selectedDesk && selectedStart && selectedEnd && (
        <BookingModal
          desk={selectedDesk}
          startAt={selectedStart}
          endAt={selectedEnd}
          error={bookingError}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookConfirm}
        />
      )}

      {bookingToCancel && (
        <CancelConfirmationModal
          onClose={() => setBookingToCancel(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  )
}
