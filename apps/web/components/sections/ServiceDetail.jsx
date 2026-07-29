'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { RevealGroup, RevealItem } from '../ui/Reveal'
import { EASE } from '../ui/motion'
import MaskReveal from '../ui/MaskReveal'
import AnimatedLink from '../ui/AnimatedLink'

/* Detail page for one service.

   The hero deliberately repeats the grid card's treatment — photograph, the
   same bottom gradient, the title sitting on it — so the page reads as the
   card opening rather than as a separate destination.

   Note the hero uses plain `object-cover`, never the card's `imageFit`: those
   values are tuned for the 4:5 aperture on the grid and are wrong for a wide
   band. As in the cards, `reduce` varies only the transition, never `initial`
   or the rendered structure. */
export default function ServiceDetail({ service }) {
  const reduce = useReducedMotion()

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-card">
        <Image
          src={service.image}
          alt={service.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-content px-6 pb-14 lg:px-12">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 0.1 }
              }
              className="mb-5 font-sans text-sm uppercase tracking-[0.25em] text-white/70"
            >
              Our Services
            </motion.p>

            <h1 className="max-w-3xl font-serif text-4xl font-normal leading-[1.1] text-white md:text-6xl">
              <MaskReveal trigger="mount" reduce={reduce} duration={0.95} delay={0.2}>
                {service.title}
              </MaskReveal>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Intro ──────────────────────────────────────────────────────── */}
      <section className="bg-background px-6 py-20 lg:px-12 lg:py-24">
        <RevealGroup className="mx-auto max-w-content">
          <RevealItem>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              >
                &larr;
              </span>
              All services
            </Link>
          </RevealItem>

          <RevealItem className="mt-8">
            <p className="max-w-2xl font-serif text-2xl font-normal leading-snug text-foreground md:text-3xl">
              {service.intro}
            </p>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ── What the treatment involves ────────────────────────────────── */}
      <section className="relative z-10 overflow-x-hidden rounded-t-[2.5rem] bg-card px-6 py-24 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.08)] lg:px-12 lg:py-28">
        <RevealGroup className="mx-auto max-w-content">
          <RevealItem>
            <p className="mb-4 font-sans text-sm uppercase tracking-[0.25em] text-primary">
              What It Involves
            </p>
          </RevealItem>
          <h2 className="font-serif text-4xl font-normal leading-tight text-foreground md:text-5xl">
            <MaskReveal reduce={reduce}>How we work with you</MaskReveal>
          </h2>
        </RevealGroup>

        <RevealGroup className="mx-auto mt-14 grid max-w-content grid-cols-1 items-start gap-8 md:mt-16 md:grid-cols-2">
          {service.components.map((c, i) => (
            <RevealItem key={c.title}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-background p-8 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-soft motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                {/* Ghost numeral — decorative, settles in behind the content */}
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 0.07, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 1.1, ease: EASE, delay: 0.15 }
                  }
                  className="pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[7rem] leading-none text-primary"
                >
                  {String(i + 1).padStart(2, '0')}
                </motion.span>

                <div className="relative">
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </p>

                  <h3 className="mt-3 font-serif text-2xl font-normal leading-snug text-foreground">
                    <MaskReveal reduce={reduce} duration={0.8} delay={0.1}>
                      {c.title}
                    </MaskReveal>
                  </h3>

                  <p className="mt-3 font-sans text-base leading-relaxed text-muted">
                    {c.body}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Conditions this treatment addresses — only some services list them */}
        {service.conditions && (
          <RevealGroup className="mx-auto mt-16 max-w-content">
            <RevealItem>
              <p className="font-sans text-sm uppercase tracking-[0.25em] text-primary">
                Commonly Treated
              </p>
            </RevealItem>
            <RevealItem className="mt-6">
              <ul className="flex flex-wrap gap-3">
                {service.conditions.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border bg-background px-4 py-1.5 font-sans text-sm tracking-wide text-foreground"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </RevealItem>
          </RevealGroup>
        )}
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-primary px-6 py-24 lg:px-12 lg:py-28">
        <RevealGroup className="mx-auto max-w-content text-center">
          <RevealItem>
            <p className="mb-5 font-sans text-sm uppercase tracking-[0.25em] text-white/60">
              Begin Your Journey
            </p>
          </RevealItem>

          <h2 className="font-serif text-4xl font-normal leading-tight text-white md:text-5xl">
            <MaskReveal reduce={reduce}>Ready to start?</MaskReveal>
          </h2>

          <RevealItem className="mt-5">
            <p className="mx-auto max-w-lg font-sans text-lg leading-relaxed text-white/70">
              Book a consultation and we will tell you whether {service.title} is
              the right place to begin.
            </p>
          </RevealItem>

          <RevealItem className="mt-10">
            <AnimatedLink
              href="/book"
              arrow
              className="inline-flex items-center rounded-full bg-white px-8 py-3.5 font-sans text-sm font-medium text-primary shadow-soft transition-shadow duration-300 hover:shadow-md"
            >
              Book a Consultation
            </AnimatedLink>
          </RevealItem>
        </RevealGroup>
      </section>
    </>
  )
}
