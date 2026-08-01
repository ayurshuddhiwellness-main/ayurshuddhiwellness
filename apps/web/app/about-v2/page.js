'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import styles from './about-v2.module.css'

// Content + imagery lifted from the current /about page (AboutStory beats).
const SLIDES = [
  {
    eyebrow: '01 — The Roots',
    headline: 'A practice rooted in lineage.',
    body: 'AyurshuddhiWellness began not as a business, but as a continuation of family tradition — Ayurvedic knowledge passed down through generations.',
    image: '/images/practitioner/founder_image_1.JPEG',
    alt: 'Founder — family roots in Ayurveda',
  },
  {
    eyebrow: '02 — The Study',
    headline: 'Refined through study.',
    body: 'What started as personal practice grew through rigorous clinical training, adapting centuries-old methods for the lives we live today.',
    image: '/images/practitioner/founder_image_2.jpg',
    alt: 'Founder — clinical training and study',
  },
  {
    eyebrow: '03 — The Practice',
    headline: 'Grown into a community.',
    body: 'Every consultation we offer carries that same intention: to treat the person, not just the symptom.',
    image: '/images/practitioner/founder_image_3.JPEG',
    alt: 'Founder — community practice',
  },
]

const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Book Now', href: '/#contact' },
]

export default function AboutV2Page() {
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const touchStartY = useRef(0)
  const imgRefs = useRef([])
  const reduce = useReducedMotion()
  const reduceRef = useRef(false)

  useEffect(() => {
    reduceRef.current = reduce
  }, [reduce])

  // Lock page scroll — this is a full-screen wheel-driven experience.
  useEffect(() => {
    const html = document.documentElement
    const prevHtml = html.style.overflow
    const prevBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  // Advance/reverse with a debounce flag (ref, not state — avoids stale
  // closures in the window-level event handlers registered once).
  const goTo = useCallback((dir) => {
    if (isAnimatingRef.current) return
    const next = Math.min(Math.max(currentRef.current + dir, 0), SLIDES.length - 1)
    if (next === currentRef.current) return
    currentRef.current = next
    isAnimatingRef.current = true
    setCurrent(next)
    setTimeout(
      () => {
        isAnimatingRef.current = false
      },
      reduceRef.current ? 400 : 1000,
    )
  }, [])

  // Wheel / keyboard / touch navigation
  useEffect(() => {
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 5) return
      goTo(e.deltaY > 0 ? 1 : -1)
    }
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        goTo(1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goTo(-1)
      }
    }
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (delta > 50) goTo(1)
      else if (delta < -50) goTo(-1)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goTo])

  // Mouse parallax on the active slide's image — direct DOM writes via refs,
  // no re-renders. Disabled entirely under reduced motion.
  useEffect(() => {
    if (reduce) return
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      const el = imgRefs.current[currentRef.current]
      if (el) el.style.transform = `translate(${x}px, ${y}px) scale(1.06)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduce])

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      {/* Navbar — standard overlay on the linen slides */}
      <div className="fixed inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      {/* Slides */}
      {SLIDES.map((slide, i) => {
        const active = i === current
        return (
          <section
            key={slide.eyebrow}
            aria-hidden={!active}
            className={`${styles.slide} ${active ? styles.active : ''} z-10`}
          >
            {/* Upper-right triangle — text side */}
            <div className={`${styles.topTriangle} bg-background`}>
              <div className="absolute right-[8%] top-[40%] max-w-xl -translate-y-1/2 text-right">
                <p className="mb-5 font-sans text-[11px] uppercase tracking-[0.25em] text-primary">
                  {slide.eyebrow}
                </p>
                <h2 className="font-serif text-[clamp(2.75rem,6.5vw,5.25rem)] font-normal leading-tight text-foreground">
                  {slide.headline}
                </h2>
                <p className="ml-auto mt-6 max-w-md font-sans text-base leading-relaxed text-muted">
                  {slide.body}
                </p>
              </div>
            </div>

            {/* Lower-left triangle — image side */}
            <div className={styles.bottomTriangle}>
              <div
                ref={(el) => {
                  imgRefs.current[i] = el
                }}
                className={`relative h-full w-full ${styles.parallax}`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  className="object-cover object-[30%_center]"
                  priority={i === 0}
                />
              </div>
            </div>
          </section>
        )
      })}

      {/* Slide indicators — right edge */}
      <div
        aria-hidden="true"
        className="fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3"
      >
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`block transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === current
                ? 'h-6 w-0.5 bg-primary'
                : 'h-1.5 w-1.5 rounded-full border border-primary/50'
            }`}
          />
        ))}
      </div>

      {/* Fixed footer bar */}
      <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 px-8 py-4 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="font-sans text-xs uppercase tracking-widest text-muted">
            © 2026 AyurshuddhiWellness — Ancient Wisdom. Modern Balance.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
