// Firebase Admin SDK initialisation (server-side only).
//
// Init is lazy: firebase-admin is only require()'d the first time getDb()/getAuth()
// actually needs it. This means:
//   - importing this module never crashes when env vars are missing
//   - test harnesses can inject a fake Firestore/Auth via globalThis and never
//     touch the real SDK (see the test seam below)
//
// Credentials are read from env, in this order of preference:
//   1. FIREBASE_SERVICE_ACCOUNT_KEY  -> full service-account JSON as a string
//   2. GOOGLE_APPLICATION_CREDENTIALS -> path to a service-account file (ADC)
// Never hardcode credentials.

import { createRequire } from 'module'

const require = createRequire(import.meta.url)

let _cache = null

function _resolveCredential(admin) {
  // 1) Full service-account JSON in one env var.
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (raw) {
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY is set but is not valid JSON. Paste the entire service-account file as a single-line JSON string.',
      )
    }
    return admin.credential.cert(parsed)
  }

  // 2) Separate fields. PRIVATE_KEY often arrives with literal "\n" — unescape.
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (projectId && clientEmail && privateKey) {
    return admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    })
  }

  // 3) Application Default Credentials via a file path.
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.credential.applicationDefault()
  }

  throw new Error(
    'No Firebase Admin credentials found. In apps/web/.env.local set FIREBASE_SERVICE_ACCOUNT_KEY ' +
      '(the full service-account JSON as a string), or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + ' +
      'FIREBASE_PRIVATE_KEY, or GOOGLE_APPLICATION_CREDENTIALS (path to the JSON file). Then restart the dev server.',
  )
}

function _init() {
  if (_cache) return _cache

  let admin
  try {
    admin = require('firebase-admin')
  } catch {
    throw new Error(
      "Package 'firebase-admin' is not installed. Run `npm install` in the repo root (it is listed in apps/web/package.json), then restart the dev server.",
    )
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: _resolveCredential(admin) })
  }

  _cache = {
    admin,
    db: admin.firestore(),
    auth: admin.auth(),
    FieldValue: admin.firestore.FieldValue,
  }
  return _cache
}

// --- Test seam -------------------------------------------------------------
// If a test sets globalThis.__FIRESTORE__ / globalThis.__AUTH__, we use those
// and never load the real SDK. Guarded so it is inert in production.
function _fakeDb() {
  return typeof globalThis !== 'undefined' ? globalThis.__FIRESTORE__ : undefined
}
function _fakeAuth() {
  return typeof globalThis !== 'undefined' ? globalThis.__AUTH__ : undefined
}

export function getDb() {
  return _fakeDb() || _init().db
}

export function getAuth() {
  return _fakeAuth() || _init().auth
}

// serverTimestamp() resolves to a real Firestore sentinel in production, or the
// fake's sentinel under test.
export function serverTimestamp() {
  const fake = _fakeDb()
  if (fake && fake.FieldValue && fake.FieldValue.serverTimestamp) {
    return fake.FieldValue.serverTimestamp()
  }
  return _init().FieldValue.serverTimestamp()
}
