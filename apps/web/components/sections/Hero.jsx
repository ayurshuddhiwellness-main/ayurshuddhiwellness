'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../ui/motion'
import {
  registerHero,
  skipIntro,
  advanceToNavbar,
  introWasSkipped,
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

// Backdrop stills — the whole practitioner folder. Add a photograph by adding
// its path here; the rotation length, the dots and the arrows all follow the
// array.
// Extensions are load-bearing: these resolve case-insensitively on Windows but
// byte-exactly on the Linux host, so a name that only works locally 404s in
// production. Slides 2 and 16 stay lowercase because that is the name git has
// tracked since before the .JPG re-import — checked against `git ls-files`.
const SLIDES = [
  '/images/practitioner/founder_image_1.JPG',
  '/images/practitioner/founder_image_2.jpg',
  '/images/practitioner/founder_image_3.JPG',
  '/images/practitioner/founder_image_4.JPG',
  '/images/practitioner/founder_image_5.JPG',
  '/images/practitioner/founder_image_6.JPG',
  '/images/practitioner/founder_image_7.JPG',
  '/images/practitioner/founder_image_8.JPG',
  '/images/practitioner/founder_image_9.JPG',
  '/images/practitioner/founder_image_10.JPG',
  '/images/practitioner/founder_image_11.JPG',
  '/images/practitioner/founder_image_12.JPG',
  '/images/practitioner/founder_image_13.JPG',
  '/images/practitioner/founder_image_14.JPG',
  '/images/practitioner/founder_image_15.JPG',
  '/images/practitioner/founder_image_16.jpg',
  '/images/practitioner/founder_image_17.JPG',
  '/images/practitioner/founder_image_18.JPG',
  '/images/practitioner/founder_image_19.JPG',
  '/images/practitioner/founder_image_20.JPG',
  '/images/practitioner/founder_image_21.JPG',
  '/images/practitioner/founder_image_22.JPG',
  '/images/practitioner/founder_image_23.JPG',
  '/images/practitioner/founder_image_24.JPG',
]

const SLIDE_MS = 5000
const FADE_MS = 1000

const wrap = (i) => (i + SLIDES.length) % SLIDES.length

export default function Hero() {
  const reduce = useReducedMotion()
  const phase = useIntroPhase()
  const [slide, setSlide] = useState(0)

  /* Two ways of arriving with nothing to play: motion is unwelcome, or the
     welcome has already been spent on an earlier visit. Both want the same
     thing — the mark simply already home, with no leg animated on the way.

     Read straight from the module rather than through the hook, so it is
     already true during the hydration render — the one that hands the mark
     over to the nav bar. That makes it a client-only value the server cannot
     know, so it may only ever reach a `transition`, which contributes nothing
     to rendered output. Letting it near `initial` or a variant's *state* would
     make the hydrated DOM disagree with the shipped HTML, and React does not
     patch style mismatches up. */
  const instant = reduce || introWasSkipped()

  // Tells the store a Hero exists on this route, so the sequence actually arms.
  useEffect(() => {
    registerHero()
  }, [])

  // Reduced motion: no splash, no travel — the mark starts out already parked.
  useEffect(() => {
    if (reduce) skipIntro()
  }, [reduce])

  /* Advance the backdrop. A timeout keyed on the current slide rather than one
     standing interval, so stepping by hand restarts the full 5s rather than
     inheriting whatever was left of the previous slide's turn — which is also
     what keeps the countdown ring honest. Reduced motion holds on the opening
     frame rather than cycling; the arrows and dots still work. */
  useEffect(() => {
    if (reduce || SLIDES.length < 2) return

    const id = setTimeout(() => setSlide((i) => wrap(i + 1)), SLIDE_MS)
    return () => clearTimeout(id)
  }, [reduce, slide])

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

  // Each part lifts out of its own clipped frame in sequence. With nothing to
  // play, every child resolves instantly at its final state.
  const wordmark = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: instant ? 0 : 0.15,
        staggerChildren: instant ? 0 : 0.14,
      },
    },
  }

  // Only the duration answers to `instant`: the two states have to stay exactly
  // as the server rendered them (see above).
  const word = reduce
    ? { hidden: { opacity: 1, y: '0%' }, visible: { opacity: 1, y: '0%' } }
    : {
        hidden: { opacity: 0, y: '110%' },
        visible: {
          opacity: 1,
          y: '0%',
          transition: { duration: instant ? 0 : 1.1, ease: EASE },
        },
      }

  // Once the mark leaves for the nav bar there is no dark type left to protect,
  // so the legibility bed and the accent retire with it and the footage opens up.
  const marksHere = phase !== 'navbar'

  /* Every slide sits in the viewport at once, so mounting all 24 would have
     next/image fetch the whole folder on load. Only a window is mounted: the
     current frame, its two neighbours (so the next step is already decoded and
     the fade has something to cross to), and whichever frame we just left —
     without that last one a jump from the dots would cut rather than fade. */
  const leaving = useRef(0)
  useEffect(() => {
    leaving.current = slide
  }, [slide])

  const mounted = new Set([slide, wrap(slide + 1), wrap(slide - 1), leaving.current])

  // The mark travels: full screen → hero → nav bar. It stays MOUNTED across the
  // first two, only its scale changes, so that leg is a continuous tween rather
  // than an unmount/remount (which snapped straight to the resting size before).
  // layoutId sits on the outer frame and the scale on an inner one, because
  // framer-motion drives layout animations with scale itself and the two fight
  // if combined — the nav bar leg is what layoutId is carrying.
  const mark = (
    <motion.div
      layoutId="brand-wordmark"
      transition={instant ? { duration: 0 } : TRAVEL}
    >
      <motion.div
        initial={false}
        animate={{ scale: phase === 'intro' ? SPLASH_SCALE : 1 }}
        transition={instant ? { duration: 0 } : { duration: 0.95, ease: EASE }}
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
            transition={instant ? { duration: 0 } : { duration: 0.55, ease: EASE }}
          />
        )}
      </AnimatePresence>

      {/* Exactly one viewport, clipped. At 85vh the section below used to show
          a sliver of itself under the fold from the very first frame; a full
          100vh means the hero owns the screen outright and the next section
          only exists once you have scrolled for it. */}
      <section
        data-media-backdrop
        data-snap-section
        className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-center lg:px-12"
      >
        {/* The document heading stays put even after the visible mark flies up
            to the nav bar, so the page never ends up without an h1. */}
        <h1 className="sr-only">AyurshuddhiWellness</h1>

        {/* Backdrop — full-bleed stills, crossfading and inert. Under reduced
            motion the rotation holds on the opening frame. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {SLIDES.map((src, i) =>
            mounted.has(i) ? (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                sizes="100vw"
                // The opening frame is the largest thing above the fold.
                priority={i === 0}
                className="object-cover transition-opacity ease-linear motion-reduce:transition-none"
                style={{
                  opacity: i === slide ? 1 : 0,
                  transitionDuration: `${FADE_MS}ms`,
                }}
              />
            ) : null,
          )}
        </div>

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
          transition={instant ? { duration: 0 } : { duration: 0.9, ease: EASE }}
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

        {/* ── Slideshow controls ──────────────────────────────────────────
            Held back until the splash has settled: during the intro the frame
            belongs to the wordmark alone, and there is nothing to steer yet. */}
        {phase !== 'intro' && (
          <>
            {[
              { dir: -1, label: 'Previous photograph', side: 'left-3 md:left-6', d: 'M15 19l-7-7 7-7' },
              { dir: 1, label: 'Next photograph', side: 'right-3 md:right-6', d: 'M9 5l7 7-7 7' },
            ].map((arrow) => (
              <button
                key={arrow.label}
                type="button"
                onClick={() => setSlide((i) => wrap(i + arrow.dir))}
                aria-label={arrow.label}
                className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/15 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 md:h-12 md:w-12 ${arrow.side}`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d={arrow.d} />
                </svg>
              </button>
            ))}

            {/* One dot per photograph, the current one drawn out into a bar.
                Twenty-four of them cannot each carry a 44px target on a phone,
                so the hit area is stretched vertically as far as it will go and
                the arrows stand as the full-size way through.

                Everything down here is held a nav bar's height clear of the
                foot: the section is h-screen but starts below the sticky bar,
                so its bottom edge hangs exactly h-16 past the fold and a plain
                bottom-8 would park the controls off-screen. Phones stack the
                dots above the ring, which desktop has room to sit beside. */}
            <div className="absolute bottom-36 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 md:bottom-24 md:gap-2">
              {SLIDES.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={`Show photograph ${i + 1} of ${SLIDES.length}`}
                  aria-current={i === slide}
                  className="group cursor-pointer px-0.5 py-3 focus-visible:outline-none"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-white ${
                      i === slide ? 'w-5 bg-white' : 'w-1.5 bg-white/45 group-hover:bg-white/80'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* The turn each photograph gets, drawn as it runs out. Keyed on the
                slide so it restarts from empty whenever the frame changes —
                including when a step by hand resets the timeout above.
                Nothing to count down under reduced motion, where the rotation
                is held on the opening frame. */}
            {!reduce && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-24 right-6 z-20"
              >
                <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-white/25"
                  />
                  <motion.circle
                    key={slide}
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-white"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                  />
                </svg>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
