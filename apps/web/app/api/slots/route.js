// GET /api/slots?service_id=X&date=YYYY-MM-DD — public.
// Returns the bookable start times for a service on a date.
//
// slot_datetime convention across the app: clinic-local naive ISO
// "YYYY-MM-DDTHH:MM:00" (no timezone suffix). So the date is chars 0-10 and the
// start time is chars 11-16.

import { getDb } from '../../../lib/firebase-admin'
import { ok, fail, guard } from '../../../lib/api-response'
import { computeAvailableSlots } from '../../../lib/slots'
import { isValidDocId } from '../../../lib/validation'
import { enforceRateLimit } from '../../../lib/rate-limit'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// Short edge cache: slightly stale availability is safe because POST
// /api/bookings re-validates the slot authoritatively before writing.
const CACHE = { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30' }

export async function GET(request) {
  return guard(async () => {
    enforceRateLimit(request, 'slots', 60)
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('service_id')
    const date = searchParams.get('date')

    if (!isValidDocId(serviceId) || !date || !DATE_RE.test(date)) {
      return fail(400, 'A valid service_id and date (YYYY-MM-DD) are required')
    }

    const db = getDb()

    // Availability doc for this date (0 or 1 expected).
    const availSnap = await db
      .collection('availability')
      .where('date', '==', date)
      .limit(1)
      .get()

    if (availSnap.empty) {
      return ok({ date, service_id: serviceId, available_slots: [] }, { headers: CACHE })
    }

    const avail = availSnap.docs[0].data()

    // Confirmed bookings for this service; filter to this date in memory and
    // derive their "HH:MM" start times.
    const bookingsSnap = await db
      .collection('bookings')
      .where('service_id', '==', serviceId)
      .where('status', '==', 'confirmed')
      .get()

    const bookedSlots = bookingsSnap.docs
      .map((d) => d.data().slot_datetime || '')
      .filter((dt) => dt.slice(0, 10) === date)
      .map((dt) => dt.slice(11, 16))

    const available = computeAvailableSlots({
      startTime: avail.start_time,
      endTime: avail.end_time,
      slotDurationMinutes: avail.slot_duration_minutes,
      blockedSlots: avail.blocked_slots || [],
      bookedSlots,
    })

    return ok({ date, service_id: serviceId, available_slots: available }, { headers: CACHE })
  })
}
