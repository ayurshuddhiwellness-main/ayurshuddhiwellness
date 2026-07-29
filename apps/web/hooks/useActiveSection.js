'use client'

import { useEffect, useState } from 'react'

/* Which homepage section is currently under the navbar.

   The nav mixes page links with in-page section links, so "which page am I on"
   is not enough to light the right item — on the homepage, About and Services
   are sections, not routes. This watches them and reports the topmost one in
   view.

   `rootMargin` discounts the 64px sticky bar at the top and the bottom 55% of
   the viewport, so a section counts as active once it reaches the upper part of
   the screen rather than the moment it peeks in from below.

   Pass a module-level constant for `ids` — a fresh array each render would
   re-run the effect on every render. */
export function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )

        // Nothing in the band means we are above the first section — the caller
        // treats null as "top of page".
        setActive(visible.length ? visible[0].target.id : null)
      },
      { rootMargin: '-64px 0px -55% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, enabled])

  return active
}
