'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getDesksAndBookings(dateStr: string) {
  const startOfDay = new Date(`${dateStr}T00:00:00.000Z`)
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`)

  const desks = await prisma.desk.findMany({
    include: {
      bookings: {
        where: {
          startAt: { gte: startOfDay },
          endAt: { lte: endOfDay }
        },
        orderBy: {
          startAt: 'asc'
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  const sortedDesks = desks.sort((a, b) => {
    const numA = parseInt(a.name.replace(/\D/g, '')) || 0
    const numB = parseInt(b.name.replace(/\D/g, '')) || 0
    return numA - numB
  })

  return sortedDesks
}

export async function bookDesk(data: {
  deskId: string
  startAt: Date
  endAt: Date
  bookedBy: string
  ownerToken: string
  recurringWeeks?: number
  note?: string
}) {
  const { deskId, startAt, endAt, bookedBy, ownerToken, recurringWeeks, note } = data

  if (startAt >= endAt) {
    return { success: false, error: 'End time must be after start time' }
  }

  // Number of additional weeks to repeat. 0 = no repeat.
  const additionalWeeks = Math.min(Math.max(recurringWeeks || 0, 0), 12)
  const occurrences = additionalWeeks + 1
  const recurringGroupId = occurrences > 1 ? crypto.randomUUID() : null

  // Create an array of requested time slots
  const slots = []
  for (let i = 0; i < occurrences; i++) {
    const s = new Date(startAt.getTime())
    const e = new Date(endAt.getTime())
    s.setDate(s.getDate() + i * 7)
    e.setDate(e.getDate() + i * 7)
    slots.push({ startAt: s, endAt: e })
  }

  // Check ALL slots for overlap
  // We can do this efficiently using a Prisma OR condition
  const OR_conditions = slots.map(slot => ({
    startAt: { lt: slot.endAt },
    endAt: { gt: slot.startAt }
  }))

  const overlapping = await prisma.booking.findFirst({
    where: {
      deskId,
      OR: OR_conditions
    }
  })

  if (overlapping) {
    return { 
      success: false, 
      error: occurrences > 1 
        ? 'One or more of the recurring slots overlap with existing bookings. Entire sequence rejected.' 
        : 'This time slot overlaps with an existing booking.' 
    }
  }

  // If no overlaps, insert all
  const bookingsToCreate = slots.map(slot => ({
    deskId,
    startAt: slot.startAt,
    endAt: slot.endAt,
    bookedBy,
    ownerToken,
    recurringGroupId,
    note
  }))

  await prisma.booking.createMany({
    data: bookingsToCreate
  })

  revalidatePath('/')
  return { success: true }
}

export async function cancelBooking(id: string, ownerToken: string) {
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) {
    return { success: false, error: 'Booking not found' }
  }

  if (booking.ownerToken !== ownerToken) {
    return { success: false, error: 'Unauthorized to cancel this booking' }
  }

  await prisma.booking.delete({
    where: { id }
  })
  
  revalidatePath('/')
  return { success: true }
}
