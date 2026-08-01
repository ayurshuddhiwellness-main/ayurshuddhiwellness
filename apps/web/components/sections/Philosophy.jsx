'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { EASE } from '../ui/motion'

/* ──────────────────────────────────────────────────────
   The three beliefs, over the looping backdrop footage.

   The section behaves as one slide. A tall wrapper holds a frame exactly one
   viewport high, pinned to the top edge for as long as the wrapper takes to
   pass. Because the frame is exactly 100vh and clips, nothing below can show
   through: the next section only appears once this one has run its whole
   distance and let go — the way a deck shows you the next slide only after
   you have advanced past the current one.

   Scrolling itself is never taken away. Every wheel tick, swipe and key press
   still moves the page; what changes is only what the pinned frame shows,
   read off the wrapper's own scroll progress:

     0.00 – 0.34   the footage and the heading, alone
     0.34 – 1.00   the three beliefs, arriving and then held to be read

   Below md the beliefs stack and run well past a single viewport, so pinning
   them inside a clipped frame would shear the last one off. There — and
   wherever motion is unwelcome — the section is an ordinary block that grows
   to fit, and the beliefs reveal on entering view like any other content.
   ────────────────────────────────────────────────────── */

/* Pin length lives in the wrapper's height: 250vh is the frame's own viewport
   plus 150vh of scroll to stay pinned for. It is the one knob for how long the
   whole sequence lasts — the thresholds below are fractions of it, so raising
   it stretches both stages together rather than skewing one. Kept in the
   className rather than in JS so the layout is correct on the first paint,
   before the pinned/unpinned decision below has had a chance to run. */

// Where the beliefs arrive: a third of the way in, which leaves the other two
// thirds — around 100vh of scrolling — for them to sit and be read against.
const BELIEFS_IN = 0.34

// They leave a little earlier than they arrive. Without that gap a reader
// parked exactly on the threshold could flicker the row in and out.
const BELIEFS_OUT = 0.26

// The hint has said its piece within the opening ticks, well before the
// beliefs are due.
const HINT_OUT = 0.08

// The frame only pins where its content fits inside one clipped viewport.
const PIN_FROM = '(min-width: 768px)'

/* Sage reads as the brand accent on linen, but #3F5E50 is far too dark to sit
   on a dimmed photograph. This is the same token lifted toward white until it
   clears 4.5:1 against the overlay, so the accent stays derived from the
   palette rather than becoming a second green. */
const SAGE_ON_DARK = 'color-mix(in srgb, var(--color-primary) 45%, white)'

/* Entrances only, so quint-out throughout. 0.12s between cards is a touch
   wider than the 0.09s used elsewhere — three items spread across the full
   width need the extra beat to read left-to-right rather than as one block. */
const beliefsContainer = {
  hidden: {},
  visible: { transition: { delayChildren: 0.05, staggerChildren: 0.12 } },
}

const beliefItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
}

const PRINCIPLES = [
  {
    numeral: '01',
    title: 'Prakriti First',
    body: 'Every person has a unique constitution. We diagnose and treat according to your individual Prakriti, not generic protocols.',
  },
  {
    numeral: '02',
    title: 'Root Cause, Not Symptom',
    body: 'Ayurveda looks beyond surface symptoms to address the imbalance at its source — for lasting wellness, not temporary relief.',
  },
  {
    numeral: '03',
    title: 'Tradition Meets Evidence',
    body: 'We honor five thousand years of Ayurvedic science while staying grounded in what modern wellness research confirms works.',
  },
]

export default function Philosophy() {
  const reduce = useReducedMotion()
  const videoRef = useRef(null)
  const wrapperRef = useRef(null)

  const [pinned, setPinned] = useState(false)
  const [beliefsShown, setBeliefsShown] = useState(false)

  // `muted` is a DOM property browsers and extensions rewrite independently of
  // the attribute, so React's hydration check can disagree with the markup it
  // shipped. Re-assert it as a property and drive playback from here, which
  // also keeps the loop honest when the user prefers reduced motion.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    el.muted = true

    if (reduce) {
      el.pause()
      return
    }

    // Autoplay can still be refused (low power mode, data saver) — the section
    // background stands in, so there is nothing to recover from.
    const started = el.play()
    if (started) started.catch(() => {})
  }, [reduce])

  // Mirrors, in JS, the two conditions the className uses to pin: wide enough
  // for the content to fit a clipped viewport, and motion welcome. The two
  // have to agree, or the beliefs would be driven by a progress value that no
  // pinned frame is actually consuming.
  useEffect(() => {
    const mq = window.matchMedia(PIN_FROM)
    const sync = () => setPinned(mq.matches && !reduce)

    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [reduce])

  /* Progress across the pinned stretch: 0 the moment the wrapper's top meets
     the top edge and the frame pins, 1 once the wrapper has finished passing
     and it lets go. Everything the wrapper has beyond the one viewport the
     frame occupies is that stretch, so the value maps onto the pin exactly and
     onto nothing else. */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    if (!pinned) return

    const apply = (p) =>
      setBeliefsShown((shown) => (shown ? p > BELIEFS_OUT : p >= BELIEFS_IN))

    // Read once up front too: a restored scroll position can land partway into
    // the section without a change ever firing.
    apply(scrollYProgress.get())
    return scrollYProgress.on('change', apply)
  }, [pinned, scrollYProgress])

  // The hint answers the opening ticks, while the frame is holding still with
  // only the heading on it. It has retired long before the beliefs arrive.
  const hintOpacity = useTransform(scrollYProgress, [0, HINT_OUT], [1, 0])

  /* Pinned, the row is driven by scroll progress. Unpinned, it is an ordinary
     reveal on entering view. Never both — framer-motion lets a viewport
     gesture outrank `animate`, so passing the two together would hand the row
     to whichever fired last. */
  const beliefsTrigger = pinned
    ? { animate: beliefsShown ? 'visible' : 'hidden' }
    : { whileInView: 'visible', viewport: { once: true, amount: 0.3 } }

  return (
    <section ref={wrapperRef} className="relative z-10 motion-safe:md:h-[250vh]">
      {/* The pinned frame. Height is exact rather than a minimum, and the
          overflow is clipped, so the frame can never grow past the viewport
          and let the section below peer out from under the pin. */}
      <div
        data-media-backdrop
        className="relative flex min-h-screen flex-col overflow-hidden bg-foreground px-6 py-24 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.08)] motion-safe:md:sticky motion-safe:md:top-0 motion-safe:md:h-screen motion-safe:md:min-h-0 lg:px-12"
      >
        {/* ── Backdrop — full-bleed loop, muted and inert ─────────────────── */}
        <video
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          autoPlay={!reduce}
          loop
          muted
          playsInline
          preload="metadata"
          suppressHydrationWarning
          src="/videos/hero_background.mp4"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        {/* ── Readability overlay ────────────────────────────────────────── */}
        {/* Weighted into the top-left corner, where the heading sits */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/80 via-black/30 to-transparent"
        />
        {/* And across the foot, under the three beliefs — leaving the middle of
            the frame closest to the footage's own light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
        />

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto flex w-full max-w-content flex-1 flex-col justify-between gap-20">
          <RevealGroup>
            <RevealItem>
              <h2 className="max-w-md font-serif text-4xl font-normal leading-tight text-white md:text-5xl lg:text-6xl">
                What We Believe
              </h2>
            </RevealItem>
          </RevealGroup>

          {/* Three across from md up. Held in one column on phones, where three
              tracks would crush each description past readable measure.

              Rendered at every stage and only faded, so the row reserves its
              height from the outset and nothing below it shifts when it arrives. */}
          <motion.div
            className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10 lg:gap-16"
            variants={beliefsContainer}
            initial="hidden"
            {...beliefsTrigger}
          >
            {PRINCIPLES.map((principle) => (
              <motion.div key={principle.numeral} variants={beliefItem}>
                {/* Ordering only — the headings carry the actual sequence */}
                <p
                  aria-hidden="true"
                  className="font-serif text-4xl leading-none md:text-5xl"
                  style={{ color: SAGE_ON_DARK }}
                >
                  {principle.numeral}
                </p>

                <span
                  aria-hidden="true"
                  className="mt-5 block h-px w-12"
                  style={{ backgroundColor: SAGE_ON_DARK }}
                />

                <h3 className="mt-5 font-serif text-2xl font-normal leading-snug text-white">
                  {principle.title}
                </h3>

                <p className="mt-3 font-sans text-sm leading-relaxed text-white/80">
                  {principle.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Only worth showing while the frame is pinned — it is the one thing
            that explains why the panel is holding its ground. */}
        {pinned && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center"
            style={{ opacity: hintOpacity }}
          >
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/70"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </motion.svg>
          </motion.div>
        )}
      </div>
    </section>
  )
}
