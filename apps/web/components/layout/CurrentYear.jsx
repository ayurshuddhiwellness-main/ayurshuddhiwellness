'use client'

import { useState, useEffect } from 'react'

/* The copyright year, corrected after mount.

   Footer is a server component on statically prerendered pages, so
   `new Date().getFullYear()` there is evaluated once at BUILD time and then
   frozen — a site built in December still says the old year in January.

   `initial` is that build-time year, so the server HTML and the first client
   render agree and hydration is clean; the effect then replaces it with the
   reader's actual year. Kept as its own client island rather than marking
   Footer 'use client', which would ship the whole footer to the browser to
   fix four digits. */
export default function CurrentYear({ initial }) {
  const [year, setYear] = useState(initial)

  useEffect(() => {
    const now = new Date().getFullYear()
    if (now !== initial) setYear(now)
  }, [initial])

  return <>{year}</>
}
