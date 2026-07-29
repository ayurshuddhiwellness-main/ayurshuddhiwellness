'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'

const SUBJECTS = [
  'General Inquiry',
  'Book a Consultation',
  'Therapy Question',
  'Feedback',
  'Other',
]

const REQUIRED = ['name', 'email', 'subject', 'message']

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' }

// #B85C5C is the earthy error tone from DESIGN_SYSTEM_3.md. It has no Tailwind
// token, so it is applied as an arbitrary value.
const FIELD =
  'w-full rounded-card border bg-white px-4 py-3 font-sans text-sm text-foreground transition-colors duration-300 focus:outline-none'
const OK = 'border-border focus:border-primary'
const BAD = 'border-[#B85C5C] focus:border-[#B85C5C]'

const LABEL = 'mb-2 block font-sans text-xs uppercase tracking-[0.25em] text-muted'

export default function ContactForm() {
  const reduce = useReducedMotion()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    // Clear the error as soon as the field has something in it.
    if (errors[field] && e.target.value.trim()) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateOnBlur = (field) => () => {
    if (!REQUIRED.includes(field)) return
    if (!values[field].trim()) {
      setErrors((prev) => ({ ...prev, [field]: 'This field is required.' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const found = {}
    REQUIRED.forEach((field) => {
      if (!values[field].trim()) found[field] = 'This field is required.'
    })

    if (Object.keys(found).length) {
      setErrors(found)
      return
    }

    // No backend wired yet — see DESIGN_SYSTEM_3.md, form handling is a
    // later task.
    console.log('Contact form submission', values)
    setSent(true)
  }

  const errorFor = (field) =>
    errors[field] ? (
      <p
        id={`${field}-error`}
        role="alert"
        className="mt-2 font-sans text-xs text-[#B85C5C]"
      >
        {errors[field]}
      </p>
    ) : null

  const fieldClass = (field) => `${FIELD} ${errors[field] ? BAD : OK}`

  const a11y = (field) => ({
    'aria-invalid': errors[field] ? 'true' : undefined,
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  })

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
          className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center"
        >
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>

          <p className="mt-6 max-w-xs font-serif text-2xl font-normal leading-snug text-foreground">
            Thank you! We&rsquo;ll get back to you within 24 hours.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
          className="flex flex-col gap-6"
        >
          <div>
            <label htmlFor="name" className={LABEL}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={update('name')}
              onBlur={validateOnBlur('name')}
              className={fieldClass('name')}
              {...a11y('name')}
            />
            {errorFor('name')}
          </div>

          <div>
            <label htmlFor="email" className={LABEL}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={update('email')}
              onBlur={validateOnBlur('email')}
              className={fieldClass('email')}
              {...a11y('email')}
            />
            {errorFor('email')}
          </div>

          <div>
            <label htmlFor="phone" className={LABEL}>
              Phone <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={update('phone')}
              className={`${FIELD} ${OK}`}
            />
          </div>

          <div>
            <label htmlFor="subject" className={LABEL}>
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={values.subject}
              onChange={update('subject')}
              onBlur={validateOnBlur('subject')}
              className={fieldClass('subject')}
              {...a11y('subject')}
            >
              <option value="">Select a subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errorFor('subject')}
          </div>

          <div>
            <label htmlFor="message" className={LABEL}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={values.message}
              onChange={update('message')}
              onBlur={validateOnBlur('message')}
              className={`${fieldClass('message')} resize-y`}
              {...a11y('message')}
            />
            {errorFor('message')}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Send Message
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
