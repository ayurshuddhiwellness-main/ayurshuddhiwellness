import PageBackdrop from '../ui/PageBackdrop'
import Navbar from './Navbar'
import Footer from './Footer'

/* ──────────────────────────────────────────────────────────────────────────
   The site shell — one photograph, one bar, one footer, for every route.

   Before this existed, each page repeated the same four-line preamble by hand
   (`<Navbar /> <main>…</main> <Footer />`) and only the homepage rendered the
   backdrop, which is why every other route was a linen page with dark type
   while the landing page was a photograph. The layering is now declared once:

       backdrop  (fixed, -z-10)
         overlay (the backdrop's own scrim)
           navbar
             page content
               footer

   Note the ordering constraint this inherits: <body> carries no background on
   purpose. An in-flow block's background paints AFTER negative-z-index
   children, so an opaque body would hide the backdrop on every route at once —
   see the comment in app/layout.js before adding a bg-* there.

   `main` is not given a ground here either. Sections paint their own
   readability treatment locally (SectionScrim, panels), so that the
   photograph stays visible between and around them rather than being covered
   by one page-wide slab.
   ────────────────────────────────────────────────────────────────────────── */

export default function SiteShell({
  children,
  /* Rendered before everything, outside <main>, for overlays that must not be
     clipped by a section's overflow — the /about splash, and the homepage's
     scroll lock (which renders null but is a sibling by convention). */
  before = null,
  /* Aims the backdrop crop for this route. See PageBackdrop. */
  backdropFocus = 'center',
  /* Only for routes whose <main> genuinely needs its own box — /book sets a
     min-height and top padding because its wizard is shorter than a screen. */
  mainClassName,
}) {
  return (
    <>
      {before}
      <PageBackdrop focus={backdropFocus} />
      <Navbar />
      {/* id="main" is the navbar skip link's target. Without it that link was
          a dead fragment that only worked because its onClick handler found
          <main> by query — so it did nothing before hydration, or with JS off,
          which is exactly when a skip link matters most. */}
      <main id="main" className={mainClassName}>
        {children}
      </main>
      <Footer />
    </>
  )
}
