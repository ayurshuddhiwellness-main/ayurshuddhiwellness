// Pure input validation (no Firebase, fully unit-testable).

export const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say']

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

// Valid calendar date, not in the future. Accepts "YYYY-MM-DD".
export function isValidDob(dob) {
  if (typeof dob !== 'string') return false
  const d = new Date(dob)
  if (Number.isNaN(d.getTime())) return false
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
