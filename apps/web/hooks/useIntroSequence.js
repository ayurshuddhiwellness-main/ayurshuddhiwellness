'use client'

import { useSyncExternalStore } from 'react'

/* ──────────────────────────────────────────────────────
   Drives the load sequence shared by Hero and Navbar.

     'intro'  0s–1.5s   logo + wordmark full screen
     'hero'   1.5s+     settled over the background video
     'navbar' scroll    logo parked in the nav bar (scroll-triggered)

   Hero and Navbar are siblings with no common ancestor, but a layoutId
   handoff tears if they disagree for even one frame — so the phase lives
   in one module-level store both read through useSyncExternalStore,
   guaranteeing they re-render from the same snapshot.
   ────────────────────────────────────────────────────── */

export const POP_MS = 1500

/* The sequence plays on every fresh document load. It is deliberately NOT
   persisted: a stored "already seen" flag spent the welcome on the first load
   a browser ever made and then suppressed it forever after, which is
   indistinguishable from the animation being broken.

   What must not replay is a client-side route change — /about and back is not
   a fresh load. That falls out of this state living at module scope: it
   survives navigation within a page instance and is only re-evaluated by a
   real document load. */
let phase = 'intro'
let heroPresent = false
let started = false
let timers = []
const listeners = new Set()

function set(next) {
  if (phase === next) return
  phase = next
  listeners.forEach((notify) => notify())
}

function clear() {
  timers.forEach(clearTimeout)
  timers = []
}

/* Routes without a Hero (/about, /services…) must not sit on an empty nav slot
   indefinitely, so the sequence only arms itself once a Hero has had the chance
   to check in. Subscribing runs ahead of Hero's registering effect in the same
   commit, so the decision is deferred to the end of that pass.

   A timeout, not requestAnimationFrame: frames are not produced while the
   document is hidden, so a page opened in a background tab (⌘-click, session
   restore, a window opened behind another) never armed at all. Nothing was
   pending to recover it either, so the visitor switched to the tab and found
   the opaque splash covering the page for good. Timers still fire when hidden,
   so the sequence now always runs to completion. */
function start() {
  if (started) return
  started = true

  timers.push(
    setTimeout(() => {
      if (!heroPresent) {
        set('navbar')
        return
      }
      // Only the intro → hero leg is time-based.
      // hero → navbar is scroll-driven (see advanceToNavbar).
      timers.push(setTimeout(() => set('hero'), POP_MS))
    }, 0),
  )
}

export function registerHero() {
  heroPresent = true
}

/* Called by Hero.jsx when the user scrolls past the threshold. clear() is what
   makes scrolling out during the splash safe: it cancels the arming timeout as
   well as the settle, so nothing left over can fire afterwards and walk the
   mark back out of the nav bar it has just flown into. */
export function advanceToNavbar() {
  if (phase === 'navbar') return
  clear()
  set('navbar')
}

// Reduced motion: no splash, no travel — the logo is simply already home.
export function skipIntro() {
  clear()
  started = true
  set('navbar')
}

function subscribe(notify) {
  listeners.add(notify)
  start()
  return () => listeners.delete(notify)
}

const getSnapshot = () => phase

// The server has no timers, so it renders the first frame of the sequence —
// which is also where the client starts, so hydration agrees by construction.
const getServerSnapshot = () => 'intro'

export function useIntroPhase() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
