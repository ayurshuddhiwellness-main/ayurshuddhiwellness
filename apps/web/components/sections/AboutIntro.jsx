'use client'

import { useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '../ui/motion'
import {
  HOLD_MS,
  aboutIntroSeen,
  finishAboutIntro,
  markAboutIntroSeen,
  registerAboutIntro,
} from '../../hooks/useAboutIntro'

/* The /about counterpart to the homepage splash. See hooks/useAboutIntro for
   why this owns its own store rather than joining useIntroSequence. */

// Same two-weight compound treatment as the brand wordmark: the noun set
// heavy, the qualifier answering it in lighter italic sage.
const WORDS = [
  {
    text: 'About',
    className: 'mr-[0.2em] font-bold tracking-[-0.02em] text-foreground',
  },
  { text: 'us', className: 'font-normal italic text-primary' },
]

export default function AboutIntro() {
  // Server and first client render both say `true`, so hydration matches. The
  // layout effect settles it before the browser paints, so a visitor who has
  // already seen the splash never gets a flash of the panel.
  const [playing, setPlaying] = useState(true)

  useLayoutEffect(() => {
    registerAboutIntro()

    // Read the media query directly rather than useReducedMotion(): that hook
    // seeds itself from React state and can disagree with the DOM on this
    // first pass — the one pass that decides whether we play at all.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (aboutIntroSeen() || reduce) {
      setPlaying(false)
      finishAboutIntro()
      return
    }

    markAboutIntroSeen()

    // Release the hero as the panel begins to lift, so its reveal rides out
    // from under the fade rather than starting on an empty screen.
    const timer = setTimeout(() => {
      setPlaying(false)
      finishAboutIntro()
    }, HOLD_MS)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="about-splash"
          aria-hidden="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* The mark drifts up as the panel fades, so the exit reads as two
              parts rather than one flat dissolve. */}
          <motion.div
            className="flex flex-col items-center gap-7"
            exit={{ y: -24 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="whitespace-nowrap font-serif text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              {WORDS.map((w, i) => (
                <span
                  key={w.text}
                  className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom"
                >
                  <motion.span
                    className={`inline-block ${w.className}`}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{
                      duration: 1,
                      ease: EASE,
                      delay: 0.1 + i * 0.13,
                    }}
                  >
                    {w.text}
                  </motion.span>
                </span>
              ))}
            </div>

            {/* Sage hairline, drawn — the same accent the hero settles onto. */}
            <svg
              viewBox="0 0 200 1"
              preserveAspectRatio="none"
              className="h-px w-full max-w-[11rem] text-primary"
            >
              <motion.path
                d="M0 0.5 H200"
                stroke="currentColor"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{
                  pathLength: { duration: 1.1, ease: EASE, delay: 0.35 },
                  opacity: { duration: 0.4, ease: EASE, delay: 0.35 },
                }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
