import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import {
  timeToMinutes,
  minutesToTime,
  generateSlots,
  computeAvailableSlots,
  takenStartTimes,
  PENDING_HOLD_MS,
} from '../lib/slots.js'

describe('time conversion', () => {
  test('round-trips', () => {
    for (const t of ['00:00', '09:30', '13:05', '23:59']) {
      assert.equal(minutesToTime(timeToMinutes(t)), t)
    }
  })

  test('pads single digits', () => {
    assert.equal(minutesToTime(65), '01:05')
  })
})

describe('generateSlots', () => {
  test('only emits starts whose whole appointment fits before end_time', () => {
    // 09:00-10:30 at 60min yields 09:00 only — 10:00 would run to 11:00.
    assert.deepEqual(generateSlots('09:00', '10:30', 60), ['09:00'])
  })

  test('fills an exact division', () => {
    assert.deepEqual(generateSlots('09:00', '12:00', 60), ['09:00', '10:00', '11:00'])
  })

  test('returns nothing for a nonsensical window rather than throwing', () => {
    assert.deepEqual(generateSlots('12:00', '09:00', 60), [])
    assert.deepEqual(generateSlots('09:00', '12:00', 0), [])
    assert.deepEqual(generateSlots('09:00', '12:00', -30), [])
    assert.deepEqual(generateSlots('nope', 'also nope', 60), [])
  })
})

describe('computeAvailableSlots', () => {
  test('removes blocked and booked starts', () => {
    assert.deepEqual(
      computeAvailableSlots({
        startTime: '09:00',
        endTime: '13:00',
        slotDurationMinutes: 60,
        blockedSlots: ['10:00'],
        bookedSlots: ['12:00'],
      }),
      ['09:00', '11:00'],
    )
  })
})

/* ── The B3 regression surface ──────────────────────────────────────────────
   Availability used to count confirmed bookings only, so a pending booking
   left its slot on offer and two people could both claim it. */
describe('takenStartTimes', () => {
  const DATE = '2026-09-21'
  const now = Date.parse('2026-09-20T12:00:00Z')

  const booking = (status, time, ageMs = 0) => ({
    status,
    slot_datetime: `${DATE}T${time}:00`,
    created_at_ms: now - ageMs,
  })

  test('a confirmed booking holds its slot', () => {
    assert.deepEqual(takenStartTimes([booking('confirmed', '09:00')], DATE, now), ['09:00'])
  })

  test('a fresh pending booking holds its slot too', () => {
    assert.deepEqual(takenStartTimes([booking('pending', '09:00')], DATE, now), ['09:00'])
  })

  test('a pending booking releases the slot once its hold expires', () => {
    const stale = booking('pending', '09:00', PENDING_HOLD_MS + 1000)
    assert.deepEqual(takenStartTimes([stale], DATE, now), [])
  })

  test('holds right up to the boundary', () => {
    const justInside = booking('pending', '09:00', PENDING_HOLD_MS - 1000)
    assert.deepEqual(takenStartTimes([justInside], DATE, now), ['09:00'])
  })

  test('a cancelled booking never holds a slot', () => {
    assert.deepEqual(takenStartTimes([booking('cancelled', '09:00')], DATE, now), [])
  })

  test('ignores bookings on other dates', () => {
    const other = { status: 'confirmed', slot_datetime: '2026-09-22T09:00:00', created_at_ms: now }
    assert.deepEqual(takenStartTimes([other], DATE, now), [])
  })

  test('an unreadable timestamp holds the slot — blocking beats double-booking', () => {
    const malformed = { status: 'pending', slot_datetime: `${DATE}T09:00:00`, created_at_ms: NaN }
    assert.deepEqual(takenStartTimes([malformed], DATE, now), ['09:00'])
  })

  test('survives missing and malformed records', () => {
    assert.deepEqual(takenStartTimes([{}, { status: 'pending' }, null], DATE, now), [])
  })

  test('a pending booking removes the slot from what is offered', () => {
    const holds = [booking('pending', '10:00')]
    assert.deepEqual(
      computeAvailableSlots({
        startTime: '09:00',
        endTime: '12:00',
        slotDurationMinutes: 60,
        bookedSlots: takenStartTimes(holds, DATE, now),
      }),
      ['09:00', '11:00'],
    )
  })
})
