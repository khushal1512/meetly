export type Booking = {
  id: string
  deskId: string
  startAt: Date
  endAt: Date
  bookedBy: string
  ownerToken: string
  recurringGroupId: string | null
  note: string | null
}

export type Desk = {
  id: string
  name: string
  bookings: Booking[]
}
