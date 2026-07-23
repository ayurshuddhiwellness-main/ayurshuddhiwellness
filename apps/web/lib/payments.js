// Payment provider abstraction.
//
// Razorpay is NOT wired yet. Until RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are set
// in the environment, this module runs in DUMMY mode: it fabricates order ids and
// accepts a deterministic dummy signature so the whole booking flow can be
// exercised end-to-end without real keys.
//
// When the real keys are added, isDummyMode() flips to false automatically and
// the real Razorpay Orders API + HMAC-SHA256 signature check take over. The rest
// of the codebase does not change.

import crypto from 'crypto'

export function isDummyMode() {
  return !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET
}

// The publishable key id handed to the browser checkout. In dummy mode this is a
// clearly-fake placeholder so nothing looks like a real credential.
export function getPublicKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy'
}

// Create an order. amount is in the smallest currency unit (paise).
export async function createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  if (isDummyMode()) {
    return {
      id: `order_dummy_${crypto.randomBytes(8).toString('hex')}`,
      amount,
      currency,
      receipt,
      status: 'created',
      dummy: true,
    }
  }

  const RazorpayModule = await import('razorpay')
  const Razorpay = RazorpayModule.default || RazorpayModule
  const client = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
  const order = await client.orders.create({ amount, currency, receipt, notes })
  return { ...order, dummy: false }
}

// Real Razorpay signature: HMAC-SHA256 of "orderId|paymentId" keyed by the secret.
// Exported separately so it can be unit-tested with known vectors.
export function computeSignature(orderId, paymentId, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
}

// Constant-time compare to avoid timing leaks.
function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

// Verify a payment. In dummy mode the accepted signature is
// `dummy_signature_<orderId>` so the frontend dummy checkout can produce it.
export function verifyPayment({ orderId, paymentId, signature }) {
  if (isDummyMode()) {
    return signature === `dummy_signature_${orderId}`
  }
  const expected = computeSignature(orderId, paymentId, process.env.RAZORPAY_KEY_SECRET)
  return safeEqual(expected, signature)
}
