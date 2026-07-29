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
  'absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden] motion-reduce:[backface-visibility:visible]'

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
        className={`relative aspect-[4/5] w-full cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${
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

          {/* Translucent gradient the service name sits on */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
            <h3 className="font-serif text-xl font-normal leading-snug text-white md:text-2xl">
              {title}
            </h3>

            {/* Quiet affordance — signals there is something behind the card */}
            <span
              aria-hidden="true"
              className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/50 text-white"
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

          <TapTarget
            label={`Show details for ${title}`}
            onClick={() => setFlipped(true)}
          />
        </div>

        {/* ── Back — description ─────────────────────────────────────────── */}
        <div
          className={`${FACE} flex flex-col bg-primary p-7 [transform:rotateY(180deg)] motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:[transform:none] ${
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

          <h3 className="mt-5 font-serif text-xl font-normal leading-snug text-white">
            {title}
          </h3>

          <p className="mt-3 font-sans text-sm leading-relaxed text-white/75">
            {body}
          </p>

          <AnimatedLink
            href={href}
            arrow
            className="relative z-20 mt-auto inline-flex w-fit items-center rounded-full bg-white px-5 py-3 font-sans text-sm font-medium text-primary transition-colors duration-300 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Read More
          </AnimatedLink>
        </div>
      </div>
    </div>
  )
}
