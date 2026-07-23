// GET /api/services — public. Returns all active services.
// Cached at the edge for 5 minutes since services rarely change.

import { getDb } from '../../../lib/firebase-admin'
import { ok, guard } from '../../../lib/api-response'

export async function GET() {
  return guard(async () => {
    const snap = await getDb()
      .collection('services')
      .where('active', '==', true)
      .get()

    const services = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

    return ok(services, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    })
  })
}
