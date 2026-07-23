// POST /api/users/me/prakriti — protected. Records the user's dosha type.

import { getDb, serverTimestamp } from '../../../../../lib/firebase-admin'
import { requireAuth } from '../../../../../lib/auth-middleware'
import { ok, fail, guard } from '../../../../../lib/api-response'
import { isValidPrakriti, PRAKRITI_TYPES } from '../../../../../lib/validation'

export async function POST(request) {
  return guard(async () => {
    const user = await requireAuth(request)
    const body = await request.json().catch(() => ({}))
    const { prakriti_type } = body

    if (!isValidPrakriti(prakriti_type)) {
      return fail(400, `prakriti_type must be one of: ${PRAKRITI_TYPES.join(', ')}`)
    }

    const db = getDb()
    const ref = db.collection('users').doc(user.uid)
    const snap = await ref.get()
    if (!snap.exists) {
      await ref.set({
        name: null,
        email: user.email,
        phone: null,
        dob: null,
        gender: null,
        prakriti_type,
        role: 'user',
        created_at: serverTimestamp(),
      })
    } else {
      await ref.set({ prakriti_type }, { merge: true })
    }

    const updated = await ref.get()
    return ok({ uid: user.uid, ...updated.data() })
  })
}
