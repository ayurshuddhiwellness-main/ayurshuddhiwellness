import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { clinicSlotToMs, formatClinicDateTime } from '../lib/clinic-time.js'

/* These run under whatever TZ the machine happens to have. That is the point:
   the bug being guarded here only appeared when the server's zone was not the
   clinic's, so a test that silently passed on an IST laptop and failed in CI
   would be worse than no test. Every expectation below is an absolute instant
   or a Asia/Kolkata rendering, so neither depends on the host zone. */

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

describe('clinicSlotToMs', () => {
  test('resolves a naive slot against clinic time, not the host zone', () => {
    assert.equal(
      clinicSlotToMs('2026-09-21T09:00:00'),
      Date.parse('2026-09-21T09:00:00+05:30'),
    )
  })

  test('is exactly 5.5h off a UTC reading of the same string', () => {
    const naive = '2026-09-21T09:00:00'
    const asUtc = Date.parse(`${naive}Z`)
    assert.equal(asUtc - clinicSlotToMs(naive), 5.5 * 60 * 60 * 1000)
  })

  test('trusts a value that already carries a zone', () => {
    assert.equal(
      clinicSlotToMs('2026-09-21T03:30:00Z'),
      Date.parse('2026-09-21T09:00:00+05:30'),
    )
  })

  test('returns NaN for junk rather than a wrong instant', () => {
    for (const bad of ['', '   ', 'tomorrow', '2026-13-45T99:99:99', null, undefined, 42, {}]) {
      assert.ok(Number.isNaN(clinicSlotToMs(bad)), `expected NaN for ${JSON.stringify(bad)}`)
    }
  })

  test('midnight and end-of-year roll over correctly', () => {
    assert.equal(clinicSlotToMs('2027-01-01T00:00:00'), Date.parse('2026-12-31T18:30:00Z'))
  })
})

describe('the 24-hour cancellation window (regression: B2)', () => {
  /* The exact case from the audit. A 09:00 IST appointment, 19.5 real hours
     away, was computed as 25 hours away on a UTC host and so sailed past the
     24-hour guard that exists to refuse it. */
  const slot = '2026-09-21T09:00:00'
  const now = Date.parse('2026-09-20T08:00:00Z') // 19.5h before the appointment

  test('refuses a cancellation inside the window', () => {
    const remaining = clinicSlotToMs(slot) - now
    assert.equal(remaining / 3600000, 19.5)
    assert.equal(remaining > TWENTY_FOUR_HOURS_MS, false)
  })

  test('still allows one comfortably outside it', () => {
    const early = Date.parse('2026-09-19T08:00:00Z') // 43.5h before
    assert.equal(clinicSlotToMs(slot) - early > TWENTY_FOUR_HOURS_MS, true)
  })
})

describe('formatClinicDateTime', () => {
  test('prints the time that was actually booked', () => {
    const rendered = formatClinicDateTime('2026-09-20T10:00:00')
    assert.match(rendered, /10:00/)
    assert.doesNotMatch(rendered, /3:30/) // the pre-fix output on a UTC host
  })

  test('falls back to the raw value instead of "Invalid Date"', () => {
    assert.equal(formatClinicDateTime('not a date'), 'not a date')
  })
})
