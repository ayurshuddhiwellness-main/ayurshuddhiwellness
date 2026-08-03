'use client'

import { useEffect } from 'react'
import { animate } from 'framer-motion'
import { EASE } from './motion'

/* ──────────────────────────────────────────────────────────────────────────
   Gesture-locked scrolling across the homepage's opening sections.

   CSS scroll-snap alone was not enough here. Native scrolling still ran between
   snap points, so every wheel tick painted a partial position and the snap only
   tidied up afterwards — and the Believe slide is 250vh, so crossing it took a
   dozen ticks. This takes the gesture instead: inside the locked stretch the
   wheel and touchmove are cancelled outright, and one gesture animates straight
   to the neighbouring stop.

   The stops are read from the DOM rather than hard-coded, so the section
   heights stay the single source of truth:

     0                       top of the page — the hero, whole
     believe.top             the Believe slide, pinned at its opening frame
     believe.bottom − 100vh  the far end of its 150vh pin, quote arrived

   Past that last stop the lock is simply off and the page scrolls natively —
   `inZone` is the only thing gating any of this.

   Below md the Believe slide is one viewport rather than 250vh, so its two
   stops collapse onto each other and are deduped; there the lock covers the
   hero alone.

   One gesture, one stop, in both input models:
     · A trackpad flick fires wheel events for a second or more after the
       fingers lift. `animating` swallows them for the length of the animation,
       and the QUIET window swallows the tail that outlives it — a new gesture
       has to be preceded by real silence.
     · A slow mouse wheel spaces its ticks well past QUIET, so each one is read
       as its own gesture and moves exactly one stop.
     · A touch swipe disarms itself the moment it fires, and only a fresh
       touchstart re-arms it, so a long drag cannot cascade through stops.

   Keyboard scrolling is deliberately left alone — trapping it would be an
   accessibility regression, and `destination()` is direction-based, so a
   position between stops resolves correctly anyway.
   ────────────────────────────────────────────────────────────────────────── */

// One section, one motion. The lock is released by this animation's own
// onComplete, so there is no second number to keep in step with it.
const DURATION = 0.9

// Silence that ends a gesture. Comfortably above trackpad momentum, which
// keeps firing every ~16ms and stretches to ~50ms as it decays, and comfortably
// below a deliberate second wheel tick.
const QUIET_MS = 140

// Sub-pixel trackpad noise is not a gesture.
const WHEEL_MIN = 4

// How far a finger travels before a drag counts as a swipe.
const SWIPE_MIN = 40

// Two stops that land within this of each other are the same stop.
const COLLAPSE = 8

// Treated as "settled on" a stop.
const EPS = 4

export default function SectionLock() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let stops = []
    let animating = false
    let guarding = false
    let lastInput = 0
    let releaseTimer = null
    let controls = null
    let touchY = 0
    let armed = false

    /* The guard has to outlive the animation. A trackpad flick keeps firing for
       well over a second, so its tail routinely survives a 0.9s transition — and
       if the transition ended on the last stop, the zone is already behind us,
       so those leftovers would scroll natively straight past it. The guard is
       therefore released only once the animation has finished AND the input has
       actually gone quiet; every event pushes the timer out, and onComplete
       re-arms it for the case where the animation is the last to finish. */
    const scheduleRelease = () => {
      clearTimeout(releaseTimer)
      releaseTimer = setTimeout(() => {
        if (animating) return // onComplete will schedule the next attempt
        guarding = false
      }, QUIET_MS)
    }

    const measure = () => {
      const els = [...document.querySelectorAll('[data-snap-section]')]
      if (els.length < 2) return []

      const top = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY)
      const last = els[els.length - 1]
      const limit = document.documentElement.scrollHeight - window.innerHeight

      return [0, ...els.slice(1).map(top), top(last) + last.offsetHeight - window.innerHeight]
        .map((y) => Math.max(0, Math.min(y, limit)))
        .filter((y, i, all) => i === 0 || y - all[i - 1] > COLLAPSE)
    }

    // The lock covers everything up to the final stop and nothing past it.
    const inZone = () => stops.length > 1 && window.scrollY < stops[stops.length - 1] - 2

    /* Direction-based rather than "nearest stop ± 1", so a position between
       stops — arrived at by keyboard, by a resize, or by scrolling back up from
       the free part of the page — resolves to the stop actually ahead. */
    const destination = (dir) => {
      const from = window.scrollY
      if (dir > 0) return stops.findIndex((y) => y > from + EPS)

      let prev = -1
      for (let i = 0; i < stops.length; i += 1) if (stops[i] < from - EPS) prev = i
      return prev
    }

    const go = (dir) => {
      stops = measure()
      const i = destination(dir)
      if (i === -1) return

      animating = true
      guarding = true
      controls?.stop()
      controls = animate(window.scrollY, stops[i], {
        duration: DURATION,
        ease: EASE,
        onUpdate: (y) => window.scrollTo({ top: y, behavior: 'instant' }),
        onComplete: () => {
          // Land exactly, then release. Nothing native can have moved the
          // scroller in the meantime — the handlers below swallow everything
          // for as long as `animating` holds.
          window.scrollTo({ top: stops[i], behavior: 'instant' })
          animating = false
          scheduleRelease()
        },
      })
    }

    const onWheel = (e) => {
      if (e.ctrlKey) return // pinch-zoom, not a scroll

      /* `guarding` is checked alongside the zone, not after it: a transition
         can land on the last stop, at which point the zone is already behind
         us while the gesture that caused it is still firing. */
      if (!guarding && !inZone()) return

      // Nothing native happens inside the lock, so no partial position can be
      // painted between stops.
      e.preventDefault()

      const now = performance.now()
      const quiet = now - lastInput > QUIET_MS
      lastInput = now
      if (guarding) scheduleRelease()

      if (animating || !quiet) return
      if (Math.abs(e.deltaY) < WHEEL_MIN) return

      go(Math.sign(e.deltaY))
    }

    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY
      armed = true
    }

    const onTouchMove = (e) => {
      if (!guarding && !inZone()) return
      e.preventDefault()

      lastInput = performance.now()
      if (guarding) scheduleRelease()
      if (animating || !armed) return

      const dy = touchY - e.touches[0].clientY
      if (Math.abs(dy) < SWIPE_MIN) return

      // One swipe cannot cascade — only a fresh touchstart re-arms.
      armed = false
      go(Math.sign(dy))
    }

    const onTouchEnd = () => {
      armed = false
    }

    const onResize = () => {
      stops = measure()
    }

    stops = measure()

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      controls?.stop()
      clearTimeout(releaseTimer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return null
}
