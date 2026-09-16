// POST /api/bookings — protected. Creates a pending booking + payment order.
//
// The slot is re-validated against Firestore here; the client's claim that a
// slot is free is never trusted.
//
// That re-check and the write that claims the slot run inside ONE transaction.
// As two separate steps they were not actually exclusive: two concurrent
// requests both read the slot as free and both claimed it. The pending booking
// this writes also holds the slot for a while (see lib/slots.js), because
// availability used to count confirmed bookings only — so a slot stayed on
// offer for the whole length of someone else's checkout.

import { getDb, serverTimestamp } from '../../../lib/firebase-admin'
import { requireAuth } from '../../../lib/auth-middleware'
import { created, fail, guard } from '../../../lib/api-response'
import { holdingBookingsQuery, openStartTimes, toHold } from '../../../lib/availability'
import { createOrder, getPublicKeyId } from '../../../lib/payments'
import { isValidDocId } from '../../../lib/validation'
import { enforceRateLimit } from '../../../lib/rate-limit'

const SLOT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00$/

export async function POST(request) {
  return guard(async () => {
    enforceRateLimit(request, 'bookings', 10)
    const user = await requireAuth(request)
    const body = await request.json().catch(() => ({}))
    const { service_id, slot_datetime, notes = '' } = body

    if (!isValidDocId(service_id) || !slot_datetime || !SLOT_RE.test(slot_datetime)) {
      return fail(400, 'A valid service_id and slot_datetime (YYYY-MM-DDTHH:MM:00) are required')
    }
    if (String(notes || '').length > 500) {
      return fail(400, 'notes must be 500 characters or fewer')
    }

    const db = getDb()

    const date = slot_datetime.slice(0, 10)
    const time = slot_datetime.slice(11, 16)

    /* The service and the user are not part of what makes the reservation
       exclusive, so they are read up front and kept out of the transaction —
       a transaction re-runs on contention, and these two reads would re-run
       with it for nothing. */
    const [serviceSnap, userSnap] = await Promise.all([
      db.collection('services').doc(service_id).get(),
      db.collection('users').doc(user.uid).get(),
    ])

    // Service must exist and be active.
    if (!serviceSnap.exists) return fail(404, 'Service not found')
    const service = serviceSnap.data()
    if (service.active === false) return fail(400, 'Service is not available')

    // User's display name if we have a profile doc (fetched above).
    const userName = (userSnap.exists && userSnap.data().name) || user.email || 'Guest'

    const bookingRef = db.collection('bookings').doc()

    /* Claim the slot. Everything the decision rests on is read inside the
       transaction, so a concurrent booking on the same slot forces a retry and
       the loser sees the slot already taken.

       Refusals are returned rather than thrown: a thrown value would abort the
       transaction as an error and be retried, and "that slot is taken" is an
       answer, not a failure. */
    const reservation = await db.runTransaction(async (tx) => {
      const availSnap = await tx.get(
        db.collection('availability').where('date', '==', date).limit(1),
      )
      if (availSnap.empty) return { error: [409, 'No availability for that date'] }

      const holdsSnap = await tx.get(holdingBookingsQuery(db, service_id))
      const open = openStartTimes(availSnap.docs[0].data(), holdsSnap.docs.map(toHold), date)

      if (!open.includes(time)) {
        return { error: [409, 'That slot is no longer available'] }
      }

      tx.set(bookingRef, {
        user_id: user.uid,
        user_name: userName,
        user_email: user.email,
        service_id,
        service_name: service.name,
        slot_datetime,
        status: 'pending',
        // Filled in below, once the order actually exists.
        razorpay_order_id: null,
        razorpay_payment_id: null,
        notes: String(notes || ''),
        created_at: serverTimestamp(),
      })

      return { ok: true }
    })

    if (reservation.error) return fail(...reservation.error)

    /* The payment order is created only now, with the slot already held, and
       deliberately outside the transaction: it is an external side effect and
       a transaction body can run more than once. If this throws, guard() turns
       it into a 500 and the pending booking simply expires its hold. */
    const order = await createOrder({
      amount: service.price,
      currency: 'INR',
      receipt: `svc_${service_id}_${Date.now()}`,
      notes: { service_id, uid: user.uid },
    })

    await bookingRef.update({ razorpay_order_id: order.id })

    return created({
      booking_id: bookingRef.id,
      razorpay_order_id: order.id,
      amount: service.price,
      currency: 'INR',
      key_id: getPublicKeyId(),
    })
  })
}
