// Pure input validation (no Firebase, fully unit-testable).

export const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say']

/* The /contact subject options. Declared once because the form renders them
   and the API rejects anything not in the list — as two copies they had to
   stay byte-identical or a perfectly ordinary submission would 400. */
export const CONTACT_SUBJECTS = [
  'General Inquiry',
  'Book a Consultation',
  'Therapy Question',
  'Feedback',
  'Other',
]

export const PRAKRITI_TYPES = [
  'vata',
  'pitta',
  'kapha',
  'vata-pitta',
  'pitta-kapha',
  'vata-kapha',
  'tridoshic',
]

export function isValidPhone(phone) {
  return typeof phone === 'string' && /^\d{10}$/.test(phone.trim())
}

// Deliberately permissive — one @, something either side, a dot in the domain.
// Anything stricter rejects valid addresses; delivery is the real test.
export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// Document ids received from clients (service_id, booking_id) before they are
// used in Firestore paths — blocks path separators and unbounded strings.
export function isValidDocId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(id)
}

// Valid calendar date, not in the future. Accepts "YYYY-MM-DD" only.
export function isValidDob(dob) {
  if (typeof dob !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return false
  const d = new Date(dob)
  if (Number.isNaN(d.getTime())) return false
  if (d.getFullYear() < 1900) return false
  // Compare against end of today so "today" is allowed.
  const now = new Date()
  return d.getTime() <= now.getTime()
}

export function isValidGender(gender) {
  return GENDERS.includes(gender)
}

export function isValidPrakriti(type) {
  return PRAKRITI_TYPES.includes(type)
}

// Validates a PUT /users/me body. Only whitelisted fields are considered;
// email and role are silently ignored (never updatable here).
// Returns { valid, errors: {field: msg}, clean: {onlyValidFields} }.
export function validateProfileUpdate(body = {}) {
  const errors = {}
  const clean = {}

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.name = 'Name must be a non-empty string'
    } else if (body.name.trim().length > 100) {
      errors.name = 'Name must be 100 characters or fewer'
    } else {
      clean.name = body.name.trim()
    }
  }

  if (body.phone !== undefined) {
    if (!isValidPhone(body.phone)) {
      errors.phone = 'Phone must be exactly 10 digits'
    } else {
      clean.phone = body.phone.trim()
    }
  }

  if (body.dob !== undefined) {
    if (!isValidDob(body.dob)) {
      errors.dob = 'DOB must be a valid date not in the future'
    } else {
      clean.dob = body.dob
    }
  }

  if (body.gender !== undefined) {
    if (!isValidGender(body.gender)) {
      errors.gender = `Gender must be one of: ${GENDERS.join(', ')}`
    } else {
      clean.gender = body.gender
    }
  }

  return { valid: Object.keys(errors).length === 0, errors, clean }
}
