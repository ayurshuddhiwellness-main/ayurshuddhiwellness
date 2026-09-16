// Pure slot-generation logic (no Firebase, fully unit-testable).
//
// Times are "HH:MM" 24h strings. A slot is a *start* time; a slot is valid only
// if the whole appointment (start + slot_duration) fits within end_time.

export function timeToMinutes(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// All possible start times between start_time and end_time at the given interval.
export function generateSlots(startTime, endTime, slotDurationMinutes) {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  const step = Number(slotDurationMinutes)

  if (!Number.isFinite(start) || !Number.isFinite(end) || !step || step <= 0) {
    return []
  }

  const slots = []
  for (let t = start; t + step <= end; t += step) {
    slots.push(minutesToTime(t))
  }
  return slots
}

// Full pipeline: generate, then remove blocked + already-booked start times.
export function computeAvailableSlots({
  startTime,
  endTime,
  slotDurationMinutes,
  blockedSlots = [],
  bookedSlots = [],
}) {
  const taken = new Set([...blockedSlots, ...bookedSlots])
  return generateSlots(startTime, endTime, slotDurationMinutes).filter(
    (s) => !taken.has(s),
  )
}

/* How long an unpaid booking keeps its slot.
   Long enough to finish a checkout, short enough that an abandoned payment
   hands the slot back rather than stranding it. */
export const PENDING_HOLD_MS = 15 * 60 * 1000

/* Which start times on `date` are already spoken for.

   A confirmed booking holds its slot permanently. A PENDING one holds it for
   PENDING_HOLD_MS — and that is the part that was missing: availability used
   to count only confirmed bookings, so a pending booking left its slot
   advertised as free and two people could each open one on the same slot and
   both go on to confirm it.

   Takes plain records, not Firestore snapshots, so it stays pure: each is
   { status, slot_datetime, created_at_ms }. */
export function takenStartTimes(bookings, date, now = Date.now()) {
  const taken = []

  for (const booking of bookings) {
    const slot = String(booking?.slot_datetime || '')
    if (slot.slice(0, 10) !== date) continue

    if (booking.status === 'confirmed') {
      taken.push(slot.slice(11, 16))
      continue
    }
    if (booking.status !== 'pending') continue

    /* A pending booking whose timestamp is unreadable is treated as still
       holding. Every booking this app writes sets created_at, so that only
       catches malformed records — and for those, holding a slot is the safer
       error than handing out a double booking. */
    const createdAt = Number.isFinite(booking.created_at_ms) ? booking.created_at_ms : now
    if (now - createdAt < PENDING_HOLD_MS) taken.push(slot.slice(11, 16))
  }

  return taken
}
