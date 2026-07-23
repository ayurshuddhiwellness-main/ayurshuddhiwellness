// GET  /api/users/me — returns the user's profile, creating it on first read.
// PUT  /api/users/me — updates whitelisted profile fields (never email or role).

import { getDb, serverTimestamp } from '../../../../lib/firebase-admin'
import { requireAuth } from '../../../../lib/auth-middleware'
import { ok, fail, guard } from '../../../../lib/api-response'
import { validateProfileUpdate } from '../../../../lib/validation'

async function loadOrCreate(db, user) {
  const ref = db.collection('users').doc(user.uid)
  const snap = await ref.get()
  if (snap.exists) return { ref, data: { uid: user.uid, ...snap.data() } }

  const defaults = {
    name: null,
    email: user.email,
    phone: null,
    dob: null,
    gender: null,
    prakriti_type: null,
    role: 'user',
    created_at: serverTimestamp(),
  }
  await ref.set(defaults)
  return { ref, data: { uid: user.uid, ...defaults } }
}

export async function GET(request) {
  return guard(async () => {
    const user = await requireAuth(request)
    const { data } = await loadOrCreate(getDb(), user)
    return ok(data)
  })
}

export async function PUT(request) {
  return guard(async () => {
    const user = await requireAuth(request)
    const body = await request.json().catch(() => ({}))

    const { valid, errors, clean } = validateProfileUpdate(body)
    if (!valid) return fail(400, 'Validation failed', errors)
    if (Object.keys(clean).length === 0) {
      return fail(400, 'No updatable fields provided')
    }

    const db = getDb()
    await loadOrCreate(db, user) // ensure the doc exists
    const ref = db.collection('users').doc(user.uid)
    await ref.set(clean, { merge: true })

    const snap = await ref.get()
    return ok({ uid: user.uid, ...snap.data() })
  })
}
