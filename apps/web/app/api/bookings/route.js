// POST /api/bookings — protected. Creates a pending booking + payment order.
//
// The slot is re-validated against Firestore here; the client's claim that a slot
// is free is never trusted.

import { getDb, serverTimestamp } from '../../../lib/firebase-admin'
import { requireAuth } from '../../../lib/auth-middleware'
import { created, fail, guard } from '../../../lib/api-response'
import { computeAvailableSlots } from '../../../lib/slots'
import { createOrder, getPublicKeyId } from '../../../lib/payments'

const SLOT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00$/

export async function POST(request) {
  return guard(async () => {
    const user = await requireAuth(request)
    const body = await request.json().catch(() => ({}))
    const { service_id, slot_datetime, notes = '' } = body

    if (!service_id || !slot_datetime || !SLOT_RE.test(slot_datetime)) {
      return fail(400, 'service_id and slot_datetime (YYYY-MM-DDTHH:MM:00) are required')
    }

    const db = getDb()

    // Service must exist and be active.
    const serviceSnap = await db.collection('services').doc(service_id).get()
    if (!serviceSnap.exists) return fail(404, 'Service not found')
    const service = serviceSnap.data()
    if (service.active === false) return fail(400, 'Service is not available')

    const date = slot_datetime.slice(0, 10)
    const time = slot_datetime.slice(11, 16)

    // Re-check availability for that date.
    const availSnap = await db
      .collection('availability')
      .where('date', '==', date)
      .limit(1)
      .get()
    if (availSnap.empty) return fail(409, 'No availability for that date')
    const avail = availSnap.docs[0].data()

    const bookingsSnap = await db
      .collection('bookings')
      .where('service_id', '==', service_id)
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

    if (!available.includes(time)) {
      return fail(409, 'That slot is no longer available')
    }

    // Payment order (real Razorpay or dummy, depending on env).
    const order = await createOrder({
      amount: service.price,
      currency: 'INR',
      receipt: `svc_${service_id}_${Date.now()}`,
      notes: { service_id, uid: user.uid },
    })

    // Fetch user's display name if we have a profile doc.
    const userSnap = await db.collection('users').doc(user.uid).get()
    const userName = (userSnap.exists && userSnap.data().name) || user.email || 'Guest'

    const bookingRef = db.collection('bookings').doc()
    await bookingRef.set({
      user_id: user.uid,
      user_name: userName,
      user_email: user.email,
      service_id,
      service_name: service.name,
      slot_datetime,
      status: 'pending',
      razorpay_order_id: order.id,
      razorpay_payment_id: null,
      notes: String(notes || ''),
      created_at: serverTimestamp(),
    })

    return created({
      booking_id: bookingRef.id,
      razorpay_order_id: order.id,
      amount: service.price,
      currency: 'INR',
      key_id: getPublicKeyId(),
    })
  })
}
