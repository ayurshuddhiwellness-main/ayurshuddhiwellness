// DELETE /api/bookings/[id] — protected. Cancels a booking.
// Only the owner may cancel, only a confirmed booking, and only more than 24h
// before the appointment.

import { getDb } from '../../../../lib/firebase-admin'
import { requireAuth } from '../../../../lib/auth-middleware'
import { ok, fail, guard } from '../../../../lib/api-response'
import { sendCancellation } from '../../../../lib/email'

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

export async function DELETE(request, { params }) {
  return guard(async () => {
    const user = await requireAuth(request)
    const { id } = await params

    const db = getDb()
    const ref = db.collection('bookings').doc(id)
    const snap = await ref.get()
    if (!snap.exists) return fail(404, 'Booking not found')

    const booking = snap.data()
    if (booking.user_id !== user.uid) return fail(403, 'Not your booking')
    if (booking.status !== 'confirmed') {
      return fail(400, 'Only confirmed bookings can be cancelled')
    }

    // slot_datetime is clinic-local naive ISO; parse as local time.
    const slotMs = new Date(booking.slot_datetime).getTime()
    if (!Number.isFinite(slotMs)) return fail(400, 'Booking has an invalid slot time')
    if (slotMs - Date.now() <= TWENTY_FOUR_HOURS_MS) {
      return fail(400, 'Bookings can only be cancelled more than 24 hours in advance')
    }

    await ref.update({ status: 'cancelled' })

    try {
      await sendCancellation({
        to: booking.user_email,
        serviceName: booking.service_name,
        slotDatetime: booking.slot_datetime,
      })
    } catch (e) {
      console.error('[cancel] email failed:', e)
    }

    return ok({ success: true })
  })
}
