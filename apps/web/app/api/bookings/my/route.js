// GET /api/bookings/my — protected. All bookings for the current user,
// newest appointment first. service_name is stored on each booking at creation,
// but we re-join from services as a fallback for older/renamed records.

import { getDb } from '../../../../lib/firebase-admin'
import { requireAuth } from '../../../../lib/auth-middleware'
import { ok, guard } from '../../../../lib/api-response'

export async function GET(request) {
  return guard(async () => {
    const user = await requireAuth(request)
    const db = getDb()

    const snap = await db
      .collection('bookings')
      .where('user_id', '==', user.uid)
      .get()

    const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

    // Fallback join for any booking missing a service_name.
    const missing = [...new Set(
      bookings.filter((b) => !b.service_name && b.service_id).map((b) => b.service_id),
    )]
    if (missing.length) {
      const names = {}
      await Promise.all(
        missing.map(async (sid) => {
          const s = await db.collection('services').doc(sid).get()
          if (s.exists) names[sid] = s.data().name
        }),
      )
      bookings.forEach((b) => {
        if (!b.service_name && names[b.service_id]) b.service_name = names[b.service_id]
      })
    }

    // Sort by slot_datetime descending (in memory — avoids a composite index).
    bookings.sort((a, b) => String(b.slot_datetime).localeCompare(String(a.slot_datetime)))

    return ok(bookings)
  })
}
