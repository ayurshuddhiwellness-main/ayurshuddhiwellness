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

// Routes without a Hero (/about, /services…) must not sit on an empty nav
// slot indefinitely, so the sequence only arms itself if a Hero checked
// in during this commit's effect pass — one frame is ample.
function start() {
  if (started) return
  started = true

  requestAnimationFrame(() => {
    if (!heroPresent) {
      set('navbar')
      return
    }
    // Only the intro → hero leg is time-based.
    // hero → navbar is scroll-driven (see advanceToNavbar).
    timers.push(setTimeout(() => set('hero'), POP_MS))
  })
}

export function registerHero() {
  heroPresent = true
}

// Called by Hero.jsx when the user scrolls past the threshold.
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

// The server has no timers, so it renders the first frame of the sequence.
const getServerSnapshot = () => 'intro'

export function useIntroPhase() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
