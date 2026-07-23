'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { EASE } from '../../components/ui/motion'
import { useAuth } from '../../hooks/useAuth'

// --- Mock data -------------------------------------------------------------
// Swap to the real API when Firebase is connected (see loadServices/loadSlots).
const MOCK_SERVICES = [
  { id: '1', name: 'Ayurvedic Consultation', description: 'Personalised assessment of your unique constitution and health concerns.', duration: 60, price: 800, category: 'Consultation' },
  { id: '2', name: 'Panchakarma Session', description: 'Classical five-step detoxification and rejuvenation therapy.', duration: 90, price: 1500, category: 'Therapy' },
  { id: '3', name: 'Yoga & Pranayama', description: 'Guided yoga, breathing, and meditation tailored to your Prakriti.', duration: 45, price: 500, category: 'Wellness' },
]
const MOCK_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

// Data loaders. To go live, uncomment the fetch line and delete the mock return.
async function loadServices() {
  // return (await (await fetch('/api/services')).json()).data
  return MOCK_SERVICES
}
async function loadSlots(serviceId, dateISO) {
  // return (await (await fetch(`/api/slots?service_id=${serviceId}&date=${dateISO}`)).json()).data.available_slots
  return MOCK_SLOTS
}

// --- Icons -----------------------------------------------------------------
function CheckIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M5 10.5l3.2 3.2L15 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function Chevron({ dir = 'left', className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function Spinner({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

// --- Helpers ---------------------------------------------------------------
const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}
const stepTransition = { duration: 0.4, ease: EASE }

function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function formatLongDate(d) {
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// ===========================================================================
export default function BookPage() {
  const { loading, user } = useAuth()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-24 pt-28 sm:pt-32">
        {loading ? <LoadingSkeleton /> : user ? <BookingFlow /> : <AuthGate />}
      </main>
      <Footer />
    </>
  )
}

// --- Loading skeleton (while auth resolves) --------------------------------
function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-content px-6 lg:px-12">
      <div className="mx-auto max-w-md animate-pulse space-y-4 text-center">
        <div className="mx-auto h-3 w-40 rounded bg-card" />
        <div className="mx-auto h-9 w-72 rounded bg-card" />
        <div className="mx-auto h-3 w-56 rounded bg-card" />
      </div>
    </div>
  )
}

// --- Auth gate -------------------------------------------------------------
function AuthGate() {
  return (
    <div className="mx-auto max-w-content px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stepTransition}
        className="mx-auto max-w-md rounded-card border border-border bg-white p-10 text-center shadow-soft"
      >
        <h1 className="font-serif text-3xl text-foreground">Sign in to book</h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
          You need an account to schedule an appointment. Sign in or create one — it only takes a moment.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login?redirect=/book"
            className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
          >
            Sign in
          </Link>
          <Link
            href="/signup?redirect=/book"
            className="rounded-full border border-border px-6 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
          >
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

// --- Step indicator --------------------------------------------------------
const STEPS = ['Service', 'Date & Time', 'Confirm']
function StepIndicator({ current }) {
  return (
    <div className="mx-auto mt-8 flex max-w-md items-center justify-center">
      {STEPS.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                {done ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                ) : null}
                <span className={`font-sans text-sm ${active ? 'font-medium text-primary' : 'text-muted'}`}>{label}</span>
              </div>
              <span className={`mt-1 h-1 w-1 rounded-full transition-colors ${active ? 'bg-primary' : 'bg-transparent'}`} />
            </div>
            {i < STEPS.length - 1 && <span className="mx-3 h-px w-8 bg-border sm:w-12" />}
          </div>
        )
      })}
    </div>
  )
}

// --- Booking flow ----------------------------------------------------------
function BookingFlow() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [slots, setSlots] = useState([])
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing | success

  useEffect(() => {
    loadServices().then(setServices)
  }, [])

  const chooseService = (svc) => {
    setSelectedService(svc)
    setStep(2)
  }

  const chooseDate = useCallback(async (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    const available = await loadSlots(selectedService?.id, toISODate(date))
    setSlots(available)
  }, [selectedService])

  const confirm = () => {
    setStatus('processing')
    // Mock payment — real Razorpay is wired after Firebase credentials are added.
    setTimeout(() => setStatus('success'), 1500)
  }

  return (
    <div className="mx-auto max-w-content px-6 lg:px-12">
      {/* Hero */}
      <div className="text-center">
        <p className="font-sans text-sm uppercase tracking-[0.25em] text-muted">Book a consultation</p>
        <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">Begin your wellness journey.</h1>
        <p className="mt-4 font-sans text-base text-muted">Choose a service to get started.</p>
      </div>

      <StepIndicator current={status === 'success' ? 3 : step} />

      <div className="mt-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={stepTransition}>
              <ServiceStep services={services} selected={selectedService} onSelect={chooseService} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={stepTransition}>
              <DateTimeStep
                service={selectedService}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                slots={slots}
                onBack={() => setStep(1)}
                onPickDate={chooseDate}
                onPickSlot={setSelectedSlot}
                onContinue={() => setStep(3)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={stepTransition}>
              <ConfirmStep
                service={selectedService}
                date={selectedDate}
                slot={selectedSlot}
                notes={notes}
                setNotes={setNotes}
                status={status}
                onBack={() => setStep(2)}
                onConfirm={confirm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- Step 1: service -------------------------------------------------------
function ServiceStep({ services, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {services.map((svc) => {
        const isSel = selected?.id === svc.id
        return (
          <button
            key={svc.id}
            onClick={() => onSelect(svc)}
            className={`group flex flex-col rounded-2xl border bg-white p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-soft ${
              isSel ? 'border-2 border-primary bg-primary/5' : 'border border-border'
            }`}
          >
            <span className="w-fit rounded-full border border-primary px-3 py-1 font-sans text-xs uppercase tracking-widest text-primary">
              {svc.category}
            </span>
            <h3 className="mt-5 font-serif text-xl text-foreground">{svc.name}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{svc.description}</p>
            <div className="mt-4 flex gap-2 font-sans text-sm text-muted">
              <span>{svc.duration} min</span>
              <span>·</span>
              <span>₹{svc.price}</span>
            </div>
            <span className="mt-6 font-sans text-sm font-medium text-primary">Select →</span>
          </button>
        )
      })}
    </div>
  )
}

// --- Step 2: date & time ---------------------------------------------------
function DateTimeStep({ service, selectedDate, selectedSlot, slots, onBack, onPickDate, onPickSlot, onContinue }) {
  const canContinue = selectedDate && selectedSlot
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button onClick={onBack} className="flex items-center gap-1 font-sans text-sm text-primary transition-opacity hover:opacity-70">
          <Chevron dir="left" className="h-4 w-4" /> Change service
        </button>
        <span className="w-fit rounded-full bg-card px-4 py-2 font-sans text-sm text-foreground">
          {service?.name} <span className="text-muted">· ₹{service?.price}</span>
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
        <Calendar selectedDate={selectedDate} onPick={onPickDate} />
        <div>
          <h3 className="font-sans text-sm uppercase tracking-widest text-muted">Available Times</h3>
          {selectedDate ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {slots.map((slot) => {
                const isSel = selectedSlot === slot
                return (
                  <button
                    key={slot}
                    onClick={() => onPickSlot(slot)}
                    className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors duration-200 ${
                      isSel ? 'border-primary bg-primary text-white' : 'border-border text-foreground hover:bg-primary hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="mt-5 font-sans text-sm text-muted">Select a date to see available times.</p>
          )}
        </div>
      </div>

      <div className="sticky bottom-4 mt-10 flex justify-center md:static md:justify-end">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`rounded-full px-8 py-3 font-sans text-sm font-medium transition-all duration-300 ${
            canContinue ? 'bg-primary text-white hover:bg-primary-hover' : 'cursor-not-allowed bg-border text-muted'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// --- Custom calendar (no library) ------------------------------------------
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
function Calendar({ selectedDate, onPick }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const atCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg text-foreground">
          {view.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setView(new Date(year, month - 1, 1))}
            disabled={atCurrentMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous month"
          >
            <Chevron dir="left" className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView(new Date(year, month + 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label="Next month"
          >
            <Chevron dir="right" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1 font-sans text-xs uppercase tracking-wider text-muted">{w}</span>
        ))}
        {cells.map((date, idx) => {
          if (!date) return <span key={`e${idx}`} />
          const past = date < today
          const isToday = sameDay(date, today)
          const isSel = sameDay(date, selectedDate)
          return (
            <div key={toISODate(date)} className="flex justify-center">
              <button
                onClick={() => !past && onPick(date)}
                disabled={past}
                className={`flex h-10 w-10 items-center justify-center rounded-full font-sans text-sm transition-colors duration-200 ${
                  isSel
                    ? 'bg-primary text-white'
                    : past
                      ? 'cursor-not-allowed text-muted/50'
                      : isToday
                        ? 'border border-primary text-foreground hover:bg-primary/10'
                        : 'text-foreground hover:bg-card'
                }`}
              >
                {date.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Step 3: review & confirm ----------------------------------------------
function ConfirmStep({ service, date, slot, notes, setNotes, status, onBack, onConfirm }) {
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={stepTransition}
        className="mx-auto max-w-lg rounded-2xl border border-border bg-white p-10 text-center shadow-soft"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckIcon className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-serif text-2xl text-foreground">Booking confirmed</h2>
        <p className="mt-2 font-sans text-sm text-muted">
          {service?.name} · {date ? formatLongDate(date) : ''} at {slot}
        </p>
        <p className="mt-4 font-sans text-sm text-muted">We look forward to seeing you.</p>
        <Link
          href="/profile"
          className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover"
        >
          View my bookings
        </Link>
      </motion.div>
    )
  }

  const processing = status === 'processing'
  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-soft">
        <h2 className="font-serif text-2xl text-foreground">{service?.name}</h2>
        <p className="mt-2 font-sans text-sm text-muted">
          {date ? formatLongDate(date) : ''} · {slot}
        </p>
        <p className="mt-1 font-sans text-sm text-muted">{service?.duration} min · ₹{service?.price}</p>

        <div className="my-6 h-px w-full bg-border" />

        <label htmlFor="notes" className="font-sans text-sm text-foreground">Any notes for your practitioner</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-2 min-h-[80px] w-full resize-none border-b border-border bg-transparent font-sans text-sm text-foreground outline-none transition-colors focus:border-primary"
          placeholder="Optional — anything we should know beforehand."
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onBack}
          disabled={processing}
          className="rounded-full border border-border px-6 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary hover:text-primary disabled:opacity-40"
        >
          ← Change details
        </button>
        <button
          onClick={onConfirm}
          disabled={processing}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-sans text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-hover disabled:opacity-70"
        >
          {processing ? (
            <>
              <Spinner className="h-4 w-4" /> Processing…
            </>
          ) : (
            <>Confirm &amp; Pay ₹{service?.price} →</>
          )}
        </button>
      </div>
    </div>
  )
}
