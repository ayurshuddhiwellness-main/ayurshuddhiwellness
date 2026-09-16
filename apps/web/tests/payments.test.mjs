import { test, describe, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

import {
  isDummyMode,
  getPublicKeyId,
  createOrder,
  computeSignature,
  verifyPayment,
} from '../lib/payments.js'

/* The security-relevant claim in this module is that a forged dummy signature
   can never confirm a booking in production. These tests hold it to that. */

const ENV_KEYS = ['NODE_ENV', 'PAYMENTS_DUMMY_MODE', 'RAZORPAY_KEY_SECRET', 'NEXT_PUBLIC_RAZORPAY_KEY_ID']
let saved

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]))
})

afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k]
    else process.env[k] = v
  }
})

describe('isDummyMode', () => {
  test('is on outside production', () => {
    process.env.NODE_ENV = 'development'
    delete process.env.PAYMENTS_DUMMY_MODE
    assert.equal(isDummyMode(), true)
  })

  test('is off in production unless explicitly opted into', () => {
    process.env.NODE_ENV = 'production'
    delete process.env.PAYMENTS_DUMMY_MODE
    assert.equal(isDummyMode(), false)

    process.env.PAYMENTS_DUMMY_MODE = 'true'
    assert.equal(isDummyMode(), true)
  })

  test('only the exact string "true" opts in', () => {
    process.env.NODE_ENV = 'production'
    for (const v of ['1', 'yes', 'TRUE', '']) {
      process.env.PAYMENTS_DUMMY_MODE = v
      assert.equal(isDummyMode(), false, `"${v}" must not enable dummy mode`)
    }
  })
})

describe('createOrder', () => {
  test('echoes the amount and marks itself dummy', async () => {
    const order = await createOrder({ amount: 80000, receipt: 'svc_x_1' })
    assert.equal(order.amount, 80000)
    assert.equal(order.currency, 'INR')
    assert.equal(order.status, 'created')
    assert.equal(order.dummy, true)
    assert.match(order.id, /^order_dummy_[0-9a-f]{16}$/)
  })

  test('ids do not collide', async () => {
    const ids = await Promise.all(
      Array.from({ length: 50 }, () => createOrder({ amount: 1 }).then((o) => o.id)),
    )
    assert.equal(new Set(ids).size, ids.length)
  })
})

describe('verifyPayment in dummy mode', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development'
  })

  test('accepts the documented dummy signature', () => {
    assert.equal(
      verifyPayment({
        orderId: 'order_1',
        paymentId: 'pay_1',
        signature: 'dummy_signature_order_1',
      }),
      true,
    )
  })

  test('rejects a dummy signature for a different order', () => {
    assert.equal(
      verifyPayment({
        orderId: 'order_1',
        paymentId: 'pay_1',
        signature: 'dummy_signature_order_2',
      }),
      false,
    )
  })
})

describe('verifyPayment in production', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
    delete process.env.PAYMENTS_DUMMY_MODE
    process.env.RAZORPAY_KEY_SECRET = 'test_secret'
  })

  test('accepts a correctly computed HMAC', () => {
    const signature = computeSignature('order_1', 'pay_1', 'test_secret')
    assert.equal(verifyPayment({ orderId: 'order_1', paymentId: 'pay_1', signature }), true)
  })

  test('REFUSES a forged dummy signature — the whole point of failing closed', () => {
    assert.equal(
      verifyPayment({
        orderId: 'order_1',
        paymentId: 'pay_1',
        signature: 'dummy_signature_order_1',
      }),
      false,
    )
  })

  test('rejects a signature computed with the wrong secret', () => {
    const signature = computeSignature('order_1', 'pay_1', 'wrong_secret')
    assert.equal(verifyPayment({ orderId: 'order_1', paymentId: 'pay_1', signature }), false)
  })

  test('rejects a signature of the wrong length without throwing', () => {
    // timingSafeEqual throws on a length mismatch; the length guard precedes it.
    assert.equal(verifyPayment({ orderId: 'o', paymentId: 'p', signature: 'short' }), false)
    assert.equal(verifyPayment({ orderId: 'o', paymentId: 'p', signature: '' }), false)
  })

  test('a missing secret raises a 503 rather than an opaque crash (P1)', () => {
    delete process.env.RAZORPAY_KEY_SECRET
    let thrown
    try {
      verifyPayment({ orderId: 'o', paymentId: 'p', signature: 'x' })
    } catch (e) {
      thrown = e
    }
    assert.ok(thrown instanceof Response, 'should throw a Response for guard() to return')
    assert.equal(thrown.status, 503)
  })
})

describe('computeSignature', () => {
  test('matches the Razorpay order|payment construction', () => {
    const expected = crypto
      .createHmac('sha256', 'secret')
      .update('order_1|pay_1')
      .digest('hex')
    assert.equal(computeSignature('order_1', 'pay_1', 'secret'), expected)
  })
})

describe('getPublicKeyId', () => {
  test('falls back to the test key', () => {
    delete process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    assert.equal(getPublicKeyId(), 'rzp_test_dummy')
  })

  test('prefers the configured key', () => {
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_live_abc'
    assert.equal(getPublicKeyId(), 'rzp_live_abc')
  })
})
