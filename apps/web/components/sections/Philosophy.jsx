'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { EASE } from '../ui/motion'

/* ──────────────────────────────────────────────────────
   The promise, over the backdrop still.

   The section behaves as one slide. A tall wrapper holds a frame exactly one
   viewport high, pinned to the top edge for as long as the wrapper takes to
   pass. Because the frame is exactly 100vh and clips, nothing below can show
   through: the next section only appears once this one has run its whole
   distance and let go — the way a deck shows you the next slide only after
   you have advanced past the current one.

   Scrolling itself is never taken away. Every wheel tick, swipe and key press
   still moves the page; what changes is only what the pinned frame shows,
   read off the wrapper's own scroll progress:

     0.00 – 0.34   the photograph and the heading, alone
     0.34 – 1.00   the quote, arriving line by line and then held to be read

   Wherever motion is unwelcome — and on phones, where the pin's clipped frame
   buys nothing — the section is an ordinary block that grows to fit, and the
   quote reveals on entering view like any other content.
   ────────────────────────────────────────────────────── */

/* Pin length lives in the wrapper's height: 250vh is the frame's own viewport
   plus 150vh of scroll to stay pinned for. It is the one knob for how long the
   whole sequence lasts — the thresholds below are fractions of it, so raising
   it stretches both stages together rather than skewing one. Kept in the
   className rather than in JS so the layout is correct on the first paint,
   before the pinned/unpinned decision below has had a chance to run. */

// Where the quote arrives: a third of the way in, which leaves the other two
// thirds — around 100vh of scrolling — for it to sit and be read against.
const QUOTE_IN = 0.34

// It leaves a little earlier than it arrives. Without that gap a reader parked
// exactly on the threshold could flicker the lines in and out.
const QUOTE_OUT = 0.26

// The hint has said its piece within the opening ticks, well before the quote
// is due.
const HINT_OUT = 0.08

// The frame only pins where its content fits inside one clipped viewport.
const PIN_FROM = '(min-width: 768px)'

const BACKDROP = '/videos/generic_yoga_video.mp4'

/* Entrances only, so quint-out throughout. 0.18s between the lines is wide by
   the standards of the rest of the site, but two lines of a spoken promise
   want the pause of a breath between them, not a stagger. */
const quoteContainer = {
  hidden: {},
  visible: { transition: { delayChildren: 0.05, staggerChildren: 0.18 } },
}

/* Each line rises out of its own clipped frame — the same gesture the hero
   wordmark uses, which is what makes this read as the brand speaking rather
   than as one more block fading up. Under reduced motion the global
   MotionConfig drops the transform and only the fade survives. */
const quoteLine = {
  hidden: { opacity: 0, y: '110%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.9, ease: EASE },
  },
}

// Set as two lines rather than one wrapped sentence: the break is the point.
const QUOTE = [
  { text: 'Live with Ease,', className: 'font-normal' },
  { text: 'Not with Disease', className: 'italic' },
]

export default function Philosophy() {
  const reduce = useReducedMotion()
  const videoRef = useRef(null)
  const wrapperRef = useRef(null)

  const [pinned, setPinned] = useState(false)
  const [quoteShown, setQuoteShown] = useState(false)

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
  // have to agree, or the quote would be driven by a progress value that no
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
      setQuoteShown((shown) => (shown ? p > QUOTE_OUT : p >= QUOTE_IN))

    // Read once up front too: a restored scroll position can land partway into
    // the section without a change ever firing.
    apply(scrollYProgress.get())
    return scrollYProgress.on('change', apply)
  }, [pinned, scrollYProgress])

  // The hint answers the opening ticks, while the frame is holding still with
  // only the heading on it. It has retired long before the quote arrives.
  const hintOpacity = useTransform(scrollYProgress, [0, HINT_OUT], [1, 0])

  /* Pinned, the quote is driven by scroll progress. Unpinned, it is an ordinary
     reveal on entering view. Never both — framer-motion lets a viewport
     gesture outrank `animate`, so passing the two together would hand the lines
     to whichever fired last. */
  const quoteTrigger = pinned
    ? { animate: quoteShown ? 'visible' : 'hidden' }
    : { whileInView: 'visible', viewport: { once: true, amount: 0.3 } }

  return (
    <section
      ref={wrapperRef}
      data-snap-section
      className="relative z-10 motion-safe:md:h-[250vh]"
    >
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
          src={BACKDROP}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        {/* ── Readability overlay ────────────────────────────────────────── */}
        {/* Weighted into the top-left corner, where the heading sits */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/80 via-black/30 to-transparent"
        />
        {/* And across the foot — leaving the middle of the frame closest to
            the photograph's own light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
        />

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto flex w-full max-w-content flex-1 flex-col gap-16">
          <RevealGroup>
            <RevealItem>
              <h2 className="max-w-md font-serif text-4xl font-normal leading-tight text-white md:text-5xl lg:text-6xl">
                What We Believe
              </h2>
            </RevealItem>
          </RevealGroup>

          {/* Held in the lower half of the frame and centred across it, which
              also puts the type where the foot gradient is strongest.

              Mounted at every stage and only faded, so it reserves its height
              from the outset and nothing shifts when it arrives.

              The line-length rule is deliberately not in play: the break is
              authored, and the measure is two short lines by construction. */}
          <motion.blockquote
            className="flex flex-1 items-end justify-center pb-16 text-center md:pb-24"
            variants={quoteContainer}
            initial="hidden"
            {...quoteTrigger}
          >
            {/* The gradients are weakest exactly here, over the lit middle of
                the frame, so the type carries its own legibility bed rather
                than asking the overlay to darken the whole photograph. */}
            <p className="font-serif text-3xl leading-[1.2] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_4px_28px_rgba(0,0,0,0.8),0_0_70px_rgba(0,0,0,0.55)] sm:text-4xl md:text-5xl">
              {QUOTE.map((line) => (
                // The clip frame carries extra depth so descenders aren't
                // shaved, then pulls it back so the line keeps its true height.
                <span
                  key={line.text}
                  className="-mb-[0.18em] block overflow-hidden pb-[0.18em]"
                >
                  <motion.span
                    variants={quoteLine}
                    className={`inline-block ${line.className}`}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </p>
          </motion.blockquote>
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
