'use client'

import { useEffect } from 'react'
import { animate } from 'framer-motion'
import { EASE } from './motion'

/* ──────────────────────────────────────────────────────────────────────────
   Gesture-locked scrolling across the whole homepage.

   CSS scroll-snap alone was not enough here. Native scrolling still ran between
   snap points, so every wheel tick painted a partial position and the snap only
   tidied up afterwards — and the Believe slide is 250vh, so crossing it took a
   dozen ticks. This takes the gesture instead: inside the locked stretch the
   wheel, touchmove and the scrolling keys are cancelled outright, and one
   gesture animates straight to the neighbouring stop.

   The stops are read from the DOM rather than hard-coded, so the section
   heights stay the single source of truth. Each `[data-snap-section]` yields:

     · its top — the section, whole, filling the viewport
     · its bottom edge aligned to the foot of the viewport, but ONLY if the
       section is taller than one viewport

   That second stop is what makes an over-tall section safe. The Believe slide
   is 250vh by design, and any section can outgrow a short laptop viewport once
   its content is long enough — in both cases a single stop would strand the
   reader mid-section, and stepping a whole viewport past the top would leave a
   seam. Bottom-aligning puts the section's own bottom edge exactly on the fold,
   so the next section is flush below it and never half-shown.

   A final stop sits at the foot of the document, which is what puts the footer
   on screen. Past that last stop the lock is simply off — `inZone` is the only
   thing gating any of this, and the last stop now being the document foot is
   what extends the lock across the whole page rather than the opening two
   sections it used to cover.

   Stops that land closer together than COLLAPSE_RATIO of a viewport are
   deduped, so below md — where the Believe slide is one viewport rather than
   250vh — its pair collapses back to one on its own, and a section that
   overflows by only a few dozen pixels never earns a stop too small to be
   worth travelling.

   One gesture, one stop, in every input model:
     · A trackpad flick fires wheel events for a second or more after the
       fingers lift. `animating` swallows them for the length of the animation,
       and the QUIET window swallows the tail that outlives it — a new gesture
       has to be preceded by real silence.
     · A slow mouse wheel spaces its ticks well past QUIET, so each one is read
       as its own gesture and moves exactly one stop.
     · A touch swipe disarms itself the moment it fires, and only a fresh
       touchstart re-arms it, so a long drag cannot cascade through stops.
     · The scrolling keys go through the same quiet gate, so a held arrow walks
       one section per transition instead of running away. They are only taken
       when focus is somewhere that does not want them — never inside an input,
       a textarea, a select or a contenteditable, where the arrows and the space
       bar belong to the field. Home and End jump to the first and last stop.

   Reduced motion turns the whole thing off and hands scrolling back to the
   browser, live: the media query is subscribed to rather than read once, so
   toggling the OS setting takes effect without a reload. That matches how the
   rest of the site treats the preference — MotionProvider's
   `reducedMotion="user"` and the `motion-safe:` heights on the sections
   themselves — so under that setting the page is an ordinary document that
   scrolls freely and every section sizes to its content.
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

/* Two stops closer together than this are the same stop, as a fraction of the
   viewport. It is not a rounding tolerance — it is the smallest step worth
   making the page take. A section that overflows its viewport by a little (a
   long bio pushing 35px past the fold on a 900px screen) would otherwise earn
   a second, bottom-aligned stop 35px below the first, and the page would take
   a visible hiccup to travel it. Below the threshold the pair merges and the
   overspill — padding, by construction, since the content is centred — simply
   sits under the fold. Above it the step is a real one worth taking: the
   Believe slide's 150vh pin clears this by an order of magnitude, and below md,
   where that slide is a single viewport, its pair collapses here as it should. */
const COLLAPSE_RATIO = 0.12

// Treated as "settled on" a stop.
const EPS = 4

// The keys that scroll. Space is handled separately — shift reverses it.
const KEY_DIR = {
  PageDown: 1,
  PageUp: -1,
  ArrowDown: 1,
  ArrowUp: -1,
}

// Fields own their own arrows, space bar and page keys.
const ownsKeys = (el) =>
  !!el &&
  (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

export default function SectionLock() {
  useEffect(() => {
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let stops = []
    let locked = !reduceQuery.matches
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
      if (!els.length) return []

      const vh = window.innerHeight
      const collapse = Math.round(vh * COLLAPSE_RATIO)
      const limit = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )

      const out = [0]

      els.forEach((el, idx) => {
        const top = Math.round(el.getBoundingClientRect().top + window.scrollY)
        /* The first section's own top is NOT a stop. The sticky bar sits above
           it in flow, so that top is the bar's height rather than 0 — emitting
           it would put a 64px micro-step between the document top and the
           first real transition. The document top is that section's stop. */
        if (idx > 0) out.push(top)
        // Only a section that does not fit needs somewhere else to stop.
        if (el.offsetHeight > vh + collapse) {
          out.push(top + el.offsetHeight - vh)
        }
      })

      // The foot of the document — the stop that shows the footer.
      out.push(limit)

      return out
        .map((y) => Math.max(0, Math.min(y, limit)))
        .sort((a, b) => a - b)
        .filter((y, i, all) => i === 0 || y - all[i - 1] > collapse)
    }

    // The lock covers everything up to the final stop and nothing past it.
    const inZone = () =>
      stops.length > 1 && window.scrollY < stops[stops.length - 1] - 2

    /* Direction-based rather than "nearest stop ± 1", so a position between
       stops — arrived at by a `/#about` hash jump, by a resize, or by a
       focus-driven scroll — resolves to the stop actually ahead. */
    const destination = (dir) => {
      const from = window.scrollY
      if (dir > 0) return stops.findIndex((y) => y > from + EPS)

      let prev = -1
      for (let i = 0; i < stops.length; i += 1) if (stops[i] < from - EPS) prev = i
      return prev
    }

    const runTo = (i) => {
      if (i == null || i < 0 || stops[i] === undefined) return

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

    const go = (dir) => {
      stops = measure()
      const i = destination(dir)
      if (i === -1) return
      runTo(i)
    }

    const goToEnd = (which) => {
      stops = measure()
      if (stops.length < 2) return
      runTo(which === 'start' ? 0 : stops.length - 1)
    }

    const onWheel = (e) => {
      if (!locked) return
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

    const onKeyDown = (e) => {
      if (!locked) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (ownsKeys(e.target) || ownsKeys(document.activeElement)) return
      if (!guarding && !inZone()) return

      const space = e.key === ' ' || e.key === 'Spacebar'
      const dir = space ? (e.shiftKey ? -1 : 1) : KEY_DIR[e.key]
      const jump = e.key === 'Home' ? 'start' : e.key === 'End' ? 'end' : null
      if (!dir && !jump) return

      // Shift only reverses the space bar; on the others it is a selection
      // modifier and none of this should run.
      if (dir && e.shiftKey && !space) return

      e.preventDefault()

      const now = performance.now()
      const quiet = now - lastInput > QUIET_MS
      lastInput = now
      if (guarding) scheduleRelease()

      // A held key repeats every few frames; the quiet gate turns that into one
      // section per transition rather than a run down the page.
      if (animating || !quiet) return

      if (jump) goToEnd(jump)
      else go(dir)
    }

    const onTouchStart = (e) => {
      if (!locked) return
      touchY = e.touches[0].clientY
      armed = true
    }

    const onTouchMove = (e) => {
      if (!locked) return
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

    /* Live, not read once: toggling the OS setting hands scrolling straight
       back to the browser without a reload. Anything mid-flight is dropped so
       the page is not left animating under a preference that just said not to. */
    const onReduceChange = () => {
      locked = !reduceQuery.matches
      if (locked) {
        stops = measure()
        return
      }
      controls?.stop()
      clearTimeout(releaseTimer)
      animating = false
      guarding = false
    }

    stops = measure()

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('resize', onResize)
    reduceQuery.addEventListener('change', onReduceChange)

    return () => {
      controls?.stop()
      clearTimeout(releaseTimer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
      reduceQuery.removeEventListener('change', onReduceChange)
    }
  }, [])

  return null
}
