// The clinic's wall clock.
//
// slot_datetime is stored across the app as clinic-local NAIVE ISO —
// "YYYY-MM-DDTHH:MM:00" with no zone designator (the convention is spelled out
// in app/api/slots/route.js). JavaScript resolves a naive datetime in the
// runtime's OWN zone, which is UTC on Cloud Run and Vercel. So `new Date(...)`
// read a 09:00 clinic appointment as 09:00 UTC — 5.5 hours later than the
// instant it actually names. That skew reached two places: the 24-hour
// cancellation guard (which let bookings be cancelled ~19.5 real hours out)
// and the confirmation emails (which printed 3:30 pm for a 10:00 am booking).
//
// Asia/Kolkata is UTC+05:30 all year and has never observed DST, so a fixed
// offset is exact here — no zone database needed. If the clinic ever operates
// somewhere with DST, this has to become a real zone conversion instead.

export const CLINIC_TIME_ZONE = 'Asia/Kolkata'
export const CLINIC_UTC_OFFSET = '+05:30'

// "YYYY-MM-DDTHH:MM:SS" with no trailing Z or ±HH:MM.
const NAIVE_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/

// Epoch milliseconds for a stored slot_datetime, or NaN if it is unparseable.
// A value that already carries a zone is an absolute instant and is trusted as
// given, so this is safe to apply to older or externally-written records too.
export function clinicSlotToMs(slotDatetime) {
  if (typeof slotDatetime !== 'string') return NaN
  const value = slotDatetime.trim()
  if (!value) return NaN
  if (NAIVE_ISO.test(value)) {
    return new Date(`${value}${CLINIC_UTC_OFFSET}`).getTime()
  }
  return new Date(value).getTime()
}

// A stored slot_datetime rendered for a human, in clinic time.
// Returns the input unchanged if it cannot be parsed, so a malformed record
// degrades to showing the raw value rather than "Invalid Date".
export function formatClinicDateTime(slotDatetime) {
  const ms = clinicSlotToMs(slotDatetime)
  if (!Number.isFinite(ms)) return slotDatetime
  return new Date(ms).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: CLINIC_TIME_ZONE,
  })
}
