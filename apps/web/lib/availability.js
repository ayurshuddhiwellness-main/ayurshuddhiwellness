// The one place that asks Firestore which slots a service still has open.
//
// /api/slots (what the browser is shown) and POST /api/bookings (what is
// actually enforced) previously each built this query by hand, and they have
// to agree — if the advertised list is wider than the enforced one, visitors
// are offered slots that then fail at checkout.

import { computeAvailableSlots, takenStartTimes } from './slots.js'

/* Bookings that may be holding a slot for this service.

   Status is filtered in the query; the date and the pending-hold window are
   applied in memory, which is what this code already did for dates (and keeps
   it off a composite index on slot_datetime).

   The `in` filter needs the same (service_id, status) composite index the two
   equality filters here needed before it, so this adds no new index. */
export function holdingBookingsQuery(db, serviceId) {
  return db
    .collection('bookings')
    .where('service_id', '==', serviceId)
    .where('status', 'in', ['confirmed', 'pending'])
}

// Firestore snapshot -> the plain record takenStartTimes expects.
export function toHold(doc) {
  const data = doc.data()
  return {
    status: data.status,
    slot_datetime: data.slot_datetime || '',
    created_at_ms: timestampToMs(data.created_at),
  }
}

// created_at is a Firestore Timestamp on read and a sentinel on write.
// Anything unreadable yields NaN, which takenStartTimes treats as "still held".
function timestampToMs(value) {
  if (value && typeof value.toMillis === 'function') return value.toMillis()
  if (value instanceof Date) return value.getTime()
  return NaN
}

// The start times still open for `date`, given that date's availability doc
// and the service's holding bookings.
export function openStartTimes(availability, holds, date, now = Date.now()) {
  return computeAvailableSlots({
    startTime: availability.start_time,
    endTime: availability.end_time,
    slotDurationMinutes: availability.slot_duration_minutes,
    blockedSlots: availability.blocked_slots || [],
    bookedSlots: takenStartTimes(holds, date, now),
  })
}
