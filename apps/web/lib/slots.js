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
