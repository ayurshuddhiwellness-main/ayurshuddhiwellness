'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import {
  registerHero,
  skipIntro,
  advanceToNavbar,
  useIntroPhase,
} from '../../hooks/useIntroSequence'

// One compound wordmark, two weights: the Sanskrit root set heavy, the English
// qualifier answering it in a lighter italic sage. Rendered without a space —
// the brand is a single word.
const WORDS = [
  { text: 'Ayurshuddhi', className: 'font-bold tracking-[-0.02em] text-foreground' },
  { text: 'Wellness', className: 'font-normal italic text-primary' },
]

// Shared by every phase so framer-motion can carry the mark between them.
const TRAVEL = { duration: 0.9, ease: EASE }

// How much larger the mark sits during the splash before settling. Capped by
// the narrowest breakpoint: at 375px the resting wordmark is already ~213px of
// a 327px line, so anything past ~1.27 would be clipped by the section.
const SPLASH_SCALE = 1.25

export default function Hero() {
  const reduce = useReducedMotion()
  const phase = useIntroPhase()
  const videoRef = useRef(null)

  // Tells the store a Hero exists on this route, so the sequence actually arms.
  useEffect(() => {
    registerHero()
  }, [])

  // Reduced motion: no splash, no travel — the mark starts out already parked.
  useEffect(() => {
    if (reduce) skipIntro()
  }, [reduce])

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

  // Scroll trigger: once the user scrolls past 100px, advance to the navbar
  // phase. The listener removes itself after firing once.
  useEffect(() => {
    if (reduce) return // reduced motion already skipped to navbar

    const onScroll = () => {
      if (window.scrollY > 100) {
        advanceToNavbar()
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduce])

  // Each part lifts out of its own clipped frame in sequence. Under reduced
  // motion every child resolves instantly at its final state.
  const wordmark = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduce ? 0 : 0.15,
        staggerChildren: reduce ? 0 : 0.14,
      },
    },
  }

  const word = reduce
    ? { hidden: { opacity: 1, y: '0%' }, visible: { opacity: 1, y: '0%' } }
    : {
        hidden: { opacity: 0, y: '110%' },
        visible: {
          opacity: 1,
          y: '0%',
          transition: { duration: 1.1, ease: EASE },
        },
      }

  // Once the mark leaves for the nav bar there is no dark type left to protect,
  // so the legibility bed and the accent retire with it and the footage opens up.
  const marksHere = phase !== 'navbar'

  // The mark travels: full screen → hero → nav bar. It stays MOUNTED across the
  // first two, only its scale changes, so that leg is a continuous tween rather
  // than an unmount/remount (which snapped straight to the resting size before).
  // layoutId sits on the outer frame and the scale on an inner one, because
  // framer-motion drives layout animations with scale itself and the two fight
  // if combined — the nav bar leg is what layoutId is carrying.
  const mark = (
    <motion.div
      layoutId="brand-wordmark"
      transition={reduce ? { duration: 0 } : TRAVEL}
    >
      <motion.div
        initial={false}
        animate={{ scale: phase === 'intro' ? SPLASH_SCALE : 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.95, ease: EASE }}
      >
        {/* aria-hidden: the real heading is the sr-only h1, so the travelling
            copy is never announced twice. */}
        <motion.div
          aria-hidden="true"
          variants={wordmark}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          className="whitespace-nowrap font-serif text-xl leading-[1.05] drop-shadow-[0_1px_10px_rgba(250,248,245,0.75)] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
        >
          {WORDS.map((w) => (
            // The clip frame carries extra depth so descenders aren't shaved,
            // then pulls it back so the line keeps its true height.
            <span
              key={w.text}
              className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom"
            >
              <motion.span variants={word} className={`inline-block ${w.className}`}>
                {w.text}
              </motion.span>
            </span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )

  return (
    <>
      {/* Splash backdrop — fades on its own so the mark can travel out from
          under it, rather than the whole overlay leaving as one block. */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            key="splash-backdrop"
            aria-hidden="true"
            className="fixed inset-0 z-[55] bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          />
        )}
      </AnimatePresence>

      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-center md:min-h-[85vh] lg:px-12">
        {/* The document heading stays put even after the visible mark flies up
            to the nav bar, so the page never ends up without an h1. */}
        <h1 className="sr-only">AyurshuddhiWellness</h1>

        {/* Backdrop — full-bleed loop, muted and inert. Autoplay is withheld
            under reduced motion, leaving the section background as a still
            backdrop. No poster: the referenced file never existed and 404'd
            on every load. */}
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

        {/* Depth scrim — a light cinematic vignette, weighted to the edges so
            the middle of the frame keeps the footage's own colour. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30"
        />

        {/* Localized bed — a soft linen ellipse sized to the wordmark, so the
            dark brand type has something to sit on while it is here. color-mix
            is used deliberately: bg-background/NN does NOT compile, because the
            theme colours are bare var() values with no <alpha-value> and
            Tailwind silently drops the modifier. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={false}
          animate={{ opacity: marksHere ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
          style={{
            background:
              'radial-gradient(ellipse 65% 42% at 50% 50%, color-mix(in srgb, var(--color-background) 78%, transparent) 0%, color-mix(in srgb, var(--color-background) 40%, transparent) 55%, transparent 78%)',
          }}
        />

        {/* Phases 1 and 2 both live here. During the splash this whole column
            is lifted above the backdrop — z-10 on a relative box would trap a
            raised child inside its own stacking context, so the z-index has to
            move on the column itself, not on the mark. */}
        <div
          className={`relative mx-auto flex w-full max-w-content flex-col items-center gap-8 ${
            phase === 'intro' ? 'z-[60]' : 'z-10'
          }`}
        >
          {marksHere && mark}

          {/* Accent — a sage hairline, held in the layout from the first frame
              so its arrival never nudges the mark mid-settle. */}
          {marksHere && (
            <svg
              aria-hidden="true"
              viewBox="0 0 200 1"
              preserveAspectRatio="none"
              className="mx-auto h-px w-full max-w-[13rem] text-primary"
            >
              <motion.path
                d="M0 0.5 H200"
                stroke="currentColor"
                strokeWidth="1"
                initial={false}
                animate={
                  phase === 'intro'
                    ? { pathLength: 0, opacity: 0 }
                    : { pathLength: 1, opacity: 0.45 }
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        pathLength: { duration: 1.1, ease: EASE },
                        opacity: { duration: 0.4, ease: EASE },
                      }
                }
              />
            </svg>
          )}
        </div>
      </section>
    </>
  )
}
