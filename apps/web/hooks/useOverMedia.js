'use client'

import { useState, useEffect } from 'react'

/* True while a full-bleed photo or video section is passing under the nav bar.
   Sections opt in by carrying `data-media-backdrop`; everything else is left
   alone, so the bar only lightens where there is footage to compete with.

   Read off the elements' own rects rather than an IntersectionObserver: the
   band being tested is the top 64px of the viewport, which an observer can
   only express as a rootMargin derived from the viewport height — and so
   would have to be torn down and rebuilt on every resize. */
export function useOverMedia(navHeight = 64) {
  const [overMedia, setOverMedia] = useState(false)

  useEffect(() => {
    const read = () => {
      const els = document.querySelectorAll('[data-media-backdrop]')
      let hit = false

      for (const el of els) {
        const rect = el.getBoundingClientRect()
        if (rect.top < navHeight && rect.bottom > 0) {
          hit = true
          break
        }
      }

      setOverMedia(hit)
    }

    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read, { passive: true })

    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [navHeight])

  return overMedia
}
