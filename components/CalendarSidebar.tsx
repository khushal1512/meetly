'use client'

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function CalendarSidebar({ selectedDate, onDateSelect }: CalendarSidebarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-[10px] p-4 shadow-sm h-fit sticky top-8">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Select Date</h2>
      <DayPicker 
        mode="single" 
        selected={selectedDate} 
        onSelect={(date) => date && onDateSelect(date)}
        modifiersClassNames={{
          selected: 'bg-[#FE4D00] text-white hover:bg-[#E64600]',
          today: 'font-bold text-[#FE4D00]'
        }}
        className="mx-auto"
      />
      <div className="mt-4 text-center text-sm font-medium text-gray-500">
        Showing schedule for:
        <div className="text-gray-900 mt-1">{format(selectedDate, 'EEEE, MMMM do yyyy')}</div>
      </div>
    </div>
  )
}
