// POST /api/bookings/verify-payment — protected.
// Verifies the payment signature and, only if valid, confirms the booking and
// emails the user. An invalid signature returns 400 and never mutates the booking.
//
// The confirmation itself runs in a transaction that re-checks the slot. The
// pending booking holds its slot only for a window (lib/slots.js), so a
// checkout slow enough to outlive that hold can arrive here to find the slot
// gone — confirming it regardless would double-book the clinic.

import { getDb } from '../../../../lib/firebase-admin'
import { requireAuth } from '../../../../lib/auth-middleware'
import { ok, fail, guard } from '../../../../lib/api-response'
import { verifyPayment } from '../../../../lib/payments'
import { sendBookingConfirmation } from '../../../../lib/email'
import { isValidDocId } from '../../../../lib/validation'
import { enforceRateLimit } from '../../../../lib/rate-limit'
import { holdingBookingsQuery, openStartTimes, toHold } from '../../../../lib/availability'

export async function POST(request) {
  return guard(async () => {
    enforceRateLimit(request, 'verify-payment', 10)
    const user = await requireAuth(request)
    const body = await request.json().catch(() => ({}))
    const { booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!isValidDocId(booking_id) || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return fail(400, 'booking_id, razorpay_order_id, razorpay_payment_id and razorpay_signature are required')
    }

    const db = getDb()
    const ref = db.collection('bookings').doc(booking_id)
    const snap = await ref.get()
    if (!snap.exists) return fail(404, 'Booking not found')

    const booking = snap.data()
    if (booking.user_id !== user.uid) return fail(403, 'Not your booking')
    if (booking.razorpay_order_id !== razorpay_order_id) {
      return fail(400, 'Order id mismatch')
    }

    const valid = verifyPayment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })
    if (!valid) {
      return fail(400, 'Payment signature verification failed')
    }

    /* Signature is good — now take the slot for real. Re-read inside the
       transaction rather than trusting the snapshot above, which is already
       stale by the time the signature has been checked. */
    const confirmation = await db.runTransaction(async (tx) => {
      const fresh = await tx.get(ref)
      if (!fresh.exists) return { error: [404, 'Booking not found'] }
      const current = fresh.data()

      /* Already confirmed is success, not an error — clients and payment
         callbacks both retry, and a retry must not 4xx a paid booking. */
      if (current.status === 'confirmed') return { ok: true }
      if (current.status !== 'pending') {
        return { error: [409, 'This booking can no longer be confirmed'] }
      }

      const slot = String(current.slot_datetime || '')
      const date = slot.slice(0, 10)
      const time = slot.slice(11, 16)

      const availSnap = await tx.get(
        db.collection('availability').where('date', '==', date).limit(1),
      )
      if (availSnap.empty) {
        return { error: [409, 'That date is no longer available'] }
      }

      /* Everyone else holding a slot on this service. This booking is excluded
         so its own pending hold does not read as the slot being taken. */
      const holdsSnap = await tx.get(holdingBookingsQuery(db, current.service_id))
      const others = holdsSnap.docs.filter((d) => d.id !== ref.id).map(toHold)

      if (!openStartTimes(availSnap.docs[0].data(), others, date).includes(time)) {
        return { error: [409, 'That slot was taken while this payment was pending'] }
      }

      tx.update(ref, { status: 'confirmed', razorpay_payment_id })
      return { ok: true }
    })

    if (confirmation.error) return fail(...confirmation.error)

    // Best-effort email; never fail the request on email trouble.
    try {
      await sendBookingConfirmation({
        to: booking.user_email,
        serviceName: booking.service_name,
        slotDatetime: booking.slot_datetime,
        note: booking.notes,
      })
    } catch (e) {
      console.error('[verify-payment] email failed:', e)
    }

    return ok({ booking_id, success: true })
  })
}
