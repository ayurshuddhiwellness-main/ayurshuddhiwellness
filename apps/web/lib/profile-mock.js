/* ──────────────────────────────────────────────────────────────────────────
   Placeholder profile data.

   Firebase Auth and Firestore are not wired yet, so /profile renders from
   here. Field names mirror the `users/{uid}` schema in DESIGN_SYSTEM_3.md
   (name, email, phone, dob, gender, prakriti_type, role, created_at) so
   swapping in a real document is a straight substitution.
   ────────────────────────────────────────────────────────────────────────── */

export const PROFILE = {
  name: 'Priya Sharma',
  email: 'priya.sharma@gmail.com',
  phone: '+91 98765 43210',
  dob: '15 March 1992',
  gender: 'Female',
  prakriti_type: 'Vata-Pitta',
  role: 'user',
}

// Ordered as they should read, largest share first.
export const PRAKRITI = {
  type: 'Vata-Pitta',
  summary:
    'Movement and fire, held together. You think and act quickly, digest strongly, and run warm — which serves you well until either quality runs unchecked.',
  doshas: [
    { name: 'Vata', value: 45 },
    { name: 'Pitta', value: 35 },
    { name: 'Kapha', value: 20 },
  ],
}

export const BOOKINGS = [
  {
    id: 'bk_01',
    service: 'Panchakarma Detox Therapy',
    date: '15 Aug 2026',
    time: '10:00 AM',
    status: 'confirmed',
  },
  {
    id: 'bk_02',
    service: 'Ayurvedic Consultation',
    date: '02 Aug 2026',
    time: '2:30 PM',
    status: 'completed',
  },
  {
    id: 'bk_03',
    service: 'Abhyanga Massage',
    date: '20 Jul 2026',
    time: '11:00 AM',
    status: 'cancelled',
  },
]

// "Priya Sharma" → "PS". Falls back gracefully on a single-word name.
export const initialsOf = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
