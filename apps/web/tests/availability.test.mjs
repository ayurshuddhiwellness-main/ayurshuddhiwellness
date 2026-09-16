import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { toHold, openStartTimes } from '../lib/availability.js'
import { PENDING_HOLD_MS } from '../lib/slots.js'

/* This is the seam /api/slots (what visitors are offered) and POST
   /api/bookings (what is actually enforced) now share. If they disagree, the
   site advertises slots that fail at checkout — so the point of testing it
   here is that one helper produces both answers. */

const DATE = '2026-09-21'
const now = Date.parse('2026-09-20T12:00:00Z')

const AVAILABILITY = {
  start_time: '09:00',
  end_time: '13:00',
  slot_duration_minutes: 60,
  blocked_slots: [],
}

// A stand-in for a Firestore QueryDocumentSnapshot.
const snapshot = (data) => ({ id: data.id ?? 'doc', data: () => data })

// Firestore hands back a Timestamp, not a number.
const timestamp = (ms) => ({ toMillis: () => ms })

describe('toHold', () => {
  test('reads a Firestore Timestamp', () => {
    const hold = toHold(snapshot({
      status: 'pending',
      slot_datetime: `${DATE}T09:00:00`,
      created_at: timestamp(now),
    }))
    assert.deepEqual(hold, {
      status: 'pending',
      slot_datetime: `${DATE}T09:00:00`,
      created_at_ms: now,
    })
  })

  test('reads a plain Date', () => {
    const hold = toHold(snapshot({ status: 'pending', created_at: new Date(now) }))
    assert.equal(hold.created_at_ms, now)
  })

  test('yields NaN for a missing or unresolved timestamp', () => {
    assert.ok(Number.isNaN(toHold(snapshot({ status: 'pending' })).created_at_ms))
    assert.ok(Number.isNaN(toHold(snapshot({ created_at: 'nonsense' })).created_at_ms))
  })

  test('never yields undefined for slot_datetime', () => {
    assert.equal(toHold(snapshot({})).slot_datetime, '')
  })
})

describe('openStartTimes', () => {
  test('offers the whole day when nothing is booked', () => {
    assert.deepEqual(openStartTimes(AVAILABILITY, [], DATE, now), [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
    ])
  })

  test('withholds a confirmed slot', () => {
    const holds = [toHold(snapshot({
      status: 'confirmed',
      slot_datetime: `${DATE}T10:00:00`,
      created_at: timestamp(now),
    }))]
    assert.deepEqual(openStartTimes(AVAILABILITY, holds, DATE, now), ['09:00', '11:00', '12:00'])
  })

  test('withholds a slot someone is mid-checkout on (B3)', () => {
    const holds = [toHold(snapshot({
      status: 'pending',
      slot_datetime: `${DATE}T10:00:00`,
      created_at: timestamp(now - 60_000),
    }))]
    assert.equal(openStartTimes(AVAILABILITY, holds, DATE, now).includes('10:00'), false)
  })

  test('gives the slot back when the checkout was abandoned', () => {
    const holds = [toHold(snapshot({
      status: 'pending',
      slot_datetime: `${DATE}T10:00:00`,
      created_at: timestamp(now - PENDING_HOLD_MS - 1000),
    }))]
    assert.ok(openStartTimes(AVAILABILITY, holds, DATE, now).includes('10:00'))
  })

  test('honours blocked_slots alongside bookings', () => {
    const holds = [toHold(snapshot({
      status: 'confirmed',
      slot_datetime: `${DATE}T09:00:00`,
      created_at: timestamp(now),
    }))]
    const availability = { ...AVAILABILITY, blocked_slots: ['12:00'] }
    assert.deepEqual(openStartTimes(availability, holds, DATE, now), ['10:00', '11:00'])
  })

  test('tolerates a missing blocked_slots field', () => {
    const { blocked_slots, ...withoutBlocked } = AVAILABILITY
    assert.equal(openStartTimes(withoutBlocked, [], DATE, now).length, 4)
  })

  test('a booking on another date does not shrink this one', () => {
    const holds = [toHold(snapshot({
      status: 'confirmed',
      slot_datetime: '2026-09-22T10:00:00',
      created_at: timestamp(now),
    }))]
    assert.equal(openStartTimes(AVAILABILITY, holds, DATE, now).length, 4)
  })
})
