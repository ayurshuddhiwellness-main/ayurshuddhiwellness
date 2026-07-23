// Payment provider abstraction (PLACEHOLDER).
//
// Razorpay is NOT wired yet. This module runs in DUMMY mode: it fabricates
// order ids and accepts a deterministic dummy signature so the whole booking
// flow can be exercised end-to-end without real keys.
//
// When you're ready to integrate Razorpay, install the package
// (`npm install razorpay`) and uncomment / add the real implementation.

import crypto from 'crypto'

export function isDummyMode() {
  return true
}

// The publishable key id handed to the browser checkout.
export function getPublicKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy'
}

// Create an order. amount is in the smallest currency unit (paise).
export async function createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  // TODO: Wire up real Razorpay when ready
  return {
    id: `order_dummy_${crypto.randomBytes(8).toString('hex')}`,
    amount,
    currency,
    receipt,
    status: 'created',
    dummy: true,
  }
}

// HMAC-SHA256 signature helper (kept for future use).
export function computeSignature(orderId, paymentId, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
}

// Verify a payment. In dummy mode the accepted signature is
// `dummy_signature_<orderId>` so the frontend dummy checkout can produce it.
export function verifyPayment({ orderId, paymentId, signature }) {
  if (isDummyMode()) {
    return signature === `dummy_signature_${orderId}`
  }
  const expected = computeSignature(orderId, paymentId, process.env.RAZORPAY_KEY_SECRET)
  const ba = Buffer.from(String(expected))
  const bb = Buffer.from(String(signature))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}
