// POST /api/bookings/verify-payment — protected.
// Verifies the payment signature and, only if valid, confirms the booking and
// emails the user. An invalid signature returns 400 and never mutates the booking.

import { getDb } from '../../../../lib/firebase-admin'
import { requireAuth } from '../../../../lib/auth-middleware'
import { ok, fail, guard } from '../../../../lib/api-response'
import { verifyPayment } from '../../../../lib/payments'
import { sendBookingConfirmation } from '../../../../lib/email'

export async function POST(request) {
  return guard(async () => {
    const user = await requireAuth(request)
    const body = await request.json().catch(() => ({}))
    const { booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!booking_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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

    await ref.update({
      status: 'confirmed',
      razorpay_payment_id,
    })

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
