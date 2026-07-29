'use client'

import { useSyncExternalStore } from 'react'

/* ──────────────────────────────────────────────────────
   Gate for the /about splash.

   AboutIntro covers the viewport for HOLD_MS. Without this, AboutHero's
   reveal would play underneath the panel and already be settled by the time
   it lifts — so the hero waits on `done` instead of animating on mount.

   Kept separate from useIntroSequence on purpose: that store is built around
   a Hero registering itself and handing a layoutId to the Navbar, and it
   short-circuits to 'navbar' on precisely the Hero-less routes /about is one
   of. Two sequences, two stores, two sessionStorage keys.
   ────────────────────────────────────────────────────── */

export const HOLD_MS = 1500
const SEEN_KEY = 'as-about-intro-seen'

let done = false
let introPresent = false
const listeners = new Set()

export function finishAboutIntro() {
  if (done) return
  done = true
  listeners.forEach((notify) => notify())
}

// Tells the store a splash exists on this route, so the hero knows to wait
// for it rather than releasing itself on the next frame.
export function registerAboutIntro() {
  introPresent = true
}

// Failsafe for a route that renders the hero without the splash: if nothing
// checked in during this commit's effect pass, release the hero immediately.
export function releaseIfNoIntro() {
  if (!introPresent) finishAboutIntro()
}

export function aboutIntroSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    // Storage unavailable (privacy mode) — the splash simply replays.
    return false
  }
}

export function markAboutIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Same as above — nothing to recover from.
  }
}

function subscribe(notify) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

const getSnapshot = () => done

// The server has no storage and no timers, so it renders the pre-splash frame.
const getServerSnapshot = () => false

export function useAboutIntroDone() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
