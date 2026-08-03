'use client'

import { useState } from 'react'
import Image from 'next/image'
import AnimatedLink from './AnimatedLink'

/* ──────────────────────────────────────────────────────────────────────────
   Image-cover service card.

   The photograph fills the front face; a translucent gradient at the bottom
   carries the service name. Hovering (mouse), tapping (touch) or tabbing into
   the card (keyboard) turns it to a sage back face holding the description and
   a Read More link.

   The flip is CSS rather than framer-motion so `prefers-reduced-motion` is
   handled by Tailwind's `motion-reduce:` variant. `useReducedMotion()` reads
   false during SSR and the first client render, so branching rendered output
   on it would strand the card mid-turn on hydration. Under reduced motion the
   card doesn't rotate at all — the back face cross-fades over the front.

   Colour note: this project's semantic tokens are plain `var(--color-*)`
   values, which Tailwind 3.4 can't alpha-composite — `bg-primary/40` compiles
   to nothing. So the gradient is built from `black`, matching the existing
   `text-white/70` usage elsewhere in the codebase.
   ────────────────────────────────────────────────────────────────────────── */

const FACE =
  'absolute inset-0 overflow-hidden rounded-2xl [-webkit-backface-visibility:hidden] [backface-visibility:hidden] motion-reduce:[-webkit-backface-visibility:visible] motion-reduce:[backface-visibility:visible]'

/* Carried by the label element itself, not only by the face around it.
   backface-visibility is per-element and does not inherit: a face left at the
   default `transform-style: flat` flattens everything nested in it into one
   plane, and the property is ignored on the way down. The label face below
   therefore preserves 3D — which also means it cannot clip with overflow,
   since any overflow other than visible forces the style back to flat. The
   gradient rounds its own bottom corners instead. */
const HIDE_ON_TURN =
  '[-webkit-backface-visibility:hidden] [backface-visibility:hidden]'

/* Frosted sage for the turned face, in place of the flat primary fill.

   The tint alone is nowhere near enough to carry the type. What sits behind the
   card is the section's white, so sage at 0.65 composites to about
   rgb(130,150,141): 3.1:1 for white, and only 2.4:1 for the muted body copy.
   The flat black wash rides with the tint to fix that — at 0.30 the title and
   icon land at 5.7:1 and the body (lifted to /85) at 4.6:1, with about a
   quarter of the backdrop still coming through, so it reads as darkened glass
   rather than a solid panel.

   Written out rather than composed from the theme token: `--color-primary` is a
   bare var() with no <alpha-value>, so `bg-primary/65` compiles to nothing (the
   same trap the color-mix fills elsewhere work around). */
const GLASS = {
  backgroundColor: 'rgba(63, 94, 80, 0.65)',
  backgroundImage: 'linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.30))',
  backdropFilter: 'blur(16px) saturate(150%)',
  WebkitBackdropFilter: 'blur(16px) saturate(150%)',
}

// Full-bleed tap target for touch devices only. Mice flip on hover and
// keyboards flip on focus, so neither needs the extra tab stop.
function TapTarget({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white [@media(hover:hover)]:hidden"
    >
      <span className="sr-only">{label}</span>
    </button>
  )
}

export default function ServiceCard({
  title,
  body,
  image,
  alt,
  icon,
  href,
  priority = false,
  // Most photographs are cropped to fill the aperture. Small or wide source
  // images that blow up badly under `cover` can opt into `object-contain`.
  imageFit = 'object-cover',
}) {
  const [flipped, setFlipped] = useState(false)

  // Touch pointers fire enter/leave as well, which would leave the card stuck
  // turned after a tap — so only a mouse drives the hover state.
  const handleEnter = (e) => {
    if (e.pointerType === 'mouse') setFlipped(true)
  }
  const handleLeave = (e) => {
    if (e.pointerType === 'mouse') setFlipped(false)
  }

  // React's focus/blur bubble, so this behaves like :focus-within — tabbing to
  // the Read More link on the hidden face turns the card to reveal it.
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFlipped(false)
  }

  return (
    <div
      className="[perspective:1400px]"
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onFocus={() => setFlipped(true)}
      onBlur={handleBlur}
    >
      <div
        /* A fixed height rather than an aspect ratio: the card is as short as
           its turned face allows (40px icon, title, two clamped lines, the
           button — about 210px inside p-5) and takes whatever width its grid
           track gives it. An aspect ratio would have tied height back to width
           and stretched the card again on the wider tracks. */
        className={`relative h-64 w-full cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${
          flipped
            ? '[transform:rotateY(180deg)] motion-reduce:[transform:none]'
            : ''
        }`}
      >
        {/* ── Front — photograph ─────────────────────────────────────────── */}
        <div
          className={`${FACE} bg-card ${flipped ? 'pointer-events-none' : ''}`}
        >
          {/* A contained image leaves bare card behind it, which reads as a
              hard seam where the photo stops. Fill that with a blurred,
              over-scaled copy so the card still runs edge to edge. */}
          {imageFit.includes('object-contain') && (
            <Image
              src={image}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 46vw, 92vw"
              className="scale-110 object-cover blur-2xl"
            />
          )}

          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 46vw, 92vw"
            priority={priority}
            className={imageFit}
          />

          <TapTarget
            label={`Show details for ${title}`}
            onClick={() => setFlipped(true)}
          />
        </div>

        {/* ── Front label — the service name, on its own face ───────────────
            Lifted out of the photograph's face rather than nested inside it.
            `backface-visibility` only does anything to an element that is
            itself in a 3D rendering context, and the face above is the default
            `transform-style: flat`, so anything nested in it is flattened into
            it and the property is ignored on the way down. As a direct child of
            the preserve-3d card, this gets culled on its own — which is what
            lets the name go while the photograph behind it keeps bleeding
            faintly through the glass.

            The turn is the only thing that hides it. An opacity switch used to
            ride along as insurance, but the flip eases on a quint-out: by the
            350ms it waited, the card was already ~97% turned, so it held the
            name visible across nearly the whole rotation and then popped it
            out. Nothing here now competes with the transform. */}
        <div
          aria-hidden={flipped ? 'true' : undefined}
          className={`pointer-events-none absolute inset-0 rounded-2xl [transform-style:preserve-3d] ${HIDE_ON_TURN} motion-reduce:transition-opacity motion-reduce:duration-200 ${
            /* Reduced motion never rotates — the glass back simply fades in
               over this, and it is translucent, so the name would read straight
               through it. No transform to rely on there, so that one path still
               has to be told. */
            flipped ? 'motion-reduce:opacity-0' : ''
          }`}
        >
          {/* Translucent gradient the service name sits on */}
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 h-3/5 rounded-b-2xl bg-gradient-to-t from-black/85 via-black/45 to-transparent ${HIDE_ON_TURN}`}
          />

          <div
            className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 ${HIDE_ON_TURN}`}
          >
            <h3
              className={`font-serif text-xl font-normal leading-snug text-white ${HIDE_ON_TURN}`}
            >
              {title}
            </h3>

            {/* Quiet affordance — signals there is something behind the card */}
            <span
              aria-hidden="true"
              className={`mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/50 text-white ${HIDE_ON_TURN}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </div>
        </div>

        {/* ── Back — description ─────────────────────────────────────────── */}
        <div
          style={GLASS}
          className={`${FACE} flex flex-col p-5 [transform:rotateY(180deg)] motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:[transform:none] ${
            flipped
              ? 'motion-reduce:opacity-100'
              : 'pointer-events-none motion-reduce:opacity-0'
          }`}
        >
          <TapTarget
            label={`Hide details for ${title}`}
            onClick={() => setFlipped(false)}
          />

          <div className="text-white">{icon}</div>

          <h3 className="mt-4 font-serif text-xl font-normal leading-snug text-white">
            {title}
          </h3>

          {/* Clamped to two lines. The full description is the service's own
              page, which the button below goes to. */}
          <p className="mt-2 line-clamp-2 font-sans text-sm leading-relaxed text-white/85">
            {body}
          </p>

          <AnimatedLink
            href={href}
            arrow
            className="relative z-20 mt-auto inline-flex w-fit items-center rounded-full bg-white px-4 py-2.5 font-sans text-sm font-medium text-primary transition-colors duration-300 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Read More
          </AnimatedLink>
        </div>
      </div>
    </div>
  )
}
