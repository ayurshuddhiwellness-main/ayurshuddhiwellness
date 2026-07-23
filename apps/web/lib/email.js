// Transactional email via Resend.
//
// If RESEND_API_KEY is not set, emails are logged and skipped (never throws), so
// the booking flow works in every environment. resend is imported lazily so the
// package is only loaded when a key is actually present.

import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const FROM = process.env.RESEND_FROM || 'AyurShuddhi <bookings@ayurshuddhi.com>'
const CLINIC_ADDRESS =
  process.env.CLINIC_ADDRESS ||
  'AyurShuddhi Wellness, 12 Green Leaf Lane, Pune, Maharashtra 411001'

async function send({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email:skipped] to=${to} subject="${subject}" (no RESEND_API_KEY)`)
    return { skipped: true }
  }
  const { Resend } = require('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) {
    console.error('[email:error]', error)
    return { error }
  }
  return { id: data?.id, skipped: false }
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    })
  } catch {
    return iso
  }
}

export function sendBookingConfirmation({ to, serviceName, slotDatetime, note }) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#1E2220;">
      <h2 style="font-family:Georgia,serif;color:#3F5E50;">Your appointment is confirmed</h2>
      <p>Thank you for booking with AyurShuddhi Wellness.</p>
      <table style="margin:16px 0;">
        <tr><td style="padding:4px 12px 4px 0;color:#6B6B63;">Service</td><td>${serviceName}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B6B63;">When</td><td>${formatDateTime(slotDatetime)}</td></tr>
      </table>
      ${note ? `<p style="color:#6B6B63;">A note from your practitioner: ${note}</p>` : ''}
      <p style="margin-top:16px;">${CLINIC_ADDRESS}</p>
      <p style="color:#6B6B63;">We look forward to seeing you.</p>
    </div>`
  return send({ to, subject: 'Your AyurShuddhi appointment is confirmed', html })
}

export function sendCancellation({ to, serviceName, slotDatetime }) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#1E2220;">
      <h2 style="font-family:Georgia,serif;color:#3F5E50;">Your appointment has been cancelled</h2>
      <p>Your booking has been cancelled as requested.</p>
      <table style="margin:16px 0;">
        <tr><td style="padding:4px 12px 4px 0;color:#6B6B63;">Service</td><td>${serviceName}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B6B63;">Was scheduled for</td><td>${formatDateTime(slotDatetime)}</td></tr>
      </table>
      <p style="color:#6B6B63;">We hope to see you another time. ${CLINIC_ADDRESS}</p>
    </div>`
  return send({ to, subject: 'Your AyurShuddhi appointment was cancelled', html })
}
