'use client'

import { useState } from 'react'
import { RevealGroup, RevealItem } from '../../ui/Reveal'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    // UI-only for now — no backend submission yet.
    setSubmitted(true)
  }

  return (
    <section className="bg-card px-6 py-20 lg:px-12">
      <RevealGroup className="mx-auto max-w-lg text-center">
        <RevealItem>
          <h2 className="font-serif text-2xl font-normal text-foreground">
            Wisdom, delivered weekly.
          </h2>
        </RevealItem>
        <RevealItem className="mt-3">
          <p className="font-sans text-base leading-relaxed text-muted">
            One considered letter each week — a seasonal ritual, a herb worth
            knowing, a small practice to carry with you.
          </p>
        </RevealItem>
        <RevealItem className="mt-8">
          {submitted ? (
            <p className="font-sans text-sm text-primary">
              Thank you — you’re on the list.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-border bg-white px-5 py-3 font-sans text-sm text-foreground outline-none transition-colors duration-300 placeholder:text-muted focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-7 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
              >
                Subscribe
              </button>
            </form>
          )}
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
