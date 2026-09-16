import Image from 'next/image'

/* ──────────────────────────────────────────────────────────────────────────
   The homepage's one backdrop, behind every section.

   Fixed rather than scrolled: the sections travel over a photograph that stays
   put, so the whole page reads as one frame rather than five stacked panels.
   `-z-10` puts it under everything in the body's stacking context while still
   painting over the root canvas colour, and nothing here is interactive or
   announced — it is scenery.

   NOTE: this only paints because <body> carries no background of its own. An
   in-flow block's background paints AFTER negative-z-index children, so an
   opaque body would hide this layer completely. globals.css puts the linen on
   <html>, which propagates to the canvas and sits behind everything — see the
   comment in app/layout.js before adding a bg-* there.

   The path is verbatim, including the space in the directory name (encoded, so
   the optimizer's URL survives it) and the uppercase extension. Both are
   load-bearing: the file resolves case-insensitively on Windows but
   byte-exactly on the Linux host, so a normalised name would 404 in production.

   The scrim is a light-handed DARK one, and the direction matters: the
   photograph is a bright golden-hour frame whose sky and sun flare blow out
   along the top edge, so a linen wash would only push it further toward white.
   Black deepens the greens and pulls the flare back into range instead.

   It is weighted to the top and foot of the viewport and stays out of the
   middle, where the frame is already well exposed — so the picture keeps its
   openness and only its hot edges are held down. Deliberately mild; this is a
   backdrop, not a treatment.

   The sections carry no tint of their own over this. What other legibility
   treatment exists is each section's own and predates this layer: Hero's
   radial bed under the wordmark, and Philosophy's two corner-and-foot
   gradients.
   ────────────────────────────────────────────────────────────────────────── */

const SRC = '/images/Landing%20Page/hero_background.PNG'

/* A light black tint across the whole page, a little heavier at the top and
   foot of the viewport where the photograph's sky and foreground shadow are
   strongest. It exists to hold the picture down under the copy — the sections
   with white type (Philosophy, the three services) read directly off it.

   Note the direction of the trade: darkening helps light type and works
   AGAINST the dark tokens. The sections still set in #1E2220 / #6B6B63 —
   AboutPractitioner especially — do not gain from this, and their own local
   beds are what carry them. */
const SCRIM =
  'linear-gradient(to bottom, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.34) 45%, rgba(0,0,0,0.34) 55%, rgba(0,0,0,0.46) 100%)'

/* `focus` is the one thing a page may tune. The photograph is 1536x1024 and
   every viewport crops it differently — at 390px wide a centred `cover` throws
   away most of the frame's width and lands on whatever happens to be in the
   middle. A page (or a breakpoint) can therefore aim the crop without the
   asset itself being touched, which is the only lever Part 2 asks for.

   Values are plain `object-position` strings. Default centre, which is what
   the homepage has always used and must keep. */
export default function PageBackdrop({ focus = 'center' }) {
  return (
    /* data-site-backdrop is a stable hook for the QA harness to assert the
       backdrop is actually present and painting on every route. */
    <div aria-hidden="true" data-site-backdrop className="pointer-events-none fixed inset-0 -z-10">
      <Image
        src={SRC}
        alt=""
        fill
        sizes="100vw"
        // The backdrop for the whole page, so it leads the load.
        priority
        className="object-cover"
        style={{ objectPosition: focus }}
      />
      <div className="absolute inset-0" style={{ background: SCRIM }} />
    </div>
  )
}
