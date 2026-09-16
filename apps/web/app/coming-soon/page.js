import SiteShell from '../../components/layout/SiteShell'
import ComingSoon from '../../components/sections/ComingSoon'

/* Where /blogs and /blogs/:slug land — see the redirects in next.config.js.

   This page was a 'use client' module, so it could not export metadata and the
   route inherited the generic site title. The animation now lives in
   components/sections/ComingSoon.jsx and this file is a server component
   again, which is what makes the title below possible. */

export const metadata = {
  title: 'Coming Soon | AyurshuddhiWellness',
  description:
    'The AyurshuddhiWellness journal is on its way — seasonal rituals, herbal wisdom and guides to mindful living, written with the same care we bring to our practice.',
}

export default function ComingSoonPage() {
  return (
    <SiteShell>
      <ComingSoon />
    </SiteShell>
  )
}
