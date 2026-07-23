// Auth middleware helper.
//
// Extracts `Authorization: Bearer <token>`, verifies the Firebase ID token with
// the Admin SDK, and returns { uid, email, role }. Throws a 401 Response on any
// missing/invalid token — routes catch that via guard() and return it verbatim.
//
// `role` comes from a custom claim on the token (set admin users via
// admin.auth().setCustomUserClaims(uid, { role: 'admin' })). Defaults to 'user'.

import { getAuth } from './firebase-admin'

function unauthorized(message) {
  return Response.json(
    { success: false, data: null, error: message },
    { status: 401 },
  )
}

export async function requireAuth(request) {
  const header =
    request.headers.get('authorization') || request.headers.get('Authorization')

  if (!header || !header.startsWith('Bearer ')) {
    throw unauthorized('Missing or malformed Authorization header')
  }

  const token = header.slice('Bearer '.length).trim()
  if (!token) {
    throw unauthorized('Missing bearer token')
  }

  let decoded
  try {
    decoded = await getAuth().verifyIdToken(token)
  } catch {
    throw unauthorized('Invalid or expired token')
  }

  return {
    uid: decoded.uid,
    email: decoded.email || null,
    role: decoded.role || 'user',
  }
}
