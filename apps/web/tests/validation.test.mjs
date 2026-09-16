import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import {
  isValidPhone,
  isValidEmail,
  isValidDocId,
  isValidDob,
  isValidGender,
  isValidPrakriti,
  validateProfileUpdate,
  CONTACT_SUBJECTS,
  GENDERS,
  PRAKRITI_TYPES,
} from '../lib/validation.js'

describe('isValidDocId', () => {
  /* This one guards Firestore paths built from client input, so the cases that
     matter are the ones that would escape a document into another collection. */
  test('accepts ordinary ids', () => {
    assert.ok(isValidDocId('abc123'))
    assert.ok(isValidDocId('ayurvedic-consultation'))
    assert.ok(isValidDocId('a_b-C9'))
  })

  test('rejects path separators and traversal', () => {
    for (const bad of ['a/b', '../secrets', 'a\\b', 'a b', '', 'a.b']) {
      assert.equal(isValidDocId(bad), false, `should reject ${JSON.stringify(bad)}`)
    }
  })

  test('rejects unbounded input', () => {
    assert.ok(isValidDocId('x'.repeat(128)))
    assert.equal(isValidDocId('x'.repeat(129)), false)
  })

  test('rejects non-strings', () => {
    for (const bad of [null, undefined, 42, {}, []]) assert.equal(isValidDocId(bad), false)
  })
})

describe('isValidEmail', () => {
  test('accepts real-shaped addresses', () => {
    assert.ok(isValidEmail('a@b.co'))
    assert.ok(isValidEmail('first.last+tag@sub.example.in'))
    assert.ok(isValidEmail('  padded@example.com  '))
  })

  test('rejects the obvious failures', () => {
    for (const bad of ['', 'a@b', 'no-at-sign.com', 'a b@c.com', '@b.com', 'a@.com', null]) {
      assert.equal(isValidEmail(bad), false, `should reject ${JSON.stringify(bad)}`)
    }
  })
})

describe('isValidPhone', () => {
  test('requires exactly ten digits', () => {
    assert.ok(isValidPhone('9876543210'))
    assert.ok(isValidPhone(' 9876543210 '))
    for (const bad of ['98765', '98765432101', '98765-43210', '+919876543210', 'abcdefghij']) {
      assert.equal(isValidPhone(bad), false, `should reject ${bad}`)
    }
  })
})

describe('isValidDob', () => {
  test('accepts a plausible past date', () => {
    assert.ok(isValidDob('1992-03-15'))
  })

  test('rejects the future', () => {
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    assert.equal(isValidDob(nextYear.toISOString().slice(0, 10)), false)
  })

  test('rejects wrong formats and impossible years', () => {
    for (const bad of ['15-03-1992', '1992/03/15', '1899-01-01', 'not-a-date', '']) {
      assert.equal(isValidDob(bad), false, `should reject ${bad}`)
    }
  })
})

describe('enumerations', () => {
  test('gender and prakriti accept only listed values', () => {
    for (const g of GENDERS) assert.ok(isValidGender(g))
    assert.equal(isValidGender('Male'), false) // case matters
    assert.equal(isValidGender('unlisted'), false)

    for (const p of PRAKRITI_TYPES) assert.ok(isValidPrakriti(p))
    assert.equal(isValidPrakriti('vata-tridoshic'), false)
  })

  test('the contact subjects the form renders are the ones the API accepts', () => {
    // Regression for T4: these were two separate literals that had to match.
    assert.ok(CONTACT_SUBJECTS.includes('General Inquiry'))
    assert.ok(CONTACT_SUBJECTS.includes('Book a Consultation'))
    assert.equal(CONTACT_SUBJECTS.length, 5)
    assert.equal(new Set(CONTACT_SUBJECTS).size, CONTACT_SUBJECTS.length)
  })
})

describe('validateProfileUpdate', () => {
  test('trims and keeps only whitelisted fields', () => {
    const { valid, clean } = validateProfileUpdate({
      name: '  Priya  ',
      phone: '9876543210',
      email: 'attacker@example.com',
      role: 'admin',
    })
    assert.ok(valid)
    assert.deepEqual(clean, { name: 'Priya', phone: '9876543210' })
    assert.equal('email' in clean, false, 'email must never be updatable here')
    assert.equal('role' in clean, false, 'role must never be updatable here')
  })

  test('reports each bad field and cleans none of them', () => {
    const { valid, errors, clean } = validateProfileUpdate({
      name: '   ',
      phone: '123',
      dob: '3000-01-01',
      gender: 'unlisted',
    })
    assert.equal(valid, false)
    assert.deepEqual(Object.keys(errors).sort(), ['dob', 'gender', 'name', 'phone'])
    assert.deepEqual(clean, {})
  })

  test('an absent field is left alone rather than blanked', () => {
    const { valid, clean } = validateProfileUpdate({})
    assert.ok(valid)
    assert.deepEqual(clean, {})
  })

  test('an over-long name is rejected', () => {
    const { valid, errors } = validateProfileUpdate({ name: 'x'.repeat(101) })
    assert.equal(valid, false)
    assert.ok(errors.name)
  })
})
