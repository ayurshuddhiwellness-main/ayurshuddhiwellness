/* ──────────────────────────────────────────────────────────────────────────
   The site's surface, type and control vocabulary, for content sitting over
   the page photograph.

   Plain exported strings rather than components, which is how this codebase
   already shares presentation (FACE/GLASS in ServiceCard, EASE in motion.js).
   Nothing here is a wrapper — callers compose with template literals — so no
   element is forced into a shape it does not want.

   Every value is lifted from the shipped homepage, which is the reference
   implementation. Changing one here changes it everywhere, which is the point.

   ── The alpha trap ────────────────────────────────────────────────────────
   The theme colours (background, foreground, primary, muted, border, card) are
   bare var() values with NO <alpha-value> channel. Tailwind therefore drops
   the /opacity modifier on them silently: `bg-primary/10` renders FULLY
   OPAQUE, `bg-background/55` renders nothing. Every translucent value below
   is consequently either a real Tailwind colour (white/black, which do carry
   an alpha channel) or an explicit color-mix(). Do not "simplify" any of
   these into /alpha on a theme token.
   ────────────────────────────────────────────────────────────────────────── */

/* ── Surfaces ──────────────────────────────────────────────────────────────
   One panel, translucent, so the photograph still reads through it. Deep pine
   at the same tint the nav bar's veil uses, so every translucent surface on
   the site is obviously the same material.

   PANEL_BG is a style value, not a class, because color-mix with a literal hex
   cannot be expressed as a theme token. Apply as style={{ background: PANEL_BG }}. */
export const PANEL =
  'rounded-2xl border border-white/20 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)] backdrop-blur-[2px]'
export const PANEL_BG = 'color-mix(in srgb, #16302E 48%, transparent)'

/* A quieter panel for surfaces that sit INSIDE another panel, or that tile in
   a grid where six of the heavier one would stack into a wall. */
export const PANEL_SOFT = 'rounded-2xl border border-white/15 backdrop-blur-[2px]'
export const PANEL_SOFT_BG = 'color-mix(in srgb, #16302E 34%, transparent)'

/* The readability exception. Near-solid warm linen, for content that genuinely
   cannot sit on a photograph — form fields, where a translucent ground fights
   the text being typed into it. Used sparingly and never full-bleed; the
   background must still read around it. */
export const PANEL_CREAM =
  'rounded-2xl border border-white/25 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)]'
export const PANEL_CREAM_BG = 'color-mix(in srgb, var(--color-background) 94%, transparent)'

/* ── Type ──────────────────────────────────────────────────────────────────
   The text-shadow is not decoration: it is what keeps small type legible where
   the photograph behind it is busy, and it lets the scrims stay light. */
export const EYEBROW = 'font-sans text-xs uppercase tracking-[0.25em] text-white/75 sm:text-sm'

export const HEADING =
  'font-serif font-normal leading-tight text-background [text-shadow:0_1px_3px_rgba(0,0,0,0.5),0_6px_30px_rgba(0,0,0,0.45)]'

export const BODY =
  'font-sans leading-relaxed text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]'

// On a cream panel the palette inverts back to the dark tokens.
export const EYEBROW_ON_CREAM = 'font-sans text-xs uppercase tracking-[0.25em] text-primary'
export const HEADING_ON_CREAM = 'font-serif font-normal leading-tight text-foreground'
export const BODY_ON_CREAM = 'font-sans leading-relaxed text-muted'

/* ── Controls ──────────────────────────────────────────────────────────────
   One focus ring for everything over the photograph. The linen ring-offset
   used on the old light pages is invisible here, so the offset goes
   transparent and the ring goes white. */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

export const FOCUS_RING_ON_CREAM =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/* Primary: the one filled element in a composition. The ring and cast shadow
   lift it off the picture rather than letting it sink into it. */
export const BTN_PRIMARY = `inline-flex items-center rounded-full bg-primary px-8 py-3.5 font-sans text-sm font-medium text-white shadow-[0_14px_34px_-14px_rgba(0,0,0,0.75)] ring-1 ring-white/15 transition-colors duration-300 hover:bg-primary-hover ${FOCUS_RING}`

/* Secondary: an outline and nothing else, so the filled button beside it is
   unambiguously the thing to press. Matches the header's Login. */
export const BTN_SECONDARY = `inline-flex items-center rounded-full border border-white/35 px-7 py-3 font-sans text-sm font-medium text-white transition-[color,background-color,border-color] duration-300 hover:border-white/60 hover:bg-white/15 ${FOCUS_RING}`

/* Tertiary: an underlined text link, for the action inside a card where even
   an outlined pill would be too loud. */
export const LINK = `inline-flex items-center rounded-sm font-sans text-sm text-white/85 underline underline-offset-4 transition-colors duration-300 hover:text-white ${FOCUS_RING}`

/* Labels, not controls — translucent, hairline, type a shade off white. They
   must stay a clear step below the primary action. */
export const PILL =
  'rounded-full border border-white/25 bg-white/10 px-4 py-2 font-sans text-xs tracking-wide text-white/90 backdrop-blur-[2px] transition-colors duration-300 hover:border-white/40 hover:bg-white/15'

/* ── Rhythm ────────────────────────────────────────────────────────────────
   The section box every page repeats by hand. `relative` is load-bearing:
   SectionScrim positions against it. */
export const SECTION = 'relative px-6 py-24 lg:px-12 lg:py-32'
export const CONTENT = 'relative z-10 mx-auto w-full max-w-content'
