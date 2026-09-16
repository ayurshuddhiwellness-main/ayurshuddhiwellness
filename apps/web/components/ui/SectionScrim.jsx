/* ──────────────────────────────────────────────────────────────────────────
   The localized readability treatment, for a section sitting over the page
   photograph.

   This is the one legibility device the site uses, and the reason it is a
   component: the alternative — which is what the codebase did before — is a
   page-wide dark slab, and that is exactly the "large opaque rectangle over a
   photograph" problem. A scrim is weighted toward the copy and feathers away
   everywhere else, so the picture keeps reading around and between the text.

   Two elements rather than one, because the gradient's direction has to follow
   the layout: columns sit side by side above md and stack below it, and a
   horizontal wash under a stacked column darkens the wrong half of the frame.

   Both are masked away at the section's own top and bottom edges, so a
   treatment never ends on a hard line where the next section begins — the
   photograph runs on underneath, uninterrupted.

   The section this sits in must be `relative`, and the content must be above
   it (`relative z-10`).

   The `left` and `right` values below are lifted VERBATIM from the shipped
   Journal and AboutPractitioner sections, which is what lets those two consume
   this without their rendering moving by a pixel.
   ────────────────────────────────────────────────────────────────────────── */

/* A radial pool does the work under the copy itself; the linear layer only
   tips the balance across the width. Deliberately no flat fill anywhere. */
const WIDE = {
  // Copy on the right (AboutPractitioner) — verbatim.
  right:
    'radial-gradient(ellipse 54% 62% at 74% 50%, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.27) 48%, transparent 78%),' +
    'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.04) 34%, rgba(0,0,0,0.17) 62%, rgba(0,0,0,0.30) 100%)',

  // Copy on the left (Journal) — verbatim, the mirror of the above.
  left:
    'radial-gradient(ellipse 50% 60% at 27% 50%, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.27) 48%, transparent 78%),' +
    'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.04) 34%, rgba(0,0,0,0.17) 62%, rgba(0,0,0,0.30) 100%)',

  /* Copy centred, for the pages whose sections are a single centred column
     (services header, coming-soon, the contact hero). One pool in the middle
     and no directional layer at all, so the frame's edges stay open. */
  center:
    'radial-gradient(ellipse 62% 64% at 50% 50%, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.26) 50%, transparent 80%)',
}

/* Stacked. The weight runs down the frame instead of across it, and where it
   is heaviest depends on where the copy lands once the columns collapse. */
const NARROW = {
  // Copy below the portrait (AboutPractitioner) — verbatim.
  right:
    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.10) 20%, rgba(0,0,0,0.40) 52%, rgba(0,0,0,0.44) 100%)',

  // Copy above the card (Journal) — verbatim.
  left: 'linear-gradient(to bottom, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.40) 46%, rgba(0,0,0,0.26) 76%, rgba(0,0,0,0.20) 100%)',

  // Centred copy reads top to bottom, so the wash is even through the middle.
  center:
    'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.44) 45%, rgba(0,0,0,0.44) 60%, rgba(0,0,0,0.34) 100%)',
}

const FEATHER = 'linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)'

export default function SectionScrim({ focus = 'center' }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{ background: NARROW[focus], maskImage: FEATHER, WebkitMaskImage: FEATHER }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ background: WIDE[focus], maskImage: FEATHER, WebkitMaskImage: FEATHER }}
      />
    </>
  )
}
