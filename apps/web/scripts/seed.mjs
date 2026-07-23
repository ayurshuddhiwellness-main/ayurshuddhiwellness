// Seed Firestore with sample services + tomorrow's availability.
//
// Requires FIREBASE_SERVICE_ACCOUNT_KEY (or GOOGLE_APPLICATION_CREDENTIALS) in
// the environment. Run from apps/web:
//     node scripts/seed.mjs
// Idempotent: uses fixed document ids, so re-running overwrites cleanly.

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const admin = require('firebase-admin')

function initAdmin() {
  if (admin.apps.length) return
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (raw) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(raw)) })
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() })
  } else {
    console.error(
      'No credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS.',
    )
    process.exit(1)
  }
}

function tomorrowISODate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

const SERVICES = [
  {
    id: 'ayurvedic-consultation',
    name: 'Ayurvedic Consultation',
    description:
      'A one-on-one consultation with our practitioner to assess your constitution and craft a personalised wellness plan.',
    duration: 60,
    price: 80000, // ₹800 in paise
    category: 'consultation',
    active: true,
    imageUrl: '',
  },
  {
    id: 'panchakarma-session',
    name: 'Panchakarma Session',
    description:
      'A deep detoxification and rejuvenation therapy following classical Panchakarma protocols.',
    duration: 90,
    price: 150000, // ₹1500 in paise
    category: 'therapy',
    active: true,
    imageUrl: '',
  },
  {
    id: 'yoga-pranayama',
    name: 'Yoga & Pranayama',
    description:
      'A guided session of postures and breathwork to restore balance, focus and calm.',
    duration: 45,
    price: 50000, // ₹500 in paise
    category: 'movement',
    active: true,
    imageUrl: '',
  },
]

async function main() {
  initAdmin()
  const db = admin.firestore()

  const batch = db.batch()
  for (const svc of SERVICES) {
    const { id, ...data } = svc
    batch.set(db.collection('services').doc(id), data)
  }

  const date = tomorrowISODate()
  batch.set(db.collection('availability').doc(`avail_${date}`), {
    date,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 60,
    blocked_slots: [],
  })

  await batch.commit()
  console.log(`Seeded ${SERVICES.length} services and availability for ${date}.`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
