// POST /api/contact — public. Delivers a /contact enquiry to the clinic inbox.
//
// Unauthenticated and therefore rate limited harder than the booking routes.
// A skipped send (no RESEND_API_KEY) is a success in development but a 503 in
// production: without that split a misconfigured deploy would keep showing the
// visitor a thank-you while their message went nowhere.

import { ok, fail, guard } from '../../../lib/api-response'
import { enforceRateLimit } from '../../../lib/rate-limit'
import { isValidEmail } from '../../../lib/validation'
import { sendContactEnquiry } from '../../../lib/email'

const SUBJECTS = [
  'General Inquiry',
  'Book a Consultation',
  'Therapy Question',
  'Feedback',
  'Other',
]

const LIMITS = { name: 100, email: 200, phone: 20, message: 2000 }

export async function POST(request) {
  return guard(async () => {
    enforceRateLimit(request, 'contact', 5)

    const body = await request.json().catch(() => ({}))
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const phone = String(body.phone || '').trim()
    const subject = String(body.subject || '').trim()
    const message = String(body.message || '').trim()

    if (!name || !email || !subject || !message) {
      return fail(400, 'Name, email, subject and message are all required')
    }
    if (!isValidEmail(email)) {
      return fail(400, 'Please enter a valid email address')
    }
    if (!SUBJECTS.includes(subject)) {
      return fail(400, 'Unrecognised subject')
    }
    for (const [field, max] of Object.entries(LIMITS)) {
      if ({ name, email, phone, message }[field].length > max) {
        return fail(400, `${field} must be ${max} characters or fewer`)
      }
    }

    const result = await sendContactEnquiry({ name, email, phone, subject, message })

    if (result.error) {
      return fail(502, 'We could not send your message just now — please try again shortly')
    }
    if (result.skipped && process.env.NODE_ENV === 'production') {
      return fail(503, 'Messaging is temporarily unavailable — please email us directly')
    }

    return ok({ delivered: !result.skipped })
  })
}
