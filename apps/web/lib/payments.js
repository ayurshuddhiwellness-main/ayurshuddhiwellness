// Payment provider abstraction (PLACEHOLDER).
//
// Razorpay is NOT wired yet. This module runs in DUMMY mode: it fabricates
// order ids and accepts a deterministic dummy signature so the whole booking
// flow can be exercised end-to-end without real keys.
//
// When you're ready to integrate Razorpay, install the package
// (`npm install razorpay`) and uncomment / add the real implementation.

import crypto from 'crypto'
import { fail } from './api-response.js'

// Dummy mode is only ever active outside production, or when explicitly
// opted into via PAYMENTS_DUMMY_MODE=true. In production without that flag,
// verification takes the real HMAC path and fails closed — a booking can
// never be confirmed with a forged dummy signature.
export function isDummyMode() {
  return process.env.NODE_ENV !== 'production' || process.env.PAYMENTS_DUMMY_MODE === 'true'
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

  /* A missing secret is a deployment fault, not a bad signature, and the two
     must not look alike. Returning false here would blame the customer's
     payment; letting createHmac() run on `undefined` threw, which guard()
     turned into an opaque 500. Both fail closed — neither is diagnosable.

     Thrown rather than returned because this is the house pattern for a
     non-negotiable refusal: guard() returns a thrown Response verbatim, the
     same way enforceRateLimit and requireAuth signal theirs. */
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) {
    throw fail(503, 'Payments are not configured — please contact us to confirm your booking')
  }

  const expected = computeSignature(orderId, paymentId, secret)
  const ba = Buffer.from(String(expected))
  const bb = Buffer.from(String(signature))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}
